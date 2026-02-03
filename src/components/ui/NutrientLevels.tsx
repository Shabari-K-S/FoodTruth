import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption } from './Typography';
import { theme } from '../../theme';
import { useTheme } from '../../providers/ThemeProvider';

interface NutrientLevelsProps {
    levels?: {
        fat?: 'low' | 'moderate' | 'high';
        salt?: 'low' | 'moderate' | 'high';
        'saturated-fat'?: 'low' | 'moderate' | 'high';
        sugars?: 'low' | 'moderate' | 'high';
    };
    nutriments?: {
        fat_100g?: number;
        salt_100g?: number;
        saturated_fat_100g?: number;
        sugars_100g?: number;
    };
}

const LEVEL_CONFIG = {
    low: { color: theme.colors.primary, icon: 'checkmark-circle', text: 'Low' },
    moderate: { color: theme.colors.caution, icon: 'alert-circle', text: 'Moderate' },
    high: { color: theme.colors.danger, icon: 'close-circle', text: 'High' },
};

export function NutrientLevels({ levels, nutriments }: NutrientLevelsProps) {
    const { isDark } = useTheme();

    if (!levels) return null;

    const nutrients = [
        { key: 'fat', label: 'Fat', value: nutriments?.fat_100g, unit: 'g' },
        { key: 'saturated-fat', label: 'Saturated Fat', value: nutriments?.saturated_fat_100g, unit: 'g' },
        { key: 'sugars', label: 'Sugars', value: nutriments?.sugars_100g, unit: 'g' },
        { key: 'salt', label: 'Salt', value: nutriments?.salt_100g, unit: 'g' },
    ];

    return (
        <View style={styles.container}>
            <H3 style={[styles.title, { color: isDark ? '#F4F4F5' : '#18181B' }]}>Nutrient Levels</H3>
            <View style={[
                styles.card,
                {
                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : '#FAFAFA',
                    borderColor: isDark ? '#27272A' : '#F4F4F5',
                }
            ]}>
                {nutrients.map((nutrient, index) => {
                    const level = levels[nutrient.key as keyof typeof levels];
                    if (!level) return null;

                    const config = LEVEL_CONFIG[level];

                    return (
                        <View
                            key={nutrient.key}
                            style={[
                                styles.row,
                                index < nutrients.length - 1 && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: isDark ? '#27272A' : '#F4F4F5',
                                }
                            ]}
                        >
                            <View style={styles.leftContent}>
                                <Ionicons
                                    name={config.icon as any}
                                    size={20}
                                    color={config.color}
                                />
                                <Body style={[styles.label, { color: isDark ? '#D4D4D8' : '#3F3F46' }]}>
                                    {nutrient.label}
                                </Body>
                            </View>
                            <View style={styles.rightContent}>
                                {nutrient.value !== undefined && (
                                    <Caption style={styles.valueText}>
                                        {nutrient.value.toFixed(1)}{nutrient.unit}
                                    </Caption>
                                )}
                                <View style={[styles.badge, { backgroundColor: config.color + '20' }]}>
                                    <Caption style={[styles.badgeText, { color: config.color }]}>
                                        {config.text}
                                    </Caption>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        marginBottom: 12,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginLeft: 12,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        color: '#A1A1AA',
        marginRight: 12,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    badgeText: {
        fontWeight: '700',
        fontSize: 10,
        textTransform: 'uppercase',
    },
});
