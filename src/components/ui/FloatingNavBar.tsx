import React from 'react';
import {
    View,
    StyleSheet,
    Pressable
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NavBarItem = ({
    iconName,
    isActive,
    onPress,
    isCenter = false
}: {
    iconName: keyof typeof Ionicons.glyphMap;
    isActive: boolean;
    onPress: () => void;
    isCenter?: boolean;
}) => {
    const { theme, isDark } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.8, { damping: 10, stiffness: 300 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    };

    const colors = {
        inactiveIcon: isDark ? '#A1A1AA' : theme.colors.muted,
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                isCenter ? styles.centerTabItem : styles.tabItem,
                animatedStyle
            ]}
        >
            <Ionicons
                name={isActive ? iconName : (iconName + '-outline') as any}
                size={24}
                color={isActive ? theme.colors.primary : colors.inactiveIcon}
            />
            {isActive && <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]} />}
        </AnimatedPressable>
    );
};

export function FloatingNavBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { theme, isDark } = useTheme();

    const handlePress = (route: string) => {
        router.push(route as any);
    };

    const isActive = (route: string) => {
        if (route === '/') return pathname === '/' || pathname === '/index';
        return pathname.includes(route);
    };

    const colors = {
        blurBg: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        shadowOpacity: isDark ? 0.4 : 0.1,
    };

    return (
        <View style={[
            styles.container,
            { shadowOpacity: colors.shadowOpacity }
        ]}>
            <BlurView
                intensity={isDark ? 40 : 30}
                style={[styles.blurContainer, { backgroundColor: colors.blurBg }]}
            >
                <View style={styles.content}>
                    <NavBarItem
                        iconName="time"
                        isActive={isActive('/history')}
                        onPress={() => handlePress('/history')}
                    />

                    <NavBarItem
                        iconName="home"
                        isActive={isActive('/')}
                        onPress={() => handlePress('/')}
                        isCenter
                    />

                    <NavBarItem
                        iconName="person"
                        isActive={isActive('/settings')}
                        onPress={() => handlePress('/settings')}
                    />
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 12,
        elevation: 5,
        width: 200,
    },
    blurContainer: {
        // Background color applied dynamically for fallback/frosting
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
    },
    centerTabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
    },
    activeDot: {
        position: 'absolute',
        bottom: -4,
        width: 4,
        height: 4,
        borderRadius: 2,
    }
});