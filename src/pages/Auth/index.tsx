import { Alert, Button, Form, Input, type FormInstance } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import type { NamePath } from 'antd/es/form/interface'
import { login, register } from '@/api/auth'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { completeAuthSession } from '@/store/authSlice'
import { isValidEmail } from '@/utils/validation'
import { AUTH_I18N, PASSWORD_MIN_LENGTH } from './const'
import styles from './styles.module.css'
import type { AuthMode, LoginFormValues, RegisterFormValues } from './types'
import { parseAuthError } from './utils'

type LocationState = {
  from?: { pathname: string }
}

const AuthPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [loginForm] = Form.useForm<LoginFormValues>()
  const [registerForm] = Form.useForm<RegisterFormValues>()

  const redirectPath = (location.state as LocationState | null)?.from?.pathname ?? '/'

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  const switchMode = (next: AuthMode) => {
    setMode(next)
    setErrorMessage(null)
    loginForm.resetFields()
    registerForm.resetFields()
  }

  const applyFieldErrors = <T extends object>(
    fieldErrors: Record<string, string> | undefined,
    form: FormInstance<T>,
    allowedFields: readonly (keyof T)[],
  ) => {
    if (!fieldErrors) return
    const fields = Object.entries(fieldErrors)
      .filter(([name]) => allowedFields.includes(name as keyof T))
      .map(([name, error]) => ({
        name: name as unknown as NamePath<T>,
        errors: [error],
      }))
    form.setFields(fields)
  }

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await login(values)
      await completeAuthSession(dispatch, response)
      navigate(redirectPath, { replace: true })
    } catch (error) {
      const parsed = parseAuthError(error, t(AUTH_I18N.errors.generic))
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage(t(AUTH_I18N.errors.invalidCredentials))
      } else {
        setErrorMessage(parsed.message)
        applyFieldErrors(parsed.fieldErrors, loginForm, ['email', 'password'])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (values: RegisterFormValues) => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await register(values)
      await completeAuthSession(dispatch, response)
      navigate(redirectPath, { replace: true })
    } catch (error) {
      const parsed = parseAuthError(error, t(AUTH_I18N.errors.generic))
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrorMessage(t(AUTH_I18N.errors.emailTaken))
      } else {
        setErrorMessage(parsed.message)
        applyFieldErrors(parsed.fieldErrors, registerForm, ['fullName', 'email', 'password'])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.brand}>
          {t('app.name')}
        </Link>

        {mode === 'login' ? (
          <>
            <h1 className={styles.heading}>{t(AUTH_I18N.login.title)}</h1>
            <p className={styles.subtitle}>{t(AUTH_I18N.login.subtitle)}</p>

            {errorMessage ? (
              <Alert type="error" message={errorMessage} showIcon className={styles.alert} />
            ) : null}

            <Form
              form={loginForm}
              layout="vertical"
              className={styles.form}
              onFinish={handleLogin}
              requiredMark={false}
            >
              <Form.Item
                name="email"
                label={t(AUTH_I18N.login.email)}
                rules={[
                  { required: true, message: t(AUTH_I18N.validation.emailRequired) },
                  {
                    validator: (_, value: string) =>
                      !value || isValidEmail(value)
                        ? Promise.resolve()
                        : Promise.reject(new Error(t(AUTH_I18N.validation.emailInvalid))),
                  },
                ]}
              >
                <Input
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  placeholder={t(AUTH_I18N.login.emailPlaceholder)}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={t(AUTH_I18N.login.password)}
                rules={[{ required: true, message: t(AUTH_I18N.validation.passwordRequired) }]}
              >
                <Input.Password
                  className={styles.input}
                  autoComplete="current-password"
                  placeholder={t(AUTH_I18N.login.passwordPlaceholder)}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className={styles.submitBtn}
                loading={loading}
              >
                {t(AUTH_I18N.login.submit)}
              </Button>
            </Form>

            <p className={styles.footer}>
              {t(AUTH_I18N.login.noAccount)}
              <button type="button" className={styles.switchBtn} onClick={() => switchMode('register')}>
                {t(AUTH_I18N.login.switchToRegister)}
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.heading}>{t(AUTH_I18N.register.title)}</h1>
            <p className={styles.subtitle}>{t(AUTH_I18N.register.subtitle)}</p>

            {errorMessage ? (
              <Alert type="error" message={errorMessage} showIcon className={styles.alert} />
            ) : null}

            <Form
              form={registerForm}
              layout="vertical"
              className={styles.form}
              onFinish={handleRegister}
              requiredMark={false}
            >
              <Form.Item
                name="fullName"
                label={t(AUTH_I18N.register.fullName)}
                rules={[
                  { required: true, message: t(AUTH_I18N.validation.fullNameRequired) },
                  { min: 2, message: t(AUTH_I18N.validation.fullNameMin) },
                ]}
              >
                <Input
                  className={styles.input}
                  autoComplete="name"
                  placeholder={t(AUTH_I18N.register.fullNamePlaceholder)}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={t(AUTH_I18N.register.email)}
                rules={[
                  { required: true, message: t(AUTH_I18N.validation.emailRequired) },
                  {
                    validator: (_, value: string) =>
                      !value || isValidEmail(value)
                        ? Promise.resolve()
                        : Promise.reject(new Error(t(AUTH_I18N.validation.emailInvalid))),
                  },
                ]}
              >
                <Input
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  placeholder={t(AUTH_I18N.register.emailPlaceholder)}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={t(AUTH_I18N.register.password)}
                rules={[
                  { required: true, message: t(AUTH_I18N.validation.passwordRequired) },
                  { min: PASSWORD_MIN_LENGTH, message: t(AUTH_I18N.validation.passwordMin) },
                ]}
              >
                <Input.Password
                  className={styles.input}
                  autoComplete="new-password"
                  placeholder={t(AUTH_I18N.register.passwordPlaceholder)}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className={styles.submitBtn}
                loading={loading}
              >
                {t(AUTH_I18N.register.submit)}
              </Button>
            </Form>

            <p className={styles.footer}>
              {t(AUTH_I18N.register.hasAccount)}
              <button type="button" className={styles.switchBtn} onClick={() => switchMode('login')}>
                {t(AUTH_I18N.register.switchToLogin)}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthPage
