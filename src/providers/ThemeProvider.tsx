import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base theme definition with light and dark variants
const lightColors = {
    // Base
    canvas: '#FFFFFF',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    foreground: '#18181B',

    // Brand
    primary: '#0D9488', // Sage Green
    caution: '#F59E0B', // Goldenrod
    danger: '#EF4444', // Coral Red

    // UI
    muted: '#71717A',
    border: '#E4E4E7',

    // Semantic
    ultraProcessed: '#7C3AED',
    natural: '#10B981',
};

const darkColors = {
    // Base
    canvas: '#000000',
    background: '#020617',
    surface: '#18181B',
    foreground: '#FAFAFA',

    // Brand (same as light mode)
    primary: '#0D9488',
    caution: '#F59E0B',
    danger: '#EF4444',

    // UI
    muted: '#A1A1AA',
    border: '#27272A',

    // Semantic (same as light mode)
    ultraProcessed: '#7C3AED',
    natural: '#10B981',
};

const baseTheme = {
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    radius: {
        sm: 8,
        md: 12,
        lg: 20,
        xl: 24,
        xxl: 32,
        full: 9999,
    },
    fonts: {
        display: 'Outfit_700Bold',
        body: 'Lexend_400Regular',
        bodyBold: 'Lexend_700Bold',
    },
};

const createTheme = (isDark: boolean) => ({
    ...baseTheme,
    colors: isDark ? darkColors : lightColors,
    isDark,
});

type Theme = ReturnType<typeof createTheme>;

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
    setDarkMode: (enabled: boolean) => void;
}

const THEME_STORAGE_KEY = '@foodtruth_theme';

const ThemeContext = createContext<ThemeContextType>({
    theme: createTheme(false),
    isDark: false,
    toggleTheme: () => { },
    setDarkMode: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved theme preference on mount
    useEffect(() => {
        const loadThemePreference = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme !== null) {
                    setIsDark(savedTheme === 'dark');
                } else {
                    // Default to system preference
                    setIsDark(systemColorScheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
                setIsDark(systemColorScheme === 'dark');
            } finally {
                setIsLoaded(true);
            }
        };

        loadThemePreference();
    }, [systemColorScheme]);

    // Save theme preference when it changes
    useEffect(() => {
        if (isLoaded) {
            const saveThemePreference = async () => {
                try {
                    await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
                } catch (error) {
                    console.error('Failed to save theme preference:', error);
                }
            };

            saveThemePreference();
        }
    }, [isDark, isLoaded]);

    const theme = useMemo(() => createTheme(isDark), [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);
    const setDarkMode = (enabled: boolean) => setIsDark(enabled);

    const value = useMemo(
        () => ({ theme, isDark, toggleTheme, setDarkMode }),
        [theme, isDark]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

// Legacy export for backward compatibility - returns just the theme object
export const useThemeColors = () => {
    const { theme } = useContext(ThemeContext);
    return theme;
};
