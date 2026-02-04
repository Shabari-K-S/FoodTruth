import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Caption } from './Typography';
import { theme } from '../../theme';
import { useTheme } from '../../providers/ThemeProvider';

interface IngredientsAnalysisProps {
    tags?: string[];
}

export function IngredientsAnalysis({ tags }: IngredientsAnalysisProps) {
    const { theme } = useTheme();

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
            color = theme.colors.primary;
            icon = 'checkmark-circle-outline';
            text = positive;
        } else if (status === 'no' || status === 'present') {
            color = theme.colors.danger;
            icon = 'alert-circle-outline';
            text = negative;
        } else if (status === 'maybe') {
            color = theme.colors.caution;
            icon = 'help-circle-outline';
            text = `Maybe ${positive}`;
        }

        return (
            <View style={[
                styles.tag,
                {
                    backgroundColor: theme.colors.surfaceAlt,
                    borderColor: theme.colors.border,
                }
            ]}>
                <Ionicons name={icon} size={16} color={color} style={{ marginRight: 6 }} />
                <Caption style={{ color: color, fontWeight: '700' }}>{text}</Caption>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <H3 style={[styles.title, { color: theme.colors.foreground }]}>Dietary Analysis</H3>
            <View style={styles.tagContainer}>
                {renderTag('Vegan', vegan, 'Vegan', 'Non-Vegan')}
                {renderTag('Vegetarian', vegetarian, 'Vegetarian', 'Non-Vegetarian')}
                {renderTag('Palm Oil', palmOil, 'Palm Oil Free', 'Contains Palm Oil')}
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
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
});
