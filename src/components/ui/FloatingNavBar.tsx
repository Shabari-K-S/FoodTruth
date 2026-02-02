import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    useColorScheme
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';

export function FloatingNavBar() {
    const router = useRouter();
    const pathname = usePathname();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handlePress = (route: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(route as any);
    };

    const isActive = (route: string) => {
        if (route === '/') return pathname === '/' || pathname === '/index';
        return pathname.includes(route);
    };

    // Dynamic colors based on theme
    const colors = {
        blurTint: isDark ? 'dark' : 'default', // 'default' is light tint
        blurBg: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        shadowOpacity: isDark ? 0.4 : 0.1,
        inactiveIcon: isDark ? '#A1A1AA' : theme.colors.muted, // zinc-400
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
                    {/* History */}
                    <TouchableOpacity
                        onPress={() => handlePress('/history')}
                        style={styles.tabItem}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isActive('/history') ? "time" : "time-outline"}
                            size={24}
                            color={isActive('/history') ? theme.colors.primary : colors.inactiveIcon}
                        />
                        {isActive('/history') && <View style={styles.activeDot} />}
                    </TouchableOpacity>

                    {/* Home (Center) */}
                    <TouchableOpacity
                        onPress={() => handlePress('/')}
                        style={styles.centerTabItem}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isActive('/') ? "home" : "home-outline"}
                            size={24}
                            color={isActive('/') ? theme.colors.primary : colors.inactiveIcon}
                        />
                        {isActive('/') && <View style={styles.activeDot} />}
                    </TouchableOpacity>

                    {/* Profile/Settings */}
                    <TouchableOpacity
                        onPress={() => handlePress('/settings')}
                        style={styles.tabItem}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isActive('/settings') ? "person" : "person-outline"}
                            size={24}
                            color={isActive('/settings') ? theme.colors.primary : colors.inactiveIcon}
                        />
                        {isActive('/settings') && <View style={styles.activeDot} />}
                    </TouchableOpacity>
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
        backgroundColor: theme.colors.primary,
    }
});