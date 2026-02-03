import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption } from './Typography';
import { theme } from '../../theme';
import { useTheme } from '../../providers/ThemeProvider';

interface NovaMarkersProps {
    novaGroup?: number;
    markers?: {
        [key: string]: [string, string][];
    };
}

export function NovaMarkers({ novaGroup, markers }: NovaMarkersProps) {
    const { isDark } = useTheme();

    if (!markers || !novaGroup) return null;

    const ultraProcessedMarkers = markers['4'] || [];

    if (ultraProcessedMarkers.length === 0) return null;

    const formatMarker = (marker: [string, string]) => {
        const [type, value] = marker;
        const formattedValue = value
            .replace('en:', '')
            .replace('e', 'E')
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        return { type, value: formattedValue };
    };

    return (
        <View style={styles.container}>
            <H3 style={[styles.title, { color: isDark ? '#F4F4F5' : '#18181B' }]}>Why Ultra-Processed?</H3>
            <View style={[
                styles.card,
                {
                    backgroundColor: isDark ? 'rgba(88, 28, 135, 0.2)' : '#FAF5FF',
                    borderColor: isDark ? '#581C87' : '#E9D5FF',
                }
            ]}>
                <Caption style={styles.header}>
                    NOVA 4 Markers Found ({ultraProcessedMarkers.length})
                </Caption>
                {ultraProcessedMarkers.map((marker, index) => {
                    const { type, value } = formatMarker(marker);
                    return (
                        <View
                            key={index}
                            style={[
                                styles.markerRow,
                                index < ultraProcessedMarkers.length - 1 && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: isDark ? '#581C87' : '#E9D5FF',
                                }
                            ]}
                        >
                            <View style={[
                                styles.iconContainer,
                                { backgroundColor: isDark ? '#581C87' : '#E9D5FF' }
                            ]}>
                                <Ionicons
                                    name={type === 'additives' ? 'flask' : 'nutrition'}
                                    size={12}
                                    color={theme.colors.ultraProcessed}
                                />
                            </View>
                            <View style={styles.textContainer}>
                                <Body style={{ color: isDark ? '#E9D5FF' : '#581C87' }}>{value}</Body>
                                <Caption style={styles.typeLabel}>{type}</Caption>
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
    header: {
        color: '#7C3AED',
        marginBottom: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 10,
    },
    markerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    typeLabel: {
        color: '#A78BFA',
        textTransform: 'capitalize',
        fontSize: 10,
    },
});
