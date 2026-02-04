import React from 'react';
import { View, StyleSheet } from 'react-native';
import { H3, Body, BodyBold, Caption } from './Typography';
import { theme } from '../../theme';
import { useTheme } from '../../providers/ThemeProvider';
import { Nutriments, NutrientLevels as NutrientLevelsType } from '../../types/openFoodFacts';

interface ExtendedNutritionProps {
    nutriments?: Nutriments;
    nutrientLevels?: NutrientLevelsType;
}

const DetailedRow = ({ label, value, unit, indent = false, level, isDark }: any) => {
    if (value === undefined || value === null) return null;

    const displayValue = typeof value === 'number' ? Math.round(value * 100) / 100 : value;

    let dotColor = 'transparent';
    if (level === 'high') dotColor = theme.colors.danger;
    if (level === 'moderate') dotColor = theme.colors.caution;
    if (level === 'low') dotColor = theme.colors.primary;

    return (
        <View style={[
            styles.row,
            { borderBottomColor: isDark ? '#27272A' : '#F4F4F5' },
            indent && { paddingLeft: 16 }
        ]}>
            <Body style={[styles.label, { color: isDark ? '#A1A1AA' : '#52525B' }]}>{label}</Body>
            <View style={styles.valueContainer}>
                <BodyBold style={[styles.value, { color: isDark ? '#F4F4F5' : '#18181B' }]}>
                    {displayValue}{unit}
                </BodyBold>
                {level && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
            </View>
        </View>
    );
};

export function ExtendedNutrition({ nutriments, nutrientLevels }: ExtendedNutritionProps) {
    const { isDark } = useTheme();

    if (!nutriments) return null;

    return (
        <View style={styles.container}>
            <H3 style={[styles.title, { color: isDark ? '#F4F4F5' : '#18181B' }]}>Full Nutrition Profile</H3>
            <View style={[
                styles.card,
                {
                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : '#FAFAFA',
                    borderColor: isDark ? '#27272A' : '#F4F4F5',
                }
            ]}>
                <Caption style={styles.subtitle}>per 100g serving</Caption>

                <DetailedRow label="Energy" value={nutriments.energy_kcal_100g} unit="kcal" isDark={isDark} />
                <DetailedRow label="Fat" value={nutriments.fat_100g} unit="g" level={nutrientLevels?.fat} isDark={isDark} />
                <DetailedRow label="Saturated Fat" value={nutriments.saturated_fat_100g} unit="g" indent level={nutrientLevels?.['saturated-fat']} isDark={isDark} />
                <DetailedRow label="Trans Fat" value={nutriments.trans_fat_100g} unit="g" indent isDark={isDark} />
                <DetailedRow label="Cholesterol" value={nutriments.cholesterol_100g} unit="mg" indent isDark={isDark} />

                <DetailedRow label="Carbohydrates" value={nutriments.carbohydrates_100g} unit="g" isDark={isDark} />
                <DetailedRow label="Sugars" value={nutriments.sugars_100g} unit="g" indent level={nutrientLevels?.sugars} isDark={isDark} />
                <DetailedRow label="Fiber" value={nutriments.fiber_100g} unit="g" indent isDark={isDark} />

                <DetailedRow label="Proteins" value={nutriments.proteins_100g} unit="g" isDark={isDark} />
                <DetailedRow label="Salt" value={nutriments.salt_100g} unit="g" level={nutrientLevels?.salt} isDark={isDark} />

                {(nutriments.vitamin_a_100g || nutriments.vitamin_c_100g || nutriments.calcium_100g || nutriments.iron_100g || nutriments.vitamin_d_100g || nutriments.potassium_100g) && (
                    <View style={[styles.vitaminsSection, { borderTopColor: isDark ? '#27272A' : '#E5E7EB' }]}>
                        <Caption style={styles.vitaminsTitle}>Vitamins & Minerals</Caption>
                        <DetailedRow label="Vitamin A" value={nutriments.vitamin_a_100g} unit="µg" isDark={isDark} />
                        <DetailedRow label="Vitamin C" value={nutriments.vitamin_c_100g} unit="mg" isDark={isDark} />
                        <DetailedRow label="Vitamin D" value={nutriments.vitamin_d_100g} unit="µg" isDark={isDark} />
                        <DetailedRow label="Calcium" value={nutriments.calcium_100g} unit="mg" isDark={isDark} />
                        <DetailedRow label="Iron" value={nutriments.iron_100g} unit="mg" isDark={isDark} />
                        <DetailedRow label="Potassium" value={nutriments.potassium_100g} unit="mg" isDark={isDark} />
                    </View>
                )}
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
    subtitle: {
        marginBottom: 16,
        color: '#A1A1AA',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    label: {
        flex: 1,
        textTransform: 'capitalize',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        marginRight: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    vitaminsSection: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 1,
    },
    vitaminsTitle: {
        marginBottom: 8,
        color: '#A1A1AA',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 10,
    },
});
