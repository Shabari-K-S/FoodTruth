import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface TypographyProps extends TextProps {
    className?: string;
    children: React.ReactNode;
}

export const H1 = ({ className = '', style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            className={`font-display text-4xl mb-2 ${className}`}
            style={[{ color: theme.colors.foreground }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const H2 = ({ className = '', style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            className={`font-display text-2xl mb-2 ${className}`}
            style={[{ color: theme.colors.foreground }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const H3 = ({ className = '', style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            className={`font-display text-xl mb-1 ${className}`}
            style={[{ color: theme.colors.foreground }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const Body = ({ className = '', style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            className={`font-body text-base ${className}`}
            style={[{ color: theme.colors.foreground, opacity: 0.8 }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const BodyBold = ({ className = '', style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            className={`font-body-bold text-base ${className}`}
            style={[{ color: theme.colors.foreground }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const Caption = ({ className = '', style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            className={`font-body text-sm ${className}`}
            style={[{ color: theme.colors.muted }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

