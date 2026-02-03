import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Body, Caption } from './Typography';
import { theme } from '../../theme';

interface NovaIndicatorProps {
    group: number; // 1-4
}

export function NovaIndicator({ group }: NovaIndicatorProps) {
    const getGroupColor = (g: number) => {
        switch (g) {
            case 1: return theme.colors.natural;
            case 2: return '#FACC15'; // Yellow
            case 3: return theme.colors.caution;
            case 4: return theme.colors.ultraProcessed; // Purple
            default: return theme.colors.muted;
        }
    };

    const activeColor = getGroupColor(group || 0);
    const labels = ["Unprocessed", "Processed Ingredients", "Processed", "Ultra-Processed"];

    return (
        <View style={styles.container}>
            <View style={styles.segmentRow}>
                {[1, 2, 3, 4].map((step) => (
                    <View
                        key={step}
                        style={[
                            styles.segment,
                            {
                                backgroundColor: step === group ? activeColor : theme.colors.border,
                                opacity: step === group ? 1 : 0.4
                            }
                        ]}
                    />
                ))}
            </View>
            <View style={styles.labelContainer}>
                <Caption style={styles.groupLabel}>NOVA Group-{group}</Caption>
                <Body style={[styles.statusLabel, { color: activeColor }]}>
                    {labels[group - 1] || 'Unknown'}
                </Body>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    segmentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        gap: 4,
        height: 12,
    },
    segment: {
        flex: 1,
        borderRadius: 4,
    },
    labelContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    groupLabel: {
        fontSize: 12,
    },
    statusLabel: {
        fontWeight: '700',
        fontSize: 12,
    },
});
