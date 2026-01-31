import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Body, Caption } from './Typography';
import { theme } from '../../theme';

interface NovaIndicatorProps {
    group: number; // 1-4
}

export function NovaIndicator({ group }: NovaIndicatorProps) {
    // 1: Green, 2: Yellow, 3: Orange, 4: Red (Purple in new design)
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
        <View className="w-full">
            <View className="flex-row justify-between mb-2 gap-1 h-3">
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
            <View className="flex-column justify-between items-center">
                <Caption className="text-xs">NOVA Group-{group}</Caption>
                <Body className="font-bold text-xs" style={{ color: activeColor }}>
                    {labels[group - 1] || 'Unknown'}
                </Body>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    segment: {
        flex: 1,
        borderRadius: 4,
    }
});
