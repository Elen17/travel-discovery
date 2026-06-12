export const AUTH_I18N = {
  brandWelcome: 'pages.auth.brandWelcome',
  login: {
    title: 'pages.auth.login.title',
    subtitle: 'pages.auth.login.subtitle',
    email: 'pages.auth.login.email',
    emailPlaceholder: 'pages.auth.login.emailPlaceholder',
    submit: 'pages.auth.login.submit',
    noAccount: 'pages.auth.login.noAccount',
    switchToRegister: 'pages.auth.login.switchToRegister',
  },
  register: {
    title: 'pages.auth.register.title',
    subtitle: 'pages.auth.register.subtitle',
    fullName: 'pages.auth.register.fullName',
    fullNamePlaceholder: 'pages.auth.register.fullNamePlaceholder',
    email: 'pages.auth.register.email',
    emailPlaceholder: 'pages.auth.register.emailPlaceholder',
    submit: 'pages.auth.register.submit',
    hasAccount: 'pages.auth.register.hasAccount',
    switchToLogin: 'pages.auth.register.switchToLogin',
  },
  validation: {
    emailRequired: 'pages.auth.validation.emailRequired',
    emailInvalid: 'pages.auth.validation.emailInvalid',
    fullNameRequired: 'pages.auth.validation.fullNameRequired',
    fullNameMin: 'pages.auth.validation.fullNameMin',
  },
  errors: {
    generic: 'pages.auth.errors.generic',
    invalidCredentials: 'pages.auth.errors.invalidCredentials',
    emailTaken: 'pages.auth.errors.emailTaken',
  },
} as const
