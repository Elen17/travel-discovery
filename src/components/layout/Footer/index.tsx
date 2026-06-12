import { Col, Layout, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FOOTER_LINKS } from './const'
import styles from './styles.module.css'

const { Footer: AntFooter } = Layout
const { Title } = Typography

export const Footer = () => {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  type FooterLink = { labelKey: string; path: string }

  const renderLinks = (items: readonly FooterLink[]) => (
    <ul className={styles.linkList}>
      {items.map((item) => (
        <li key={item.labelKey}>
          <Link to={item.path}>{t(item.labelKey)}</Link>
        </li>
      ))}
    </ul>
  )

  return (
    <AntFooter className={styles.footer}>
      <div className={styles.inner}>
        <Row gutter={[16, 32]} className={styles.grid} justify="space-between">
          <Col xs={24} sm={12} lg={6} className={styles.firstColumn}>
            <Title level={4} className={styles.brandName}>
              {t('app.name')}
            </Title>
            <span className={styles.contactTitle}>{t('footer.contactUs')}</span>
            <ul className={styles.contactList}>
              <li>
                <a href={`mailto:${t('footer.email')}`}>{t('footer.email')}</a>
              </li>
              <li>
                <a href={`tel:${t('footer.phone').replace(/\s/g, '')}`}>{t('footer.phone')}</a>
              </li>
            </ul>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <span className={styles.columnTitle}>{t('footer.company')}</span>
            {renderLinks(FOOTER_LINKS.company)}
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <span className={styles.columnTitle}>{t('footer.guide')}</span>
            {renderLinks(FOOTER_LINKS.guide)}
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <span className={styles.columnTitle}>{t('footer.support')}</span>
            {renderLinks(FOOTER_LINKS.support)}
          </Col>
        </Row>
        <div className={styles.bottomBar}>{t('footer.copyright', { year })}</div>
      </div>
    </AntFooter>
  )
}
