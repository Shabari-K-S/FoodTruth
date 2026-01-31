import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption } from './Typography';
import { theme } from '../../theme';

interface IngredientsAnalysisProps {
    tags?: string[];
    // e.g. ["en:palm-oil-free", "en:vegan", "en:vegetarian"]
}

export function IngredientsAnalysis({ tags }: IngredientsAnalysisProps) {
    if (!tags || tags.length === 0) return null;

    const getStatus = (key: string) => {
        if (tags.some(t => t.includes(`${key}`))) return 'yes';
        if (tags.some(t => t.includes(`non-${key}`))) return 'no';
        if (tags.some(t => t.includes(`maybe-${key}`))) return 'maybe';
        return 'unknown';
    };

    const vegan = getStatus('vegan');
    const vegetarian = getStatus('vegetarian');
    const palmOil = tags.some(t => t.includes('palm-oil-free')) ? 'free' :
        tags.some(t => t.includes('palm-oil')) ? 'present' : 'unknown';

    const renderTag = (label: string, status: string, positive: string, negative: string) => {
        let color = theme.colors.muted;
        let icon: keyof typeof Ionicons.glyphMap = 'help-circle-outline';
        let text = 'Unknown';

        if (status === 'yes' || status === 'free') {
            color = theme.colors.primary; // Sage
            icon = 'checkmark-circle-outline';
            text = positive;
        } else if (status === 'no' || status === 'present') {
            color = theme.colors.danger; // Coral
            icon = 'alert-circle-outline';
            text = negative;
        } else if (status === 'maybe') {
            color = theme.colors.caution; // Goldenrod
            icon = 'help-circle-outline';
            text = `Maybe ${positive}`;
        }

        return (
            <View className="flex-row items-center bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-full border border-zinc-100 dark:border-zinc-800 mr-2 mb-2">
                <Ionicons name={icon} size={16} color={color} style={{ marginRight: 6 }} />
                <Caption style={{ color: color, fontWeight: 'bold' }}>{text}</Caption>
            </View>
        );
    };

    return (
        <View className="mb-6">
            <H3 className="mb-3 text-zinc-900 dark:text-zinc-100">Dietary Analysis</H3>
            <View className="flex-row flex-wrap">
                {renderTag('Vegan', vegan, 'Vegan', 'Non-Vegan')}
                {renderTag('Vegetarian', vegetarian, 'Vegetarian', 'Non-Vegetarian')}
                {renderTag('Palm Oil', palmOil, 'Palm Oil Free', 'Contains Palm Oil')}
            </View>
        </View>
    );
}
