import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption, BodyBold } from './Typography';
import { theme } from '../../theme';

interface AllergensDisplayProps {
    allergens?: string;
    allergensTags?: string[];
    traces?: string;
    tracesTags?: string[];
}

export function AllergensDisplay({ allergens, allergensTags, traces, tracesTags }: AllergensDisplayProps) {
    const hasAllergens = allergens || (allergensTags && allergensTags.length > 0);
    const hasTraces = traces || (tracesTags && tracesTags.length > 0);

    if (!hasAllergens && !hasTraces) {
        return (
            <View className="mb-6">
                <H3 className="mb-3 text-zinc-900 dark:text-zinc-100">Allergens</H3>
                <View className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex-row items-center">
                    <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
                    <Body className="ml-3 text-emerald-700 dark:text-emerald-300 font-bold">No allergens detected</Body>
                </View>
            </View>
        );
    }

    const formatAllergen = (tag: string) => {
        return tag
            .replace('en:', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <View className="mb-6">
            <H3 className="mb-3 text-zinc-900 dark:text-zinc-100">Allergens & Traces</H3>
            <View className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">

                {/* Allergens */}
                {hasAllergens && (
                    <View className="mb-4">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="warning" size={16} color={theme.colors.danger} />
                            <Caption className="ml-2 text-red-600 dark:text-red-400 font-bold uppercase tracking-wider text-[10px]">
                                Contains
                            </Caption>
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {allergensTags?.map((tag, i) => (
                                <View key={i} className="bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-full">
                                    <Caption className="text-red-700 dark:text-red-300 font-bold">
                                        {formatAllergen(tag)}
                                    </Caption>
                                </View>
                            ))}
                            {!allergensTags?.length && allergens && (
                                <Body className="text-red-600 dark:text-red-400">{allergens}</Body>
                            )}
                        </View>
                    </View>
                )}

                {/* Traces */}
                {hasTraces && (
                    <View>
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="alert-circle" size={16} color={theme.colors.caution} />
                            <Caption className="ml-2 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                                May Contain Traces Of
                            </Caption>
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {tracesTags?.map((tag, i) => (
                                <View key={i} className="bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-full">
                                    <Caption className="text-amber-700 dark:text-amber-300 font-bold">
                                        {formatAllergen(tag)}
                                    </Caption>
                                </View>
                            ))}
                            {!tracesTags?.length && traces && (
                                <Body className="text-amber-600 dark:text-amber-400">{traces}</Body>
                            )}
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
