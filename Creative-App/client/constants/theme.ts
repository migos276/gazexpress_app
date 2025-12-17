import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1A1A1A",
    textSecondary: "#616161",
    buttonText: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: "#1976D2",
    link: "#1976D2",
    backgroundRoot: "#F5F7FA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F2F2F2",
    backgroundTertiary: "#E6E6E6",
    border: "#E0E0E0",
    primary: "#1976D2",
    primaryPressed: "#1565C0",
    primaryLight: "#BBDEFB",
    secondary: "#FF9800",
    secondaryPressed: "#F57C00",
    success: "#4CAF50",
    warning: "#FFA726",
    info: "#29B6F6",
    error: "#EF5350",
    active: "#66BB6A",
    roleClient: "#1976D2",
    roleLivreur: "#00C853",
    roleStation: "#6200EA",
    roleAdmin: "#D32F2F",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#0A84FF",
    link: "#0A84FF",
    backgroundRoot: "#1F2123",
    backgroundDefault: "#2A2C2E",
    backgroundSecondary: "#353739",
    backgroundTertiary: "#404244",
    border: "#404244",
    primary: "#0A84FF",
    primaryPressed: "#0066CC",
    primaryLight: "#1E3A5F",
    secondary: "#FF9F0A",
    secondaryPressed: "#CC7F08",
    success: "#30D158",
    warning: "#FF9F0A",
    info: "#64D2FF",
    error: "#FF453A",
    active: "#30D158",
    roleClient: "#0A84FF",
    roleLivreur: "#30D158",
    roleStation: "#BF5AF2",
    roleAdmin: "#FF453A",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  inputHeight: 48,
  buttonHeight: 48,
  fabSize: 56,
  iconSmall: 20,
  iconMedium: 24,
  iconLarge: 32,
  avatarSmall: 40,
  avatarLarge: 80,
  cardImageHeight: 120,
  tabBarHeight: 56,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 28,
  full: 9999,
};

export const Typography = {
  hero: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const OrderStatus = {
  pending: { color: Colors.light.warning, label: "En attente" },
  assigned: { color: Colors.light.info, label: "Assignée" },
  in_progress: { color: Colors.light.success, label: "En cours" },
  delivered: { color: Colors.light.textSecondary, label: "Livrée" },
  cancelled: { color: Colors.light.error, label: "Annulée" },
};
