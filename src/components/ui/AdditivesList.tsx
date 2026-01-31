import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption } from './Typography';
import { useTheme } from '../../providers/ThemeProvider';
import { useAdditives } from '../../hooks/useAdditives';
import { AdditiveData, SOUTHAMPTON_SIX } from '../../types/additives';

interface AdditivesListProps {
    additives?: string[];  // Array like ["en:e100", "en:e330", "E160a(i)"]
    count?: number;
}

const RISK_CONFIG = {
    low: {
        icon: 'checkmark-circle' as const,
        color: '#22C55E',
        bg: '#DCFCE7',
        label: 'Safe',
    },
    moderate: {
        icon: 'alert-circle' as const,
        color: '#F59E0B',
        bg: '#FEF3C7',
        label: 'Limit',
    },
    high: {
        icon: 'warning' as const,
        color: '#EF4444',
        bg: '#FEE2E2',
        label: 'Avoid',
    },
    unknown: {
        icon: 'help-circle' as const,
        color: '#6B7280',
        bg: '#F3F4F6',
        label: 'Unknown',
    },
} as const;

const AdditiveItem = ({
    code,
    info,
    index,
    total
}: {
    code: string;
    info: AdditiveData | null;
    index: number;
    total: number;
}) => {
    const { theme } = useTheme();

    // Format display code
    const displayCode = code.replace('en:', '').toUpperCase();
    const risk = info?.risk_level || 'unknown';
    const config = RISK_CONFIG[risk];
    const isSouthampton = info?.warning; // Check if it has warning

    return (
        <View>
            <Pressable
                className="flex-row items-start py-4 active:opacity-60"
                style={{ paddingHorizontal: 4 }}
            >
                {/* Risk Icon */}
                <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-4 mt-0.5"
                    style={{ backgroundColor: config.bg }}
                >
                    <Ionicons name={config.icon} size={20} color={config.color} />
                </View>

                {/* Info */}
                <View className="flex-1 justify-center pr-2">
                    {/* Code + Badge Row */}
                    <View className="flex-row items-center mb-1 flex-wrap">
                        <Body className="text-base font-bold text-foreground mr-2">
                            {displayCode}
                        </Body>
                        <View
                            className="px-2 py-0.5 rounded-full mr-2"
                            style={{ backgroundColor: config.bg }}
                        >
                            <Caption style={{ color: config.color }} className="text-[10px] font-bold uppercase tracking-wider">
                                {config.label}
                            </Caption>
                        </View>
                    </View>

                    {/* Name */}
                    <Body className="text-sm text-foreground font-medium mb-1">
                        {info?.name || 'Unidentified additive'}
                    </Body>

                    {/* Function Tags */}
                    {info?.functional_classes && info.functional_classes.length > 0 && (
                        <View className="flex-row flex-wrap mt-1">
                            {info.functional_classes.slice(0, 2).map((func, idx) => (
                                <View
                                    key={idx}
                                    className="bg-surface border border-border/20 rounded-md px-2 py-0.5 mr-2 mb-1"
                                >
                                    <Caption className="text-[10px] text-muted capitalize">
                                        {func.replace(/_/g, ' ')}
                                    </Caption>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Warning for Southampton Six */}
                    {isSouthampton && (
                        <View className="mt-2 bg-amber-50 border border-amber-100 rounded-lg p-2 flex-row items-start">
                            <Ionicons name="alert-circle" size={14} color="#F59E0B" style={{ marginTop: 1 }} />
                            <Caption className="text-amber-800 text-xs flex-1 ml-1.5 leading-4">
                                {info.warning}
                            </Caption>
                        </View>
                    )}
                </View>

                <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} style={{ opacity: 0.3, marginTop: 12 }} />
            </Pressable>

            {index < total - 1 && (
                <View className="h-px bg-border/10 ml-14" />
            )}
        </View>
    );
};

export function AdditivesList({ additives, count }: AdditivesListProps) {
    const { theme } = useTheme();
    const { getAdditiveInfo, loading } = useAdditives();

    const displayCount = additives?.length || count || 0;
    const hasAdditives = additives && additives.length > 0;

    // Loading state
    if (loading) {
        return (
            <View className="mb-6 px-1">
                <H3 className="text-lg font-bold mb-4">Additives</H3>
                <View className="bg-surface rounded-2xl p-6 items-center justify-center">
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Caption className="text-muted mt-2">Loading database...</Caption>
                </View>
            </View>
        );
    }

    // No additives (Clean product!)
    if (!hasAdditives && displayCount === 0) {
        return (
            <View className="mb-6 px-1">
                <H3 className="text-lg font-bold mb-4">Additives</H3>
                <View className="bg-primary/5 rounded-2xl p-5 flex-row items-center border border-primary/10">
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                        <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />
                    </View>
                    <View className="flex-1">
                        <Body className="font-semibold text-foreground mb-0.5">No Additives Found</Body>
                        <Caption className="text-muted text-xs">Clean ingredients list</Caption>
                    </View>
                </View>
            </View>
        );
    }

    // Data unavailable
    if (!hasAdditives && displayCount > 0) {
        return (
            <View className="mb-6 px-1">
                <View className="flex-row items-center justify-between mb-4">
                    <H3 className="text-lg font-bold">Additives</H3>
                    <View className="bg-surface px-3 py-1 rounded-full border border-border/20">
                        <Caption className="text-muted font-bold text-xs">{displayCount}</Caption>
                    </View>
                </View>
                <View className="bg-surface rounded-2xl p-6 items-center border border-border/10">
                    <Ionicons name="cloud-offline-outline" size={28} color={theme.colors.muted} style={{ opacity: 0.4 }} />
                    <Caption className="text-muted text-center mt-2 text-sm">Details unavailable</Caption>
                </View>
            </View>
        );
    }

    // Analyze risks and check for Southampton Six
    const riskSummary = additives!.reduce((acc, code) => {
        const info = getAdditiveInfo(code);
        const risk = info?.risk_level || 'unknown';
        acc[risk] = (acc[risk] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const hasSouthampton = additives!.some(code => {
        const normalized = code.toUpperCase().replace('EN:', '');
        return SOUTHAMPTON_SIX.includes(normalized);
    });

    return (
        <View className="mb-6 px-1">
            {/* Southampton Six Warning Banner */}
            {hasSouthampton && (
                <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex-row items-start">
                    <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3">
                        <Ionicons name="warning" size={18} color="#F59E0B" />
                    </View>
                    <View className="flex-1">
                        <Body className="text-amber-900 font-semibold text-sm mb-1">
                            Food Colours Warning
                        </Body>
                        <Caption className="text-amber-700 text-xs leading-4">
                            This product contains colours that may have an adverse effect on activity and attention in children (as required by UK/EU law).
                        </Caption>
                    </View>
                </View>
            )}

            {/* Header with Risk Summary */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <H3 className="text-lg font-bold mr-3">Additives</H3>
                    <View
                        className="min-w-[24px] h-6 px-2 rounded-full items-center justify-center"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        <Caption className="text-white font-bold text-xs">{additives!.length}</Caption>
                    </View>
                </View>

                {/* Mini risk indicator */}
                {riskSummary.high > 0 && (
                    <View className="flex-row items-center bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                        <Ionicons name="warning" size={12} color="#EF4444" />
                        <Caption className="text-red-600 text-xs font-bold ml-1">
                            {riskSummary.high} high risk
                        </Caption>
                    </View>
                )}
            </View>

            {/* List */}
            <View className="bg-surface rounded-2xl p-3 border border-border/10">
                {additives!.map((code, index) => (
                    <AdditiveItem
                        key={`${code}-${index}`}
                        code={code}
                        info={getAdditiveInfo(code)}
                        index={index}
                        total={additives!.length}
                    />
                ))}
            </View>

            {/* Legend */}
            <View className="flex-row justify-start mt-3 px-1 space-x-4">
                {(['low', 'moderate', 'high'] as const).map((risk) => (
                    <View key={risk} className="flex-row items-center">
                        <View
                            className="w-2 h-2 rounded-full mr-1.5"
                            style={{ backgroundColor: RISK_CONFIG[risk].color }}
                        />
                        <Caption className="text-xs text-muted">
                            {RISK_CONFIG[risk].label}
                        </Caption>
                    </View>
                ))}
            </View>

            {/* Footer Note */}
            <Caption className="text-center text-muted/40 text-xs mt-4">
                Based on CODEX Alimentarius International Standards
            </Caption>
        </View>
    );
}