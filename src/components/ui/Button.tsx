import React from 'react';
import { Pressable, Text, ActivityIndicator, View, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    icon,
    loading = false,
    disabled = false,
    style
}: ButtonProps) {
    const { theme, isDark } = useTheme();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        if (disabled || loading) return;
        scale.value = withSpring(0.96);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: theme.colors.primary,
                    borderColor: 'rgba(13, 148, 136, 0.1)',
                    borderWidth: 1,
                };
            case 'secondary':
                return {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                };
            case 'destructive':
                return {
                    backgroundColor: theme.colors.danger,
                    borderColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 1,
                };
            default:
                return {};
        }
    };

    const getSizeStyles = (): ViewStyle => {
        switch (size) {
            case 'sm': return { paddingHorizontal: 12, paddingVertical: 8 };
            case 'md': return { paddingHorizontal: 20, paddingVertical: 14 };
            case 'lg': return { paddingHorizontal: 32, paddingVertical: 16 };
            default: return { paddingHorizontal: 20, paddingVertical: 14 };
        }
    };

    const getTextColor = (): string => {
        switch (variant) {
            case 'primary':
            case 'destructive':
                return '#FFFFFF';
            case 'ghost':
                return theme.colors.muted;
            default:
                return theme.colors.foreground;
        }
    };

    const getTextSize = (): number => {
        switch (size) {
            case 'sm': return 14;
            case 'md': return 16;
            case 'lg': return 18;
            default: return 16;
        }
    };

    return (
        <AnimatedPressable
            onPress={disabled || loading ? undefined : onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.button,
                getVariantStyles(),
                getSizeStyles(),
                disabled && styles.disabled,
                animatedStyle,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? 'white' : '#71717A'} />
            ) : (
                <>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={[
                        styles.text,
                        { color: getTextColor(), fontSize: getTextSize(), fontFamily: theme.fonts.bodyBold }
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    iconContainer: {
        marginRight: 8,
    },
    text: {
        fontWeight: '700',
        textAlign: 'center',
    },
});
