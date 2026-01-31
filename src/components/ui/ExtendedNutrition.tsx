import React from 'react';
import { View } from 'react-native';
import { H3, Body, BodyBold, Caption } from './Typography';
import { theme } from '../../theme';
import { Nutriments, NutrientLevels } from '../../types/openFoodFacts';

interface ExtendedNutritionProps {
    nutriments?: Nutriments;
    nutrientLevels?: NutrientLevels;
}

const DetailedRow = ({ label, value, unit, indent = false, level }: any) => {
    if (value === undefined || value === null) return null;

    // Safety check for raw numbers vs strings if API varies
    const displayValue = typeof value === 'number' ? Math.round(value * 100) / 100 : value;

    let dotColor = 'transparent';
    if (level === 'high') dotColor = theme.colors.danger;
    if (level === 'moderate') dotColor = theme.colors.caution;
    if (level === 'low') dotColor = theme.colors.primary;

    return (
        <View className={`flex-row justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${indent ? 'pl-4' : ''}`}>
            <Body className="text-zinc-600 dark:text-zinc-400 capitalize flex-1">{label}</Body>
            <View className="flex-row items-center">
                <BodyBold className="text-zinc-900 dark:text-zinc-100 mr-3">{displayValue}{unit}</BodyBold>
                {level && <View className={`w-2 h-2 rounded-full`} style={{ backgroundColor: dotColor }} />}
            </View>
        </View>
    );
};

export function ExtendedNutrition({ nutriments, nutrientLevels }: ExtendedNutritionProps) {
    if (!nutriments) return null;

    return (
        <View className="mb-6">
            <H3 className="mb-3 text-zinc-900 dark:text-zinc-100">Full Nutrition Profile</H3>
            <View className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <Caption className="mb-4 text-zinc-400">per 100g serving</Caption>

                {/* Macros */}
                <DetailedRow label="Energy" value={nutriments.energy_kcal_100g} unit="kcal" />
                <DetailedRow label="Fat" value={nutriments.fat_100g} unit="g" level={nutrientLevels?.fat} />
                <DetailedRow label="Saturated Fat" value={nutriments.saturated_fat_100g} unit="g" indent level={nutrientLevels?.['saturated-fat']} />
                <DetailedRow label="Trans Fat" value={nutriments.trans_fat_100g} unit="g" indent />
                <DetailedRow label="Cholesterol" value={nutriments.cholesterol_100g} unit="mg" indent />

                <DetailedRow label="Carbohydrates" value={nutriments.carbohydrates_100g} unit="g" />
                <DetailedRow label="Sugars" value={nutriments.sugars_100g} unit="g" indent level={nutrientLevels?.sugars} />
                <DetailedRow label="Fiber" value={nutriments.fiber_100g} unit="g" indent />

                <DetailedRow label="Proteins" value={nutriments.proteins_100g} unit="g" />
                <DetailedRow label="Salt" value={nutriments.salt_100g} unit="g" level={nutrientLevels?.salt} />

                {/* Vitamins & Minerals - only show if present */}
                {(nutriments.vitamin_a_100g || nutriments.vitamin_c_100g || nutriments.calcium_100g || nutriments.iron_100g) && (
                    <View className="mt-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <Caption className="mb-2 text-zinc-400 uppercase tracking-widest text-[10px]">Vitamins & Minerals</Caption>
                        <DetailedRow label="Vitamin A" value={nutriments.vitamin_a_100g} unit="µg" />
                        <DetailedRow label="Vitamin C" value={nutriments.vitamin_c_100g} unit="mg" />
                        <DetailedRow label="Vitamin D" value={nutriments.vitamin_d_100g} unit="µg" />
                        <DetailedRow label="Calcium" value={nutriments.calcium_100g} unit="mg" />
                        <DetailedRow label="Iron" value={nutriments.iron_100g} unit="mg" />
                        <DetailedRow label="Potassium" value={nutriments.potassium_100g} unit="mg" />
                    </View>
                )}
            </View>
        </View>
    );
}
