import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { styled } from 'nativewind';
import { useTheme } from '../../providers/ThemeProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledText = styled(Text);

// Define variants
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
    className?: string;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    icon,
    loading = false,
    disabled = false,
    className = ''
}: ButtonProps) {
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

    // Variant Styles
    const getBaseStyles = () => {
        let base = "flex-row items-center justify-center rounded-2xl";

        switch (variant) {
            case 'primary': return `${base} bg-primary border border-primary/10 shadow-sm shadow-primary/20`;
            case 'secondary': return `${base} bg-surface border border-border`;
            case 'outline': return `${base} bg-transparent border border-border`;
            case 'ghost': return `${base} bg-transparent`;
            case 'destructive': return `${base} bg-accent border border-accent/10`;
            default: return base;
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm': return "px-3 py-2";
            case 'md': return "px-5 py-3.5";
            case 'lg': return "px-8 py-4";
            default: return "px-5 py-3.5";
        }
    };

    // Text Styles
    const getTextStyles = () => {
        let base = "font-body-bold text-center";

        switch (size) {
            case 'sm': base += " text-sm"; break;
            case 'md': base += " text-base"; break;
            case 'lg': base += " text-lg"; break;
        }

        switch (variant) {
            case 'primary': return `${base} text-white`;
            case 'secondary': return `${base} text-foreground dark:text-white`;
            case 'outline': return `${base} text-foreground dark:text-white`;
            case 'ghost': return `${base} text-muted`;
            case 'destructive': return `${base} text-white`;
            default: return base;
        }
    };

    return (
        <AnimatedPressable
            onPress={disabled || loading ? undefined : onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className={`${getBaseStyles()} ${getSizeStyles()} ${disabled ? 'opacity-50' : ''} ${className}`}
            style={animatedStyle}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? 'white' : '#71717A'} />
            ) : (
                <>
                    {icon && <Animated.View className="mr-2">{icon}</Animated.View>}
                    <StyledText className={getTextStyles()}>{title}</StyledText>
                </>
            )}
        </AnimatedPressable>
    );
}
