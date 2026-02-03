import React from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption } from './Typography';
import { useTheme } from '../../providers/ThemeProvider';
import { useAdditives } from '../../hooks/useAdditives';
import { AdditiveData, SOUTHAMPTON_SIX } from '../../types/additives';

interface AdditivesListProps {
    additives?: string[];
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
    const { theme, isDark } = useTheme();

    const displayCode = code.replace('en:', '').toUpperCase();
    const risk = info?.risk_level || 'unknown';
    const config = RISK_CONFIG[risk];
    const isSouthampton = info?.warning;

    return (
        <View>
            <Pressable style={styles.itemRow}>
                <View style={[styles.riskIcon, { backgroundColor: config.bg }]}>
                    <Ionicons name={config.icon} size={20} color={config.color} />
                </View>

                <View style={styles.itemContent}>
                    <View style={styles.codeRow}>
                        <Body style={[styles.codeText, { color: theme.colors.foreground }]}>
                            {displayCode}
                        </Body>
                        <View style={[styles.riskBadge, { backgroundColor: config.bg }]}>
                            <Caption style={[styles.riskLabel, { color: config.color }]}>
                                {config.label}
                            </Caption>
                        </View>
                    </View>

                    <Body style={[styles.nameText, { color: theme.colors.foreground }]}>
                        {info?.name || 'Unidentified additive'}
                    </Body>

                    {info?.functional_classes && info.functional_classes.length > 0 && (
                        <View style={styles.funcRow}>
                            {info.functional_classes.slice(0, 2).map((func, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.funcTag,
                                        {
                                            backgroundColor: theme.colors.surface,
                                            borderColor: isDark ? '#3F3F46' : '#E5E7EB',
                                        }
                                    ]}
                                >
                                    <Caption style={styles.funcText}>
                                        {func.replace(/_/g, ' ')}
                                    </Caption>
                                </View>
                            ))}
                        </View>
                    )}

                    {isSouthampton && (
                        <View style={styles.warningBox}>
                            <Ionicons name="alert-circle" size={14} color="#F59E0B" style={{ marginTop: 1 }} />
                            <Caption style={styles.warningText}>
                                {info.warning}
                            </Caption>
                        </View>
                    )}
                </View>

                <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} style={{ opacity: 0.3, marginTop: 12 }} />
            </Pressable>

            {index < total - 1 && (
                <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]} />
            )}
        </View>
    );
};

export function AdditivesList({ additives, count }: AdditivesListProps) {
    const { theme, isDark } = useTheme();
    const { getAdditiveInfo, loading } = useAdditives();

    const displayCount = additives?.length || count || 0;
    const hasAdditives = additives && additives.length > 0;

    if (loading) {
        return (
            <View style={styles.container}>
                <H3 style={styles.title}>Additives</H3>
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Caption style={styles.loadingText}>Loading database...</Caption>
                </View>
            </View>
        );
    }

    if (!hasAdditives && displayCount === 0) {
        return (
            <View style={styles.container}>
                <H3 style={styles.title}>Additives</H3>
                <View style={[styles.cleanCard, { borderColor: 'rgba(13, 148, 136, 0.1)' }]}>
                    <View style={styles.cleanIcon}>
                        <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />
                    </View>
                    <View style={styles.cleanContent}>
                        <Body style={[styles.cleanTitle, { color: theme.colors.foreground }]}>No Additives Found</Body>
                        <Caption style={styles.cleanSubtitle}>Clean ingredients list</Caption>
                    </View>
                </View>
            </View>
        );
    }

    if (!hasAdditives && displayCount > 0) {
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <H3 style={styles.title}>Additives</H3>
                    <View style={[styles.countBadge, { backgroundColor: theme.colors.surface, borderColor: isDark ? '#3F3F46' : '#E5E7EB' }]}>
                        <Caption style={styles.countText}>{displayCount}</Caption>
                    </View>
                </View>
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                    <Ionicons name="cloud-offline-outline" size={28} color={theme.colors.muted} style={{ opacity: 0.4 }} />
                    <Caption style={styles.unavailableText}>Details unavailable</Caption>
                </View>
            </View>
        );
    }

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
        <View style={styles.container}>
            {hasSouthampton && (
                <View style={styles.southamptonBanner}>
                    <View style={styles.southamptonIcon}>
                        <Ionicons name="warning" size={18} color="#F59E0B" />
                    </View>
                    <View style={styles.southamptonContent}>
                        <Body style={styles.southamptonTitle}>Food Colours Warning</Body>
                        <Caption style={styles.southamptonText}>
                            This product contains colours that may have an adverse effect on activity and attention in children.
                        </Caption>
                    </View>
                </View>
            )}

            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <H3 style={[styles.title, { marginRight: 12 }]}>Additives</H3>
                    <View style={[styles.countCircle, { backgroundColor: theme.colors.primary }]}>
                        <Caption style={styles.countCircleText}>{additives!.length}</Caption>
                    </View>
                </View>

                {riskSummary.high > 0 && (
                    <View style={styles.riskIndicator}>
                        <Ionicons name="warning" size={12} color="#EF4444" />
                        <Caption style={styles.riskIndicatorText}>{riskSummary.high} high risk</Caption>
                    </View>
                )}
            </View>

            <View style={[styles.listCard, { backgroundColor: theme.colors.surface, borderColor: isDark ? '#27272A' : '#F4F4F5' }]}>
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

            <View style={styles.legend}>
                {(['low', 'moderate', 'high'] as const).map((risk) => (
                    <View key={risk} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: RISK_CONFIG[risk].color }]} />
                        <Caption style={styles.legendText}>{RISK_CONFIG[risk].label}</Caption>
                    </View>
                ))}
            </View>

            <Caption style={styles.footer}>Based on CODEX Alimentarius International Standards</Caption>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    card: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listCard: {
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
    },
    loadingText: {
        marginTop: 8,
    },
    cleanCard: {
        backgroundColor: 'rgba(13, 148, 136, 0.05)',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    cleanIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cleanContent: {
        flex: 1,
    },
    cleanTitle: {
        fontWeight: '600',
        marginBottom: 2,
    },
    cleanSubtitle: {
        fontSize: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
    },
    countText: {
        fontWeight: '700',
        fontSize: 12,
    },
    countCircle: {
        minWidth: 24,
        height: 24,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countCircleText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },
    unavailableText: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 16,
        paddingHorizontal: 4,
    },
    riskIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        marginTop: 2,
    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 8,
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    codeText: {
        fontSize: 16,
        fontWeight: '700',
        marginRight: 8,
    },
    riskBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        marginRight: 8,
    },
    riskLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    nameText: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    funcRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    funcTag: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
        marginBottom: 4,
        borderWidth: 1,
    },
    funcText: {
        fontSize: 10,
        textTransform: 'capitalize',
    },
    warningBox: {
        marginTop: 8,
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FEF3C7',
        borderRadius: 8,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    warningText: {
        color: '#92400E',
        fontSize: 12,
        flex: 1,
        marginLeft: 6,
        lineHeight: 16,
    },
    divider: {
        height: 1,
        marginLeft: 56,
    },
    southamptonBanner: {
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    southamptonIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FEF3C7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    southamptonContent: {
        flex: 1,
    },
    southamptonTitle: {
        color: '#78350F',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 4,
    },
    southamptonText: {
        color: '#92400E',
        fontSize: 12,
        lineHeight: 16,
    },
    riskIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    riskIndicatorText: {
        color: '#DC2626',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 12,
        paddingHorizontal: 4,
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
    },
    footer: {
        textAlign: 'center',
        opacity: 0.4,
        fontSize: 12,
        marginTop: 16,
    },
});