import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface CardProps extends ViewProps {
    variant?: 'elevated' | 'flat' | 'outlined' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    intensity?: number;
    children: React.ReactNode;
}

export function Card({
    variant = 'elevated',
    padding = 'md',
    intensity = 100,
    children,
    style,
    ...props
}: CardProps) {
    const { theme, isDark } = useTheme();

    const getPaddingValue = (): number => {
        switch (padding) {
            case 'none': return 0;
            case 'sm': return 12;
            case 'md': return 16;
            case 'lg': return 24;
            default: return 16;
        }
    };

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: theme.colors.surface,
                    borderColor: isDark ? '#27272A' : '#F4F4F5',
                    borderWidth: 1,
                };
            case 'flat':
                return {
                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : '#FAFAFA',
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                    borderWidth: 1,
                };
            case 'glass':
                return {
                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    borderColor: isDark ? 'rgba(63, 63, 70, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                };
            default:
                return {};
        }
    };

    return (
        <View
            {...props}
            style={[
                styles.card,
                { padding: getPaddingValue() },
                getVariantStyles(),
                { opacity: intensity / 100 },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
});
