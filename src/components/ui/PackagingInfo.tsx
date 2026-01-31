import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption, BodyBold } from './Typography';
import { theme } from '../../theme';

interface PackagingPart {
    material?: string;
    shape?: string;
    recycling?: string;
    quantity_per_unit?: string;
    weight?: number;
    weight_measured?: number;
    number_of_units?: number;
}

interface PackagingInfoProps {
    packaging?: any; // Accept any since API structure varies
    packagings?: PackagingPart[];
}

export function PackagingInfo({ packaging, packagings }: PackagingInfoProps) {
    // Get packaging parts from either source
    const parts: PackagingPart[] = packagings || packaging?.packagings || packaging?.parts || [];

    if (parts.length === 0) {
        // Check if simple string packaging exists
        if (typeof packaging === 'string' && packaging) {
            return (
                <View className="mb-6">
                    <H3 className="mb-3 text-zinc-900 dark:text-zinc-100">Packaging</H3>
                    <View className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <Body>{packaging}</Body>
                    </View>
                </View>
            );
        }
        return null;
    }

    const formatMaterial = (material?: string) => {
        if (!material) return 'Unknown Material';
        return material
            .replace('en:', '')
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    };

    const formatShape = (shape?: string) => {
        if (!shape) return 'Component';
        return shape
            .replace('en:', '')
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    };

    const formatRecycling = (recycling?: string) => {
        if (!recycling) return null;
        return recycling
            .replace('en:', '')
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    };

    return (
        <View className="mb-6">
            <H3 className="mb-3 text-zinc-900 dark:text-zinc-100">Packaging & Environment</H3>
            <View className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                {parts.map((part, index) => {
                    const weight = part.weight_measured || part.weight;
                    const recyclingText = formatRecycling(part.recycling);

                    return (
                        <View
                            key={index}
                            className={`flex-row items-center justify-between py-3 ${index < parts.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                        >
                            <View className="flex-row items-center flex-1">
                                <Ionicons name="cube-outline" size={20} color={theme.colors.muted} style={{ marginRight: 12 }} />
                                <View className="flex-1">
                                    <BodyBold className="text-zinc-700 dark:text-zinc-200">
                                        {formatShape(part.shape)}
                                    </BodyBold>
                                    <Caption className="text-zinc-400">
                                        {formatMaterial(part.material)}
                                        {part.quantity_per_unit && ` • ${part.quantity_per_unit}`}
                                    </Caption>
                                </View>
                            </View>
                            <View className="items-end">
                                {recyclingText && (
                                    <View className="flex-row items-center mb-1">
                                        <Ionicons name="refresh-circle" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
                                        <Caption className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                                            {recyclingText}
                                        </Caption>
                                    </View>
                                )}
                                {weight && (
                                    <Caption className="text-zinc-400 text-[10px]">{weight}g</Caption>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
