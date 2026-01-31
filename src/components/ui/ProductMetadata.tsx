import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H3, Body, Caption, BodyBold } from './Typography';
import { theme } from '../../theme';

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
            <View className="flex-row items-start py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <Ionicons name={icon as any} size={16} color={theme.colors.muted} style={{ marginTop: 2 }} />
                <View className="ml-3 flex-1">
                    <Caption className="text-zinc-400 text-[10px] uppercase tracking-wider">{label}</Caption>
                    <Body className="text-zinc-700 dark:text-zinc-300 mt-0.5">{value}</Body>
                </View>
            </View>
        );
    };

    return (
        <View className="mb-6">
            <H3 className="mb-3 text-zinc-900 dark:text-zinc-100">Product Information</H3>
            <View className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <MetaRow icon="pricetag" label="Category" value={categories} />
                <MetaRow icon="globe" label="Origin" value={origins} />
                <MetaRow icon="location" label="Countries Sold" value={countries} />
                <MetaRow icon="storefront" label="Stores" value={stores || 'Not specified'} />
                <MetaRow icon="cube" label="Quantity" value={quantity} />

                {/* Labels/Certifications */}
                {(labels || labelsTags?.length) && (
                    <View className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                        <Caption className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2">
                            Labels & Certifications
                        </Caption>
                        <View className="flex-row flex-wrap gap-2">
                            {labelsTags?.map((tag, i) => (
                                <View key={i} className="bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">
                                    <Caption className="text-emerald-700 dark:text-emerald-300 font-bold">
                                        {formatTag(tag)}
                                    </Caption>
                                </View>
                            )) || (
                                    <Body className="text-zinc-600">{labels}</Body>
                                )}
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
