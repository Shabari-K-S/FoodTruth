import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Pressable, ScrollView, Alert } from 'react-native';
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
            className="w-12 h-7 rounded-full justify-center px-1"
            style={{ backgroundColor: value ? activeColor : '#71717A' }}
        >
            <Animated.View
                className="w-5 h-5 rounded-full bg-white shadow-sm"
                style={{ transform: [{ translateX }] }}
            />
        </Pressable>
    );
};

// Enhanced Setting Row with isLast prop to remove bottom border
const SettingRow = ({
    label,
    description,
    value,
    onValueChange,
    icon,
    theme,
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
                className={`flex-row items-center justify-between py-4 px-4 ${!isLast ? 'border-b border-border/20' : ''}`}
            >
                <View className="flex-1 mr-4 flex-row items-center">
                    {icon && (
                        <View
                            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                            style={{ backgroundColor: danger ? '#EF444420' : iconStyle.bg }}
                        >
                            <Ionicons
                                name={icon}
                                size={20}
                                color={danger ? '#EF4444' : iconStyle.color}
                            />
                        </View>
                    )}
                    <View className="flex-1">
                        <Body className={danger ? 'text-red-500 font-medium' : 'text-foreground font-medium'}>
                            {label}
                        </Body>
                        {description && (
                            <Caption className="mt-0.5 leading-4 text-muted">
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
const SectionHeader = ({ title }: any) => (
    <View className="flex-row items-center mb-3 mt-6 px-1">
        <View className="w-1 h-4 rounded-full bg-primary mr-2" />
        <H3 className="text-xs font-bold uppercase tracking-widest text-muted">
            {title}
        </H3>
    </View>
);

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, isDark, setDarkMode } = useTheme();
    const [preferences, setPreferences] = useState({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        notifications: true,
        dataSync: true,
    });

    const toggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Dietary preferences data
    const dietaryOptions = [
        { label: "Vegetarian", description: "Hide non-vegetarian products", icon: "leaf-outline", key: "vegetarian" },
        { label: "Vegan", description: "Filter all animal products", icon: "flower-outline", key: "vegan" },
        { label: "Gluten Free", description: "Show gluten-free alternatives", icon: "nutrition-outline", key: "glutenFree" },
    ];

    // App settings data
    const appSettings = [
        { label: "Dark Mode", description: "Easier on the eyes at night", icon: "moon-outline", key: "darkMode", value: isDark, onChange: () => setDarkMode(!isDark) },
    ];

    return (
        <ScreenLayout className="flex-1 bg-background">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="px-6 pt-12 pb-6">
                    <View className="flex-row items-center justify-between mb-2">
                        <Caption className="text-primary font-semibold mb-1 tracking-wider">FOODTRUTH</Caption>
                        <Pressable
                            className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-border/20"
                            onPress={() => router.push('/profile')}
                        >
                            <Ionicons name="person" size={20} color={theme.colors.primary} />
                        </Pressable>
                    </View>
                    <H1 className="text-3xl font-bold">Settings</H1>
                </View>

                <View className="px-6 pb-8">
                    {/* Dietary Preferences */}
                    <SectionHeader title="Dietary Preferences" />
                    <Card className="p-0 overflow-hidden bg-surface">
                        {dietaryOptions.map((item, index) => (
                            <SettingRow
                                key={item.key}
                                label={item.label}
                                description={item.description}
                                icon={item.icon}
                                value={preferences[item.key as keyof typeof preferences]}
                                onValueChange={() => toggle(item.key as keyof typeof preferences)}
                                theme={theme}
                                isLast={index === dietaryOptions.length - 1}  // ✨ Last item has no border
                            />
                        ))}
                    </Card>

                    {/* App Settings */}
                    <SectionHeader title="App Settings" />
                    <Card className="p-0 overflow-hidden bg-surface mb-4">
                        {appSettings.map((item, index) => (
                            <SettingRow
                                key={item.key}
                                label={item.label}
                                description={item.description}
                                icon={item.icon}
                                value={item.key === 'darkMode' ? isDark : preferences[item.key as keyof typeof preferences]}
                                onValueChange={item.onChange || (() => toggle(item.key as keyof typeof preferences))}
                                theme={theme}
                                isLast={index === appSettings.length - 1}  // ✨ Last item has no border
                            />
                        ))}
                    </Card>

                    {/* Footer */}
                    <View className="items-center mt-4">
                        <Caption className="text-muted/50 text-center">
                            FoodTruth v1.0.0 • Build 2026
                        </Caption>
                    </View>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
}