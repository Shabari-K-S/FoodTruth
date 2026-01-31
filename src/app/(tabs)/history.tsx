import React, { useState, useMemo } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Pressable,
    Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHistory } from '../../providers/HistoryProvider';
import { ScreenLayout } from '../../components/ui/ScreenLayout';
import { H1, Body, Caption } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

// Clean History Item - No borders, pure spacing
const HistoryItem = ({ item, onPress }: { item: any; onPress: () => void }) => {
    const { theme } = useTheme();

    // Clean health score badge (minimal pill design)
    const getScoreStyle = (score: number) => {
        if (score >= 80) return { bg: '#DCfce7', color: '#166534', text: 'Clean' };
        if (score >= 60) return { bg: '#FEF3C7', color: '#92400E', text: 'Fair' };
        if (score >= 40) return { bg: '#FFedd5', color: '#C2410C', text: 'Caution' };
        return { bg: '#FEE2E2', color: '#DC2626', text: 'Avoid' };
    };

    // Extract score from product data or mock
    const score = item.product?.nova_group || item.product?.nutriscore_score || 30;
    const badge = getScoreStyle(100 - (score * 10)); // Invert because lower NOVA is better

    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center py-3 active:opacity-60"
            style={{ paddingHorizontal: 4 }}
        >
            {/* Clean Image Container */}
            <View className="w-16 h-16 rounded-2xl bg-surface overflow-hidden mr-4 border border-border/10">
                {item.product?.image_url ? (
                    <Image
                        source={{ uri: item.product.image_url }}
                        className="w-full h-full"
                        style={{ resizeMode: 'cover' }}
                    />
                ) : (
                    <View className="w-full h-full items-center justify-center bg-muted/10">
                        <Ionicons name="nutrition-outline" size={24} color={theme.colors.muted} />
                    </View>
                )}
            </View>

            {/* Content Stack */}
            <View className="flex-1 justify-center">
                <Body className="text-base font-semibold text-foreground mb-1" numberOfLines={1}>
                    {item.product?.product_name || 'Unknown Product'}
                </Body>

                <Caption className="text-muted mb-2" numberOfLines={1}>
                    {item.product?.brands || 'Unknown brand'}
                </Caption>

                {/* Row: Badge + Time */}
                <View className="flex-row items-center">
                    <View
                        className="px-2.5 py-1 rounded-full mr-3"
                        style={{ backgroundColor: badge.bg }}
                    >
                        <Caption style={{ color: badge.color }} className="text-xs font-bold uppercase tracking-wide">
                            {badge.text}
                        </Caption>
                    </View>
                    <Caption className="text-xs text-muted/60 font-medium">
                        {time}
                    </Caption>
                </View>
            </View>

            {/* Subtle Arrow */}
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} style={{ opacity: 0.4 }} />
        </Pressable>
    );
};

// Section Header - Clean minimal style
const SectionHeader = ({ date }: { date: string }) => {
    const getLabel = () => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (date === today) return 'Today';
        if (date === yesterday) return 'Yesterday';
        return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <View className="flex-row items-center mb-3 mt-6 px-1">
            <View className="h-2 w-2 rounded-full bg-primary mr-2" />
            <Caption className="text-xs font-bold text-muted uppercase tracking-widest">
                {getLabel()}
            </Caption>
        </View>
    );
};

// Empty State
const EmptyState = ({ onScan }: { onScan: () => void }) => (
    <View className="flex-1 justify-center items-center px-8 min-h-[400px]">
        <View className="w-24 h-24 rounded-3xl bg-primary/5 items-center justify-center mb-6">
            <Ionicons name="scan-outline" size={32} color={theme.colors.primary} />
        </View>

        <Body className="text-lg font-semibold mb-2 text-center">
            No scans yet
        </Body>
        <Caption className="text-muted text-center mb-8 leading-5">
            Start scanning products to build your nutrition history
        </Caption>

        <TouchableOpacity
            onPress={onScan}
            className="bg-primary px-8 py-3.5 rounded-full flex-row items-center"
            activeOpacity={0.8}
        >
            <Ionicons name="scan" size={18} color="white" />
            <Body className="text-white font-semibold ml-2">Scan Product</Body>
        </TouchableOpacity>
    </View>
);

export default function HistoryScreen() {
    const { history, clearHistory } = useHistory();
    const router = useRouter();
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    // Group by date
    const sections = useMemo(() => {
        const filtered = history.filter(item => {
            const name = item.product?.product_name?.toLowerCase() || '';
            const brand = item.product?.brands?.toLowerCase() || '';
            const query = searchQuery.toLowerCase();
            return name.includes(query) || brand.includes(query);
        });

        const groups: { [key: string]: any[] } = {};
        filtered.forEach(item => {
            const dateKey = new Date(item.timestamp).toDateString();
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(item);
        });

        return Object.entries(groups).sort((a, b) =>
            new Date(b[0]).getTime() - new Date(a[0]).getTime()
        ).map(([date, items]) => ({
            date,
            items: items.sort((a, b) => b.timestamp - a.timestamp)
        }));
    }, [history, searchQuery]);

    const totalScans = history.length;
    const uniqueDays = new Set(history.map(h => new Date(h.timestamp).toDateString())).size;

    return (
        <ScreenLayout className="flex-1 bg-background" scrollable={false} edges={['top']}>
            {/* Clean Header */}
            <View className="px-5 pt-2 pb-4 flex-row justify-between items-end">
                <View>
                    <Caption className="text-primary font-semibold text-xs uppercase tracking-wider mb-1">
                        FoodTruth
                    </Caption>
                    <H1 className="text-2xl font-bold">History</H1>
                </View>

                {totalScans > 0 && (
                    <TouchableOpacity onPress={clearHistory} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <Caption className="text-destructive font-medium opacity-80">Clear</Caption>
                    </TouchableOpacity>
                )}
            </View>

            {/* Minimal Search */}
            {totalScans > 0 && (
                <View className="px-5 mb-6">
                    <View className="flex-row items-center bg-surface rounded-2xl px-4 h-12 border border-border/10">
                        <Ionicons name="search-outline" size={18} color={theme.colors.muted} />
                        <View className="flex-1 ml-3">
                            {!searchQuery ? (
                                <Caption className="text-muted">Search your scans...</Caption>
                            ) : null}
                            {/* Invisible input overlay for functionality */}
                        </View>
                    </View>

                    {/* Minimal Stats */}
                    <View className="flex-row mt-3 space-x-4 px-1">
                        <Caption className="text-xs text-muted">
                            <Caption className="text-foreground font-bold">{totalScans}</Caption> scans
                        </Caption>
                        <Caption className="text-xs text-muted">
                            <Caption className="text-foreground font-bold">{uniqueDays}</Caption> days
                        </Caption>
                    </View>
                </View>
            )}

            {/* Content */}
            {totalScans === 0 ? (
                <EmptyState onScan={() => router.push('/scan')} />
            ) : (
                <FlatList
                    data={sections}
                    keyExtractor={(item) => item.date}
                    renderItem={({ item: section }) => (
                        <View className="px-5 mb-2">
                            <SectionHeader date={section.date} />

                            {/* Clean Card - No internal borders */}
                            <Card className="p-4 bg-surface" style={{ borderRadius: 20 }}>
                                {section.items.map((item, idx) => (
                                    <View key={`${item.barcode}-${item.timestamp}`}>
                                        <HistoryItem
                                            item={item}
                                            onPress={() => router.push({
                                                pathname: '/product/[barcode]',
                                                params: { barcode: item.barcode }
                                            })}
                                        />
                                        {/* Subtle divider line only between items, not after last */}
                                        {idx < section.items.length - 1 && (
                                            <View className="h-px bg-border/10 ml-20" />
                                        )}
                                    </View>
                                ))}
                            </Card>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 280 }}
                />
            )}
        </ScreenLayout>
    );
}