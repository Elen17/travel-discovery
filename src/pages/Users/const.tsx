import { Form, Input } from 'antd'
import type { TFunction } from 'i18next'
import { UserRole } from '@/types/user'
import { PASSWORD_I18N } from '@/i18n/validation'
import { getNewPasswordRules, isValidEmail } from '@/utils/validation'

export const USERS_I18N = {
  title: 'pages.users.title',
  addUser: 'pages.users.addUser',
  loadError: 'pages.users.loadError',
  empty: 'pages.users.empty',
  table: {
    avatar: 'pages.users.table.avatar',
    fullName: 'pages.users.table.fullName',
    email: 'pages.users.table.email',
    role: 'pages.users.table.role',
    actions: 'pages.users.table.actions',
    edit: 'pages.users.table.edit',
    delete: 'pages.users.table.delete',
  },
  roles: {
    admin: 'pages.users.roles.admin',
    user: 'pages.users.roles.user',
  },
  form: {
    fullName: 'pages.users.form.fullName',
    fullNamePlaceholder: 'pages.users.form.fullNamePlaceholder',
    email: 'pages.users.form.email',
    emailPlaceholder: 'pages.users.form.emailPlaceholder',
    avatarUrl: 'pages.users.form.avatarUrl',
    avatarUrlPlaceholder: 'pages.users.form.avatarUrlPlaceholder',
  },
  modals: {
    addTitle: 'pages.users.modals.addTitle',
    editTitle: 'pages.users.modals.editTitle',
    deleteTitle: 'pages.users.modals.deleteTitle',
    deleteConfirm: 'pages.users.modals.deleteConfirm',
  },
  actions: {
    create: 'pages.users.actions.create',
    save: 'pages.users.actions.save',
    cancel: 'pages.users.actions.cancel',
    delete: 'pages.users.actions.delete',
  },
  validation: {
    fullNameRequired: 'pages.users.validation.fullNameRequired',
    fullNameMin: 'pages.users.validation.fullNameMin',
    emailRequired: 'pages.users.validation.emailRequired',
    emailInvalid: 'pages.users.validation.emailInvalid',
  },
  messages: {
    createSuccess: 'pages.users.messages.createSuccess',
    updateSuccess: 'pages.users.messages.updateSuccess',
    deleteSuccess: 'pages.users.messages.deleteSuccess',
    genericError: 'pages.users.messages.genericError',
  },
} as const

export const ROLE_LABEL_KEYS: Record<UserRole, string> = {
  [UserRole.ADMIN]: USERS_I18N.roles.admin,
  [UserRole.USER]: USERS_I18N.roles.user,
}

export const usersQueryKeys = {
  list: ['users', 'list'] as const,
}

type UserFormFieldsOptions = {
  includePassword?: boolean
}

export const getUserFormFields = (t: TFunction, options?: UserFormFieldsOptions) => (
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

    {options?.includePassword ? (
      <Form.Item name="password" label={t(PASSWORD_I18N.label)} rules={getNewPasswordRules(t)}>
        <Input.Password
          autoComplete="new-password"
          placeholder={t(PASSWORD_I18N.newPlaceholder)}
        />
      </Form.Item>
    ) : null}

    <Form.Item name="avatarUrl" label={t(USERS_I18N.form.avatarUrl)}>
      <Input placeholder={t(USERS_I18N.form.avatarUrlPlaceholder)} />
    </Form.Item>
  </>
)
