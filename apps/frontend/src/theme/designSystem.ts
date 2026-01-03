import { ThemeConfig, theme } from 'antd';

// Paleta de colores extraída de ex.color.html
const colors = {
  primary: '#30e87a', // Green Neon
  backgroundDark: '#112117', // Very Dark Green (Main Background)
  surfaceDark: '#1a3224', // Dark Green (Cards, Sidebar)
  surfaceLight: '#244732', // Lighter Green (Borders, Hover)
  textMuted: '#93c8a8', // Muted Green Text
  textWhite: '#ffffff',
  borderColor: '#244732',
};

export const designSystem: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    // Tokens Globales
    colorPrimary: colors.primary,
    colorBgBase: colors.backgroundDark, // Fondo base de la app
    colorBgContainer: colors.surfaceDark, // Fondo de contenedores (Cards, Modals)
    colorBgElevated: colors.surfaceLight, // Dropdowns, Tooltips
    colorTextBase: colors.textWhite,
    colorTextSecondary: colors.textMuted,
    colorBorder: colors.borderColor,
    colorBorderSecondary: colors.surfaceDark,
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    Layout: {
      bodyBg: colors.backgroundDark,
      headerBg: colors.backgroundDark,
      siderBg: colors.backgroundDark,
      triggerBg: colors.surfaceLight,
    },
    Typography: {
      colorText: colors.textWhite,
      colorTextSecondary: colors.textMuted,
    },
    Card: {
      colorBgContainer: colors.surfaceDark,
      colorBorderSecondary: colors.borderColor,
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: colors.surfaceLight,
      itemSelectedColor: colors.textWhite,
      itemColor: colors.textMuted,
      itemHoverColor: colors.textWhite,
      itemHoverBg: 'rgba(255, 255, 255, 0.05)',
    },
    Button: {
      primaryShadow: '0 4px 14px 0 rgba(48, 232, 122, 0.3)', // Sombra neón para botón primario
      fontWeight: 600,
    },
    Input: {
      colorBgContainer: colors.backgroundDark,
      colorBorder: colors.borderColor,
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.primary,
    },
    Select: {
      colorBgContainer: colors.backgroundDark,
      colorBorder: colors.borderColor,
      optionSelectedBg: colors.surfaceLight,
    },
    Table: {
      colorBgContainer: colors.surfaceDark,
      headerBg: 'rgba(36, 71, 50, 0.5)', // surfaceLight con opacidad
      headerColor: colors.textWhite,
      borderColor: colors.borderColor,
      rowHoverBg: 'rgba(48, 232, 122, 0.05)',
    },
    Tabs: {
      itemColor: colors.textMuted,
      itemSelectedColor: colors.primary,
      itemHoverColor: colors.textWhite,
      inkBarColor: colors.primary,
    },
  },
};
