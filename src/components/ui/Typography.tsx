import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface TypographyProps extends TextProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

export const H1 = ({ style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            style={[styles.h1, { color: theme.colors.foreground, fontFamily: theme.fonts.display }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const H2 = ({ style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            style={[styles.h2, { color: theme.colors.foreground, fontFamily: theme.fonts.display }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const H3 = ({ style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            style={[styles.h3, { color: theme.colors.foreground, fontFamily: theme.fonts.display }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const Body = ({ style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            style={[styles.body, { color: theme.colors.foreground, fontFamily: theme.fonts.body }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const BodyBold = ({ style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            style={[styles.bodyBold, { color: theme.colors.foreground, fontFamily: theme.fonts.bodyBold }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const Caption = ({ style, children, ...props }: TypographyProps) => {
    const { theme } = useTheme();
    return (
        <Text
            style={[styles.caption, { color: theme.colors.muted, fontFamily: theme.fonts.body }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontSize: 36,
        marginBottom: 8,
        fontWeight: '700',
    } as TextStyle,
    h2: {
        fontSize: 24,
        marginBottom: 8,
        fontWeight: '700',
    } as TextStyle,
    h3: {
        fontSize: 20,
        marginBottom: 4,
        fontWeight: '700',
    } as TextStyle,
    body: {
        fontSize: 16,
        opacity: 0.8,
    } as TextStyle,
    bodyBold: {
        fontSize: 16,
        fontWeight: '700',
    } as TextStyle,
    caption: {
        fontSize: 14,
    } as TextStyle,
});
