import { MailOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { subscribeToEvents } from '@/api/events'
import { isValidEmail } from '@/utils/validation'
import { NEWSLETTER_I18N } from './const'
import styles from './styles.module.css'
import type { NewsletterSubscribeProps, NewsletterSubscribeValues } from './types'

export const NewsletterSubscribe = ({ className }: NewsletterSubscribeProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm<NewsletterSubscribeValues>()
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const sectionClass = className ? `${styles.section} ${className}` : styles.section

  const handleFinish = async (values: NewsletterSubscribeValues) => {
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const response = await subscribeToEvents({ email: values.email.trim() })
      setSuccessMessage(response.message || t(NEWSLETTER_I18N.success))
      form.resetFields()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrorMessage(t(NEWSLETTER_I18N.errors.generic))
      } else {
        setErrorMessage(t(NEWSLETTER_I18N.errors.generic))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={sectionClass} aria-labelledby="newsletter-heading">
      <MailOutlined className={styles.icon} aria-hidden />
      <h2 id="newsletter-heading" className={styles.title}>
        {t(NEWSLETTER_I18N.title)}
      </h2>
      <p className={styles.description}>{t(NEWSLETTER_I18N.description)}</p>

      {successMessage ? <p className={styles.success}>{successMessage}</p> : null}

      <Form
        form={form}
        className={styles.form}
        onFinish={handleFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          validateStatus={errorMessage ? 'error' : undefined}
          help={errorMessage}
          rules={[
            { required: true, message: t(NEWSLETTER_I18N.errors.emailRequired) },
            {
              validator: async (_, value: string | undefined) => {
                if (!value || isValidEmail(value.trim())) return
                throw new Error(t(NEWSLETTER_I18N.errors.emailInvalid))
              },
            },
          ]}
        >
          <Input
            type="email"
            className={styles.input}
            placeholder={t(NEWSLETTER_I18N.emailPlaceholder)}
            aria-label={t(NEWSLETTER_I18N.emailPlaceholder)}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className={styles.submitBtn}
          loading={loading}
        >
          {t(NEWSLETTER_I18N.submit)}
        </Button>
      </Form>

      <p className={styles.disclaimer}>
        {t(NEWSLETTER_I18N.disclaimerPrefix)}{' '}
        <Link to="#">{t('footer.privacy')}</Link> {t(NEWSLETTER_I18N.disclaimerAnd)}{' '}
        <Link to="#">{t('footer.terms')}</Link>.
      </p>
    </section>
  )
}
