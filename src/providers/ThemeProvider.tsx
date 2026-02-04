import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTheme, Theme } from '../theme';

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

