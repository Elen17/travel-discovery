import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Avatar, Button, Form, Input, Modal, Skeleton, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUserList } from '@/store/usersSlice'
import { isValidEmail } from '@/utils/validation'
import { ROLE_LABEL_KEYS, USERS_I18N } from './const'
import { useUserList, useUserMutations } from './hooks'
import type { UserFormValues, UsersModalMode, UsersTableRow } from './types'
import styles from './styles.module.css'

const UsersPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [modalMode, setModalMode] = useState<UsersModalMode>(null)
  const [selectedUser, setSelectedUser] = useState<UsersTableRow | null>(null)
  const [form] = Form.useForm<UserFormValues>()

  const users = useAppSelector((state) => state.users.list)

  const { data, isLoading, isError } = useUserList()
  const { createMutation, updateMutation, deleteMutation } = useUserMutations()

  useEffect(() => {
    if (data) {
      dispatch(setUserList(data))
    }
  }, [dispatch, data])

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  useEffect(() => {
    if (modalMode !== 'edit' || !selectedUser) return
    form.setFieldsValue({
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      avatarUrl: selectedUser.avatarUrl ?? undefined,
    })
  }, [form, modalMode, selectedUser])

  const closeModal = () => {
    setModalMode(null)
    setSelectedUser(null)
    form.resetFields()
  }

  const openAddModal = () => {
    form.resetFields()
    setSelectedUser(null)
    setModalMode('add')
  }

  const openEditModal = (user: UsersTableRow) => {
    setSelectedUser(user)
    setModalMode('edit')
  }

  const openDeleteModal = (user: UsersTableRow) => {
    setSelectedUser(user)
    setModalMode('delete')
  }

  const handleCreate = async (values: UserFormValues) => {
    try {
      await createMutation.mutateAsync({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        avatarUrl: values.avatarUrl?.trim() || null,
      })
      message.success(t(USERS_I18N.messages.createSuccess))
      closeModal()
    } catch {
      message.error(t(USERS_I18N.messages.genericError))
    }
  }

  const handleUpdate = async (values: UserFormValues) => {
    if (!selectedUser) return

    try {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        payload: {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          avatarUrl: values.avatarUrl?.trim() || null,
        },
      })
      message.success(t(USERS_I18N.messages.updateSuccess))
      closeModal()
    } catch {
      message.error(t(USERS_I18N.messages.genericError))
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return

    try {
      await deleteMutation.mutateAsync(selectedUser.id)
      message.success(t(USERS_I18N.messages.deleteSuccess))
      closeModal()
    } catch {
      message.error(t(USERS_I18N.messages.genericError))
    }
  }

  const columns: ColumnsType<UsersTableRow> = useMemo(
    () => [
      {
        title: t(USERS_I18N.table.avatar),
        dataIndex: 'avatarUrl',
        key: 'avatar',
        width: 72,
        render: (avatarUrl: string | null, record) => (
          <div className={styles.avatarCell}>
            <Avatar
              src={avatarUrl ?? undefined}
              icon={!avatarUrl ? <UserOutlined /> : undefined}
              alt={record.fullName}
            />
          </div>
        ),
      },
      {
        title: t(USERS_I18N.table.fullName),
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: t(USERS_I18N.table.email),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: t(USERS_I18N.table.role),
        dataIndex: 'role',
        key: 'role',
        render: (role: UsersTableRow['role']) => t(ROLE_LABEL_KEYS[role]),
      },
      {
        title: t(USERS_I18N.table.actions),
        key: 'actions',
        width: 120,
        render: (_, record) => (
          <div className={styles.actionsCell}>
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label={t(USERS_I18N.table.edit)}
              onClick={() => openEditModal(record)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label={t(USERS_I18N.table.delete)}
              onClick={() => openDeleteModal(record)}
            />
          </div>
        ),
      },
    ],
    [t],
  )

  const formFields = (
    <>
      <Form.Item
        name="fullName"
        label={t(USERS_I18N.form.fullName)}
        rules={[
          { required: true, message: t(USERS_I18N.validation.fullNameRequired) },
          { min: 2, message: t(USERS_I18N.validation.fullNameMin) },
        ]}
      >
        <Input placeholder={t(USERS_I18N.form.fullNamePlaceholder)} />
      </Form.Item>

      <Form.Item
        name="email"
        label={t(USERS_I18N.form.email)}
        rules={[
          { required: true, message: t(USERS_I18N.validation.emailRequired) },
          {
            validator: (_, value: string) =>
              !value || isValidEmail(value)
                ? Promise.resolve()
                : Promise.reject(new Error(t(USERS_I18N.validation.emailInvalid))),
          },
        ]}
      >
        <Input type="email" placeholder={t(USERS_I18N.form.emailPlaceholder)} />
      </Form.Item>

      <Form.Item name="avatarUrl" label={t(USERS_I18N.form.avatarUrl)}>
        <Input placeholder={t(USERS_I18N.form.avatarUrlPlaceholder)} />
      </Form.Item>
    </>
  )

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t(USERS_I18N.title)}</h1>
      </header>

      {isError ? (
        <Alert
          type="warning"
          showIcon
          title={t(USERS_I18N.loadError)}
          className={styles.alert}
        />
      ) : null}

      <div className={styles.toolbar}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          {t(USERS_I18N.addUser)}
        </Button>
      </div>

      <div className={styles.tableCard}>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={users}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{ emptyText: t(USERS_I18N.empty) }}
          />
        )}
      </div>

      <Modal
        title={t(USERS_I18N.modals.addTitle)}
        open={modalMode === 'add'}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          requiredMark={false}
        >
          {formFields}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting} block>
              {t(USERS_I18N.actions.create)}
            </Button>
            <Button onClick={closeModal} disabled={isSubmitting} block style={{ marginTop: 8 }}>
              {t(USERS_I18N.actions.cancel)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t(USERS_I18N.modals.editTitle)}
        open={modalMode === 'edit'}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          requiredMark={false}
        >
          {formFields}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting} block>
              {t(USERS_I18N.actions.save)}
            </Button>
            <Button onClick={closeModal} disabled={isSubmitting} block style={{ marginTop: 8 }}>
              {t(USERS_I18N.actions.cancel)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t(USERS_I18N.modals.deleteTitle)}
        open={modalMode === 'delete'}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal} disabled={isSubmitting}>
            {t(USERS_I18N.actions.cancel)}
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={isSubmitting}
            onClick={() => {
              void handleDelete()
            }}
          >
            {t(USERS_I18N.actions.delete)}
          </Button>,
        ]}
        destroyOnHidden
      >
        <p>
          {t(USERS_I18N.modals.deleteConfirm, {
            userName: selectedUser?.fullName ?? '',
          })}
        </p>
      </Modal>
    </div>
  )
}

export default UsersPage
