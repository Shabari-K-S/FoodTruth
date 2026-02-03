import React, { useState, useMemo } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Pressable,
    Dimensions,
    StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHistory } from '../../providers/HistoryProvider';
import { ScreenLayout } from '../../components/ui/ScreenLayout';
import { H1, Body, Caption } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';
import { theme as appTheme } from '../../theme';
import { Product } from '../../types/openFoodFacts';

interface HistoryItemData {
    barcode: string;
    timestamp: number;
    product?: Product;
}

const { width } = Dimensions.get('window');

const HistoryItem = ({ item, onPress }: { item: HistoryItemData; onPress: () => void }) => {
    const { theme, isDark } = useTheme();

    const getScoreStyle = (score: number) => {
        if (score >= 80) return { bg: '#DCFCE7', color: '#166534', text: 'Clean' };
        if (score >= 60) return { bg: '#FEF3C7', color: '#92400E', text: 'Fair' };
        if (score >= 40) return { bg: '#FFEDD5', color: '#C2410C', text: 'Caution' };
        return { bg: '#FEE2E2', color: '#DC2626', text: 'Avoid' };
    };

    const score = item.product?.nova_group || item.product?.nutriscore_score || 30;
    const badge = getScoreStyle(100 - (score * 10));

    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Pressable
            onPress={onPress}
            style={styles.historyItem}
        >
            <View style={[
                styles.imageContainer,
                { backgroundColor: theme.colors.surface, borderColor: isDark ? '#27272A' : '#F4F4F5' }
            ]}>
                {item.product?.image_url ? (
                    <Image
                        source={{ uri: item.product.image_url }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.placeholderImage, { backgroundColor: isDark ? '#27272A' : '#F5F5F5' }]}>
                        <Ionicons name="nutrition-outline" size={24} color={theme.colors.muted} />
                    </View>
                )}
            </View>

            <View style={styles.contentStack}>
                <Body style={[styles.productName, { color: theme.colors.foreground }]} numberOfLines={1}>
                    {item.product?.product_name || 'Unknown Product'}
                </Body>

                <Caption style={styles.brandName} numberOfLines={1}>
                    {item.product?.brands || 'Unknown brand'}
                </Caption>

                <View style={styles.badgeRow}>
                    <View style={[styles.scoreBadge, { backgroundColor: badge.bg }]}>
                        <Caption style={[styles.scoreBadgeText, { color: badge.color }]}>
                            {badge.text}
                        </Caption>
                    </View>
                    <Caption style={styles.timeText}>{time}</Caption>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} style={{ opacity: 0.4 }} />
        </Pressable>
    );
};

const SectionHeader = ({ date }: { date: string }) => {
    const { theme } = useTheme();

    const getLabel = () => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (date === today) return 'Today';
        if (date === yesterday) return 'Yesterday';
        return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: theme.colors.primary }]} />
            <Caption style={styles.sectionTitle}>{getLabel()}</Caption>
        </View>
    );
};

const EmptyState = ({ onScan }: { onScan: () => void }) => (
    <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
            <Ionicons name="scan-outline" size={32} color={appTheme.colors.primary} />
        </View>

        <Body style={styles.emptyTitle}>No scans yet</Body>
        <Caption style={styles.emptySubtitle}>
            Start scanning products to build your nutrition history
        </Caption>

        <TouchableOpacity
            onPress={onScan}
            style={styles.scanButton}
            activeOpacity={0.8}
        >
            <Ionicons name="scan" size={18} color="white" />
            <Body style={styles.scanButtonText}>Scan Product</Body>
        </TouchableOpacity>
    </View>
);

export default function HistoryScreen() {
    const { history, clearHistory } = useHistory();
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const sections = useMemo(() => {
        const filtered = history.filter((item: HistoryItemData) => {
            const name = item.product?.product_name?.toLowerCase() || '';
            const brand = item.product?.brands?.toLowerCase() || '';
            const query = searchQuery.toLowerCase();
            return name.includes(query) || brand.includes(query);
        });

        const groups: { [key: string]: HistoryItemData[] } = {};
        filtered.forEach((item: HistoryItemData) => {
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
        <ScreenLayout scrollable={false} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Caption style={[styles.appName, { color: theme.colors.primary }]}>FoodTruth</Caption>
                    <H1 style={styles.title}>History</H1>
                </View>

                {totalScans > 0 && (
                    <TouchableOpacity onPress={clearHistory} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <Caption style={styles.clearButton}>Clear</Caption>
                    </TouchableOpacity>
                )}
            </View>

            {/* Search */}
            {totalScans > 0 && (
                <View style={styles.searchContainer}>
                    <View style={[
                        styles.searchBox,
                        { backgroundColor: theme.colors.surface, borderColor: isDark ? '#27272A' : '#F4F4F5' }
                    ]}>
                        <Ionicons name="search-outline" size={18} color={theme.colors.muted} />
                        <View style={styles.searchInput}>
                            {!searchQuery && (
                                <Caption style={{ color: theme.colors.muted }}>Search your scans...</Caption>
                            )}
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <Caption style={styles.statText}>
                            <Caption style={[styles.statValue, { color: theme.colors.foreground }]}>{totalScans}</Caption> scans
                        </Caption>
                        <Caption style={[styles.statText, { marginLeft: 16 }]}>
                            <Caption style={[styles.statValue, { color: theme.colors.foreground }]}>{uniqueDays}</Caption> days
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
                        <View style={styles.sectionContainer}>
                            <SectionHeader date={section.date} />

                            <Card padding="md" style={{ borderRadius: 20 }}>
                                {section.items.map((item: HistoryItemData, idx: number) => (
                                    <View key={`${item.barcode}-${item.timestamp}`}>
                                        <HistoryItem
                                            item={item}
                                            onPress={() => router.push({
                                                pathname: '/product/[barcode]',
                                                params: { barcode: item.barcode }
                                            })}
                                        />
                                        {idx < section.items.length - 1 && (
                                            <View style={[
                                                styles.divider,
                                                { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }
                                            ]} />
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

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    appName: {
        fontWeight: '600',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    clearButton: {
        color: '#EF4444',
        fontWeight: '500',
        opacity: 0.8,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
    },
    statsRow: {
        flexDirection: 'row',
        marginTop: 12,
        paddingHorizontal: 4,
    },
    statText: {
        fontSize: 12,
    },
    statValue: {
        fontWeight: '700',
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 24,
        paddingHorizontal: 4,
    },
    sectionDot: {
        height: 8,
        width: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#71717A',
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 16,
        borderWidth: 1,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentStack: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    brandName: {
        marginBottom: 8,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: 12,
    },
    scoreBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timeText: {
        fontSize: 12,
        opacity: 0.6,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        marginLeft: 80,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        minHeight: 400,
    },
    emptyIcon: {
        width: 96,
        height: 96,
        borderRadius: 24,
        backgroundColor: 'rgba(13, 148, 136, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    scanButton: {
        backgroundColor: '#0D9488',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
    },
    scanButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
    },
});