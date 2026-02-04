import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption } from './Typography';
import { theme } from '../../theme';
import { useTheme } from '../../providers/ThemeProvider';

interface ProductMetadataProps {
    categories?: string;
    categoriesTags?: string[];
    labels?: string;
    labelsTags?: string[];
    origins?: string;
    countries?: string;
    stores?: string;
    brands?: string;
    quantity?: string;
}

export function ProductMetadata({
    categories,
    categoriesTags,
    labels,
    labelsTags,
    origins,
    countries,
    stores,
    brands,
    quantity
}: ProductMetadataProps) {
    const { theme } = useTheme();

    const formatTag = (tag: string) => {
        return tag
            .replace('en:', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const MetaRow = ({ icon, label, value }: { icon: string; label: string; value?: string }) => {
        if (!value) return null;
        return (
            <View style={[
                styles.row,
                { borderBottomColor: theme.colors.border }
            ]}>
                <Ionicons name={icon as any} size={16} color={theme.colors.muted} style={{ marginTop: 2 }} />
                <View style={styles.rowContent}>
                    <Caption style={styles.rowLabel}>{label}</Caption>
                    <Body style={{ color: theme.colors.foreground, marginTop: 2 }}>{value}</Body>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <H3 style={[styles.title, { color: theme.colors.foreground }]}>Product Information</H3>
            <View style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surfaceAlt,
                    borderColor: theme.colors.border,
                }
            ]}>
                <MetaRow icon="pricetag" label="Category" value={categories} />
                <MetaRow icon="globe" label="Origin" value={origins} />
                <MetaRow icon="location" label="Countries Sold" value={countries} />
                <MetaRow icon="storefront" label="Stores" value={stores || 'Not specified'} />
                <MetaRow icon="cube" label="Quantity" value={quantity} />

                {/* Labels/Certifications */}
                {(!!labels || (labelsTags?.length ?? 0) > 0) && (
                    <View style={[styles.labelsSection, { borderTopColor: theme.colors.border }]}>
                        <Caption style={styles.labelsTitle}>
                            Labels & Certifications
                        </Caption>
                        <View style={styles.tagContainer}>
                            {labelsTags?.map((tag, i) => (
                                <View key={i} style={[
                                    styles.tag,
                                    { backgroundColor: theme.colors.natural + '20' }
                                ]}>
                                    <Caption style={[styles.tagText, { color: theme.colors.natural }]}>
                                        {formatTag(tag)}
                                    </Caption>
                                </View>
                            )) || (
                                    <Body style={{ color: theme.colors.foreground }}>{labels}</Body>
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
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    rowContent: {
        marginLeft: 12,
        flex: 1,
    },
    rowLabel: {
        color: '#A1A1AA',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    labelsSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    labelsTitle: {
        color: '#A1A1AA',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
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
