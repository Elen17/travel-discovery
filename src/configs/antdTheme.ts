import type { ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0D6E6E',
    colorError: '#E05A4A',
    colorBgLayout: '#F9F7F4',
    colorText: '#1A1A2E',
    borderRadius: 12,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: 16,
    controlHeight: 44,
  },
  components: {
    Button: {
      primaryShadow: 'none',
      controlHeight: 44,
    },
    Input: {
      controlHeight: 44,
    },
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#F9F7F4',
      footerBg: '#f0eef5',
    },
  },
}

export const designTokens = {
  primary: '#0D6E6E',
  accent: '#FF6B6B',
  accentDark: '#E05A4A',
  background: '#F9F7F4',
  textDark: '#1A1A2E',
  headingFont: "'Playfair Display', Georgia, serif",
  bodyFont: "'DM Sans', system-ui, sans-serif",
} as const
