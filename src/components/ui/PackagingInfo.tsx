import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, BodyBold, Caption } from './Typography';
import { theme } from '../../theme';
import { useTheme } from '../../providers/ThemeProvider';

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
    packaging?: any;
    packagings?: PackagingPart[];
}

export function PackagingInfo({ packaging, packagings }: PackagingInfoProps) {
    const { isDark } = useTheme();
    const parts: PackagingPart[] = packagings || packaging?.packagings || packaging?.parts || [];

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

    if (parts.length === 0) {
        if (typeof packaging === 'string' && packaging) {
            return (
                <View style={styles.container}>
                    <H3 style={[styles.title, { color: isDark ? '#F4F4F5' : '#18181B' }]}>Packaging</H3>
                    <View style={[
                        styles.card,
                        {
                            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : '#FAFAFA',
                            borderColor: isDark ? '#27272A' : '#F4F4F5',
                        }
                    ]}>
                        <Body>{packaging}</Body>
                    </View>
                </View>
            );
        }
        return null;
    }

    return (
        <View style={styles.container}>
            <H3 style={[styles.title, { color: isDark ? '#F4F4F5' : '#18181B' }]}>Packaging & Environment</H3>
            <View style={[
                styles.card,
                {
                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : '#FAFAFA',
                    borderColor: isDark ? '#27272A' : '#F4F4F5',
                }
            ]}>
                {parts.map((part, index) => {
                    const weight = part.weight_measured || part.weight;
                    const recyclingText = formatRecycling(part.recycling);

                    return (
                        <View
                            key={index}
                            style={[
                                styles.row,
                                index < parts.length - 1 && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: isDark ? '#27272A' : '#F4F4F5',
                                }
                            ]}
                        >
                            <View style={styles.leftContent}>
                                <Ionicons name="cube-outline" size={20} color={theme.colors.muted} style={{ marginRight: 12 }} />
                                <View style={styles.textContent}>
                                    <BodyBold style={{ color: isDark ? '#E5E7EB' : '#3F3F46' }}>
                                        {formatShape(part.shape)}
                                    </BodyBold>
                                    <Caption style={{ color: '#A1A1AA' }}>
                                        {formatMaterial(part.material)}
                                        {part.quantity_per_unit && ` • ${part.quantity_per_unit}`}
                                    </Caption>
                                </View>
                            </View>
                            <View style={styles.rightContent}>
                                {recyclingText && (
                                    <View style={styles.recyclingRow}>
                                        <Ionicons name="refresh-circle" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
                                        <Caption style={styles.recyclingText}>
                                            {recyclingText}
                                        </Caption>
                                    </View>
                                )}
                                {weight && (
                                    <Caption style={styles.weightText}>{weight}g</Caption>
                                )}
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textContent: {
        flex: 1,
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    recyclingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    recyclingText: {
        color: '#059669',
        fontWeight: '700',
        fontSize: 10,
    },
    weightText: {
        color: '#A1A1AA',
        fontSize: 10,
    },
});
