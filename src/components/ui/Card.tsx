import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';
import { useTheme } from '../../providers/ThemeProvider';

const StyledView = styled(View);

interface CardProps extends ViewProps {
    className?: string;
    variant?: 'elevated' | 'flat' | 'outlined' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    intensity?: number;
    children: React.ReactNode;
}

export function Card({
    className = '',
    variant = 'elevated',
    padding = 'md',
    intensity = 100,
    children,
    style,
    ...props
}: CardProps) {
    const { theme, isDark } = useTheme();

    const getPadding = () => {
        switch (padding) {
            case 'none': return '';
            case 'sm': return 'p-3';
            case 'md': return 'p-4';
            case 'lg': return 'p-6';
            default: return 'p-4';
        }
    };

    const paddingClass = getPadding();

    const getVariantStyles = () => {
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
        <StyledView
            className={`rounded-2xl shadow-sm ${paddingClass} ${className}`}
            {...props}
            style={[
                getVariantStyles(),
                { opacity: intensity / 100 },
                style,
            ]}
        >
            {children}
        </StyledView>
    );
}
