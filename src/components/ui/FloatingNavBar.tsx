import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';

export function FloatingNavBar() {
    const router = useRouter();
    const pathname = usePathname();

    const handlePress = (route: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(route as any);
    };

    const isActive = (route: string) => {
        if (route === '/') return pathname === '/' || pathname === '/index';
        return pathname.includes(route);
    };

    return (
        <View style={styles.container}>
            <BlurView intensity={30} tint="default" style={styles.blurContainer}>
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
                            color={isActive('/history') ? theme.colors.primary : theme.colors.muted}
                        />
                        {isActive('/history') && <View style={styles.activeDot} />}
                    </TouchableOpacity>

                    {/* Scan (Center) - Placeholder as the main trigger is on screen, but having a nav item is good fallback */}
                    <TouchableOpacity
                        onPress={() => handlePress('/')}
                        style={styles.centerTabItem}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isActive('/') ? "home" : "home-outline"}
                            size={24}
                            color={isActive('/') ? theme.colors.primary : theme.colors.muted}
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
                            color={isActive('/settings') ? theme.colors.primary : theme.colors.muted}
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
        bottom: 30, // Floating well above bottom
        alignSelf: 'center',
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        width: 200, // Compact pill width
    },
    blurContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
