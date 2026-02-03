import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption } from './Typography';
import { theme } from '../../theme';
import { useTheme } from '../../providers/ThemeProvider';

interface AllergensDisplayProps {
    allergens?: string;
    allergensTags?: string[];
    traces?: string;
    tracesTags?: string[];
}

export function AllergensDisplay({ allergens, allergensTags, traces, tracesTags }: AllergensDisplayProps) {
    const { isDark } = useTheme();
    const hasAllergens = allergens || (allergensTags && allergensTags.length > 0);
    const hasTraces = traces || (tracesTags && tracesTags.length > 0);

    const formatAllergen = (tag: string) => {
        return tag
            .replace('en:', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (!hasAllergens && !hasTraces) {
        return (
            <View style={styles.container}>
                <H3 style={[styles.title, { color: isDark ? '#F4F4F5' : '#18181B' }]}>Allergens</H3>
                <View style={[
                    styles.noAllergenCard,
                    {
                        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5',
                        borderColor: isDark ? '#065F46' : '#A7F3D0',
                    }
                ]}>
                    <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
                    <Body style={[styles.noAllergenText, { color: isDark ? '#6EE7B7' : '#047857' }]}>
                        No allergens detected
                    </Body>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <H3 style={[styles.title, { color: isDark ? '#F4F4F5' : '#18181B' }]}>Allergens & Traces</H3>
            <View style={[
                styles.card,
                {
                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : '#FAFAFA',
                    borderColor: isDark ? '#27272A' : '#F4F4F5',
                }
            ]}>
                {/* Allergens */}
                {hasAllergens && (
                    <View style={styles.section}>
                        <View style={styles.labelRow}>
                            <Ionicons name="warning" size={16} color={theme.colors.danger} />
                            <Caption style={[styles.sectionLabel, { color: isDark ? '#F87171' : '#DC2626' }]}>
                                Contains
                            </Caption>
                        </View>
                        <View style={styles.tagContainer}>
                            {allergensTags?.map((tag, i) => (
                                <View key={i} style={[
                                    styles.tag,
                                    { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FEE2E2' }
                                ]}>
                                    <Caption style={[styles.tagText, { color: isDark ? '#FCA5A5' : '#B91C1C' }]}>
                                        {formatAllergen(tag)}
                                    </Caption>
                                </View>
                            ))}
                            {!allergensTags?.length && allergens && (
                                <Body style={{ color: isDark ? '#F87171' : '#DC2626' }}>{allergens}</Body>
                            )}
                        </View>
                    </View>
                )}

                {/* Traces */}
                {hasTraces && (
                    <View style={hasAllergens ? { marginTop: 16 } : undefined}>
                        <View style={styles.labelRow}>
                            <Ionicons name="alert-circle" size={16} color={theme.colors.caution} />
                            <Caption style={[styles.sectionLabel, { color: isDark ? '#FBBF24' : '#D97706' }]}>
                                May Contain Traces Of
                            </Caption>
                        </View>
                        <View style={styles.tagContainer}>
                            {tracesTags?.map((tag, i) => (
                                <View key={i} style={[
                                    styles.tag,
                                    { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FEF3C7' }
                                ]}>
                                    <Caption style={[styles.tagText, { color: isDark ? '#FCD34D' : '#92400E' }]}>
                                        {formatAllergen(tag)}
                                    </Caption>
                                </View>
                            ))}
                            {!tracesTags?.length && traces && (
                                <Body style={{ color: isDark ? '#FBBF24' : '#D97706' }}>{traces}</Body>
                            )}
                        </View>
                    </View>
                )}
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
    noAllergenCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    noAllergenText: {
        marginLeft: 12,
        fontWeight: '700',
    },
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    section: {
        marginBottom: 0,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionLabel: {
        marginLeft: 8,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 10,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    tagText: {
        fontWeight: '700',
    },
});
