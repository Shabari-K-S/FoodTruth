import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenLayout } from '../../components/ui/ScreenLayout';
import { H1, H3, Body, Caption } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';

// Enhanced Toggle with Spring Animation
const AnimatedToggle = ({ value, onValueChange, activeColor }: any) => {
    const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: value ? 20 : 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, [value]);

    return (
        <Pressable
            onPress={onValueChange}
            style={[styles.toggle, { backgroundColor: value ? activeColor : '#71717A' }]}
        >
            <Animated.View
                style={[styles.toggleKnob, { transform: [{ translateX }] }]}
            />
        </Pressable>
    );
};

// Enhanced Setting Row
const SettingRow = ({
    label,
    description,
    value,
    onValueChange,
    icon,
    theme,
    isDark,
    isLast = false,
    danger = false,
    showArrow = false
}: any) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const iconColors: any = {
        'leaf-outline': { bg: '#22C55E20', color: '#22C55E' },
        'flower-outline': { bg: '#EAB30820', color: '#EAB308' },
        'nutrition-outline': { bg: '#F9731620', color: '#F97316' },
        'moon-outline': { bg: '#8B5CF620', color: '#8B5CF6' },
        'shield-checkmark-outline': { bg: '#10B98120', color: '#10B981' },
        'download-outline': { bg: '#64748B20', color: '#64748B' },
        'trash-outline': { bg: '#EF444420', color: '#EF4444' },
    };

    const iconStyle = iconColors[icon] || { bg: theme.colors.surface, color: theme.colors.foreground };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={() => onValueChange?.()}
                style={[
                    styles.settingRow,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: isDark ? '#27272A' : '#F4F4F5' }
                ]}
            >
                <View style={styles.settingLeft}>
                    {icon && (
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: danger ? '#EF444420' : iconStyle.bg }
                            ]}
                        >
                            <Ionicons
                                name={icon}
                                size={20}
                                color={danger ? '#EF4444' : iconStyle.color}
                            />
                        </View>
                    )}
                    <View style={styles.settingText}>
                        <Body style={[
                            styles.settingLabel,
                            { color: danger ? '#EF4444' : theme.colors.foreground }
                        ]}>
                            {label}
                        </Body>
                        {description && (
                            <Caption style={styles.settingDescription}>
                                {description}
                            </Caption>
                        )}
                    </View>
                </View>

                {onValueChange && !showArrow && (
                    <AnimatedToggle
                        value={value}
                        onValueChange={onValueChange}
                        activeColor={theme.colors.primary}
                    />
                )}

                {(showArrow || !onValueChange) && (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
                )}
            </Pressable>
        </Animated.View>
    );
};

// Section Header Component
const SectionHeader = ({ title, theme }: any) => (
    <View style={styles.sectionHeader}>
        <View style={[styles.sectionIndicator, { backgroundColor: theme.colors.primary }]} />
        <H3 style={styles.sectionTitle}>{title}</H3>
    </View>
);

import { usePreferences } from '../../providers/PreferencesProvider';

// ... (keep Toggle and SettingRow components as is) ...

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, isDark, setDarkMode } = useTheme();
    const { preferences, togglePreference } = usePreferences();

    const dietaryOptions = [
        { label: "Vegetarian", description: "Hide non-vegetarian products", icon: "leaf-outline", key: "vegetarian" },
        { label: "Vegan", description: "Filter all animal products", icon: "flower-outline", key: "vegan" },
        { label: "Gluten Free", description: "Show gluten-free alternatives", icon: "nutrition-outline", key: "glutenFree" },
    ];

    const appSettings = [
        { label: "Dark Mode", description: "Easier on the eyes at night", icon: "moon-outline", key: "darkMode", value: isDark, onChange: () => setDarkMode(!isDark) },
    ];

    return (
        <ScreenLayout>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Caption style={[styles.appName, { color: theme.colors.primary }]}>FOODTRUTH</Caption>
                        <Pressable
                            style={[
                                styles.profileButton,
                                { backgroundColor: theme.colors.surface, borderColor: isDark ? '#27272A' : '#E5E7EB' }
                            ]}
                            onPress={() => router.push('/profile')}
                        >
                            <Ionicons name="person" size={20} color={theme.colors.primary} />
                        </Pressable>
                    </View>
                    <H1 style={styles.title}>Settings</H1>
                </View>

                <View style={styles.content}>
                    {/* Dietary Preferences */}
                    <SectionHeader title="Dietary Preferences" theme={theme} />
                    <Card padding="none" style={{ overflow: 'hidden' }}>
                        {dietaryOptions.map((item, index) => (
                            <SettingRow
                                key={item.key}
                                label={item.label}
                                description={item.description}
                                icon={item.icon}
                                value={(preferences as any)[item.key]}
                                onValueChange={() => togglePreference(item.key as any)}
                                theme={theme}
                                isDark={isDark}
                                isLast={index === dietaryOptions.length - 1}
                            />
                        ))}
                    </Card>

                    {/* App Settings */}
                    <SectionHeader title="App Settings" theme={theme} />
                    <Card padding="none" style={[{ overflow: 'hidden', marginBottom: 16 }]}>
                        <SettingRow
                            label="Dark Mode"
                            description="Easier on the eyes at night"
                            icon="moon-outline"
                            value={isDark}
                            onValueChange={() => setDarkMode(!isDark)}
                            theme={theme}
                            isDark={isDark}
                            isLast={true}
                        />
                    </Card>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Caption style={styles.footerText}>
                            FoodTruth v1.0.0 • Build 2026
                        </Caption>
                    </View>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    appName: {
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 1,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 24,
        paddingHorizontal: 4,
    },
    sectionIndicator: {
        width: 4,
        height: 16,
        borderRadius: 2,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#71717A',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    settingLeft: {
        flex: 1,
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingText: {
        flex: 1,
    },
    settingLabel: {
        fontWeight: '500',
    },
    settingDescription: {
        marginTop: 2,
        lineHeight: 16,
    },
    toggle: {
        width: 48,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    toggleKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
    },
    footerText: {
        textAlign: 'center',
        opacity: 0.5,
    },
});