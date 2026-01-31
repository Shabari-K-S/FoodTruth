import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption, BodyBold } from './Typography';
import { theme } from '../../theme';

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
    if (!levels) return null;

    const nutrients = [
        { key: 'fat', label: 'Fat', value: nutriments?.fat_100g, unit: 'g' },
        { key: 'saturated-fat', label: 'Saturated Fat', value: nutriments?.saturated_fat_100g, unit: 'g' },
        { key: 'sugars', label: 'Sugars', value: nutriments?.sugars_100g, unit: 'g' },
        { key: 'salt', label: 'Salt', value: nutriments?.salt_100g, unit: 'g' },
    ];

    return (
        <View className="mb-6">
            <H3 className="mb-3 text-zinc-900 dark:text-zinc-100">Nutrient Levels</H3>
            <View className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                {nutrients.map((nutrient, index) => {
                    const level = levels[nutrient.key as keyof typeof levels];
                    if (!level) return null;

                    const config = LEVEL_CONFIG[level];

                    return (
                        <View
                            key={nutrient.key}
                            className={`flex-row items-center justify-between py-3 ${index < nutrients.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                        >
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={config.icon as any}
                                    size={20}
                                    color={config.color}
                                />
                                <Body className="ml-3 text-zinc-700 dark:text-zinc-300">{nutrient.label}</Body>
                            </View>
                            <View className="flex-row items-center">
                                {nutrient.value !== undefined && (
                                    <Caption className="text-zinc-400 mr-3">
                                        {nutrient.value.toFixed(1)}{nutrient.unit}
                                    </Caption>
                                )}
                                <View
                                    className="px-3 py-1 rounded-full"
                                    style={{ backgroundColor: config.color + '20' }}
                                >
                                    <Caption
                                        className="font-bold text-[10px] uppercase"
                                        style={{ color: config.color }}
                                    >
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
