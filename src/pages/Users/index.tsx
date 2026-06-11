import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Avatar, Button, Form, Modal, Skeleton, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUserList } from '@/store/usersSlice'
import { getUserFormFields, ROLE_LABEL_KEYS, USERS_I18N } from './const'
import { useUserList, useUserMutations } from './hooks'
import {
  UsersModalType,
  type UserFormValues,
  type UsersModalMode,
  type UsersTableRow,
} from './types'
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
    if (modalMode !== UsersModalType.EDIT || !selectedUser) return
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

  const openModal = (mode: Exclude<UsersModalMode, null>, user?: UsersTableRow) => {
    if (mode === UsersModalType.ADD) {
      form.resetFields()
      setSelectedUser(null)
    } else if (user) {
      setSelectedUser(user)
    }
    setModalMode(mode)
  }

  const handleCreate = async (values: UserFormValues) => {
    try {
      await createMutation.mutateAsync({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
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
              className={styles.editBtn}
              icon={<EditOutlined />}
              aria-label={t(USERS_I18N.table.edit)}
              onClick={() => openModal(UsersModalType.EDIT, record)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label={t(USERS_I18N.table.delete)}
              onClick={() => openModal(UsersModalType.DELETE, record)}
            />
          </div>
        ),
      },
    ],
    [t],
  )

  const userFormContent = (
    submitLabel: string,
    onFinish: (values: UserFormValues) => void,
    includePassword = false,
  ) => (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
      {getUserFormFields(t, { includePassword })}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          {submitLabel}
        </Button>
        <Button onClick={closeModal} disabled={isSubmitting} block style={{ marginTop: 8 }}>
          {t(USERS_I18N.actions.cancel)}
        </Button>
      </Form.Item>
    </Form>
  )

  const modalProps = (() => {
    switch (modalMode) {
      case UsersModalType.ADD:
        return {
          title: t(USERS_I18N.modals.addTitle),
          content: userFormContent(t(USERS_I18N.actions.create), handleCreate, true),
          footer: null,
        }
      case UsersModalType.EDIT:
        return {
          title: t(USERS_I18N.modals.editTitle),
          content: userFormContent(t(USERS_I18N.actions.save), handleUpdate),
          footer: null,
        }
      case UsersModalType.DELETE:
        return {
          title: t(USERS_I18N.modals.deleteTitle),
          content: (
            <p>
              {t(USERS_I18N.modals.deleteConfirm, {
                userName: selectedUser?.fullName ?? '',
              })}
            </p>
          ),
          footer: [
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
          ],
        }
      default:
        return null
    }
  })()

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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(UsersModalType.ADD)}>
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
        title={modalProps?.title}
        open={modalMode !== null}
        onCancel={closeModal}
        footer={modalProps?.footer}
        destroyOnHidden
      >
        {modalProps?.content}
      </Modal>
    </div>
  )
}

export default UsersPage
