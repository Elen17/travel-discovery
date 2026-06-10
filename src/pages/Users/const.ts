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

export const ROLE_LABEL_KEYS = {
  Admin: USERS_I18N.roles.admin,
  User: USERS_I18N.roles.user,
} as const
