export const lightColors = {
    // Base
    canvas: '#FFFFFF',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceAlt: '#F4F4F5', // Zinc-100
    foreground: '#18181B', // Zinc-900

    // Brand
    primary: '#0D9488', // Teal-600
    primaryLight: '#2DD4BF', // Teal-400
    primaryDark: '#0F766E', // Teal-700

    // Status
    danger: '#EF4444',
    caution: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',

    // Semantic
    natural: '#10B981',
    ultraProcessed: '#7C3AED',

    // UI
    muted: '#71717A',
    border: '#E4E4E7',
    borderDark: '#D4D4D8',
};

export const darkColors = {
    // Base
    canvas: '#000000',
    background: '#020617', // Slate-950
    surface: '#18181B', // Zinc-900
    surfaceAlt: '#27272A', // Zinc-800
    foreground: '#FAFAFA', // Zinc-50

    // Brand
    primary: '#0D9488', // Teal-600
    primaryLight: '#2DD4BF', // Teal-400
    primaryDark: '#0F766E', // Teal-700

    // Status
    danger: '#EF4444',
    caution: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',

    // Semantic
    natural: '#10B981',
    ultraProcessed: '#7C3AED',

    // UI
    muted: '#A1A1AA',
    border: '#27272A',
    borderDark: '#3F3F46',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
};

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 9999,
};

export const fonts = {
    display: 'Outfit_700Bold',
    body: 'Lexend_400Regular',
    bodyBold: 'Lexend_700Bold',
};

export const fontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 16,
    },
};

export const layout = {
    headerHeight: 64,
    tabBarHeight: 60,
    maxContentWidth: 1200,
};

export const zIndex = {
    base: 0,
    sticky: 100,
    overlay: 200,
    modal: 300,
    toast: 400,
    tooltip: 500,
};

export const createTheme = (isDark: boolean) => ({
    colors: isDark ? darkColors : lightColors,
    spacing,
    radius,
    fonts,
    fontSizes,
    shadows,
    layout,
    zIndex,
    isDark,
});

// For backward compatibility with existing imports calling `import { theme } from ...`
// Defaulting to light theme. Ideally components should use `useTheme` hook.
export const theme = createTheme(false);

export type Theme = ReturnType<typeof createTheme>;