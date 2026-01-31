import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption, BodyBold } from './Typography';
import { theme } from '../../theme';

interface NovaMarkersProps {
    novaGroup?: number;
    markers?: {
        [key: string]: [string, string][];
    };
}

export function NovaMarkers({ novaGroup, markers }: NovaMarkersProps) {
    if (!markers || !novaGroup) return null;

    // Get markers for NOVA 4 (ultra-processed indicators)
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
        <View className="mb-6">
            <H3 className="mb-3 text-zinc-900 dark:text-zinc-100">Why Ultra-Processed?</H3>
            <View className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-900">
                <Caption className="text-purple-600 dark:text-purple-400 mb-3 font-bold uppercase tracking-wider text-[10px]">
                    NOVA 4 Markers Found ({ultraProcessedMarkers.length})
                </Caption>
                {ultraProcessedMarkers.map((marker, index) => {
                    const { type, value } = formatMarker(marker);
                    return (
                        <View
                            key={index}
                            className={`flex-row items-center py-2 ${index < ultraProcessedMarkers.length - 1 ? 'border-b border-purple-100 dark:border-purple-800' : ''}`}
                        >
                            <View className="w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-800 items-center justify-center mr-3">
                                <Ionicons
                                    name={type === 'additives' ? 'flask' : 'nutrition'}
                                    size={12}
                                    color={theme.colors.ultraProcessed}
                                />
                            </View>
                            <View className="flex-1">
                                <Body className="text-purple-800 dark:text-purple-200">{value}</Body>
                                <Caption className="text-purple-400 capitalize text-[10px]">{type}</Caption>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
