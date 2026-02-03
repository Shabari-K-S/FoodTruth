import React, { useEffect, useState } from 'react';
import { View, Image, Share, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProductByBarcode } from '../../services/openFoodFacts';
import { Product } from '../../types/openFoodFacts';
import { useHistory } from '../../providers/HistoryProvider';
import { ScreenLayout } from '../../components/ui/ScreenLayout';
import { H2, H3, Body, BodyBold, Caption } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useTheme } from '../../providers/ThemeProvider';

// Health & Nutrition Components
import { ProductBadge } from '../../components/ui/ProductBadge';
import { NovaIndicator } from '../../components/ui/NovaIndicator';
import { NutrientLevels } from '../../components/ui/NutrientLevels';
import { ExtendedNutrition } from '../../components/ui/ExtendedNutrition';

// Ingredients & Additives Components
import { IngredientsAnalysis } from '../../components/ui/IngredientsAnalysis';
import { AdditivesList } from '../../components/ui/AdditivesList';
import { AllergensDisplay } from '../../components/ui/AllergensDisplay';
import { NovaMarkers } from '../../components/ui/NovaMarkers';

// Environment & Metadata Components
import { PackagingInfo } from '../../components/ui/PackagingInfo';
import { ProductMetadata } from '../../components/ui/ProductMetadata';

// Cache
import { getCachedProduct, cacheProduct } from '../../services/productCache';

export default function ProductDetailsScreen() {
    const { barcode } = useLocalSearchParams<{ barcode: string }>();
    const router = useRouter();
    const { theme: themeColors, isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Checking cache...');
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState('');

    const { addToHistory } = useHistory();

    useEffect(() => {
        if (barcode) {
            fetchProduct(barcode);
        } else {
            setLoading(false);
            setError('No barcode provided');
        }
    }, [barcode]);

    const fetchProduct = async (code: string) => {
        setLoading(true);
        setError('');

        setLoadingMessage('Checking cache...');
        const cached = await getCachedProduct(code);
        if (cached) {
            setProduct(cached);
            addToHistory(code, cached);
            setLoading(false);
            return;
        }

        setLoadingMessage('Fetching from Open Food Facts...');
        const result = await getProductByBarcode(code);
        if (result.found && result.status === 'found') {
            setProduct(result.data);
            addToHistory(code, result.data);
            await cacheProduct(code, result.data);
        } else {
            setError('Product not found');
        }
        setLoading(false);
    };

    const handleShare = async () => {
        if (!product) return;
        try {
            await Share.share({
                message: `Check out ${product.product_name} on FoodTruth! Nutri-Score: ${product.nutriscore_grade?.toUpperCase()}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#000' : '#FAFAFA' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Body style={styles.loadingText}>Fetching product details...</Body>
                <Caption style={styles.loadingSubtext}>{loadingMessage}</Caption>
            </View>
        );
    }

    if (error || !product) {
        return (
            <ScreenLayout>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={theme.colors.danger} />
                    <H2 style={styles.errorTitle}>Product Not Found</H2>
                    <Body style={styles.errorBarcode}>Barcode: {barcode}</Body>
                    <Button title="Go Home" onPress={() => router.replace('/(tabs)')} variant="outline" />
                </View>
            </ScreenLayout>
        );
    }

    const healthScore = product.nutriscore_grade?.toLowerCase() || '?';

    return (
        <ScreenLayout padding="none" edges={['top']}>
            {/* Sticky Header Actions */}
            <View style={[styles.headerActions, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                <Button
                    title=""
                    icon={<Ionicons name="arrow-back" size={24} color={themeColors.colors.foreground} />}
                    onPress={() => router.back()}
                    variant="ghost"
                    style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(39,39,42,0.8)' : 'rgba(255,255,255,0.8)' }]}
                />
                <Button
                    title=""
                    icon={<Ionicons name="share-outline" size={24} color={themeColors.colors.foreground} />}
                    onPress={handleShare}
                    variant="ghost"
                    style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(39,39,42,0.8)' : 'rgba(255,255,255,0.8)' }]}
                />
            </View>

            <ScrollView>
                {/* ===== HEADER SECTION ===== */}
                <View style={[styles.headerSection, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.productHeader}>
                        <Image
                            source={{ uri: product.image_url }}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                        <H2 style={[styles.productName, { color: isDark ? '#FAFAFA' : '#18181B' }]}>
                            {product.product_name}
                        </H2>
                        <Body style={styles.brandName}>
                            {product.brands}
                        </Body>
                        <Caption style={styles.barcodeText}>Barcode: {product.code}</Caption>
                    </View>

                    {/* Primary Scores Row */}
                    <View style={styles.scoresRow}>
                        <View style={styles.scoreItem}>
                            <ProductBadge grade={healthScore} size={64} />
                            <Caption style={styles.scoreLabel}>Nutri-Score</Caption>
                        </View>

                        <View style={[styles.scoreDivider, { backgroundColor: isDark ? '#27272A' : '#E5E7EB' }]} />

                        <View style={styles.scoreItem}>
                            <NovaIndicator group={product.nova_group || 0} />
                            <Caption style={styles.scoreLabel}>Processing</Caption>
                        </View>
                    </View>

                    {/* Secondary Metrics Grid */}
                    <View style={styles.metricsGrid}>
                        <View style={[styles.metricCard, { backgroundColor: isDark ? 'rgba(39,39,42,0.5)' : '#FAFAFA', borderColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                            <Ionicons name="leaf" size={20} color={['a', 'b'].includes(product.ecoscore_grade || '') ? theme.colors.natural : theme.colors.caution} />
                            <BodyBold style={styles.metricValue}>
                                {product.ecoscore_grade && product.ecoscore_grade !== 'not-applicable'
                                    ? `Eco ${product.ecoscore_grade.toUpperCase()}`
                                    : 'N/A'}
                            </BodyBold>
                            <Caption style={styles.metricLabel}>Eco-Score</Caption>
                        </View>

                        <View style={[styles.metricCard, { backgroundColor: isDark ? 'rgba(39,39,42,0.5)' : '#FAFAFA', borderColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                            <Ionicons name="flask" size={20} color={(product.additives_n || 0) > 0 ? theme.colors.caution : theme.colors.natural} />
                            <BodyBold style={styles.metricValue}>{product.additives_n || 0}</BodyBold>
                            <Caption style={styles.metricLabel}>Additives</Caption>
                        </View>

                        <View style={[styles.metricCard, { backgroundColor: isDark ? 'rgba(39,39,42,0.5)' : '#FAFAFA', borderColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                            <Ionicons name="warning" size={20} color={(product.allergens_tags?.length || 0) > 0 ? theme.colors.danger : theme.colors.muted} />
                            <BodyBold style={styles.metricValue}>{product.allergens_tags?.length || 0}</BodyBold>
                            <Caption style={styles.metricLabel}>Allergens</Caption>
                        </View>
                    </View>
                </View>

                {/* ===== DETAILED SECTIONS ===== */}
                <View style={styles.detailsContainer}>
                    <NutrientLevels
                        levels={product.nutrient_levels}
                        nutriments={product.nutriments}
                    />

                    <IngredientsAnalysis tags={product.ingredients_analysis_tags} />

                    <NovaMarkers
                        novaGroup={product.nova_group}
                        markers={product.nova_groups_markers}
                    />

                    {/* Ingredients List */}
                    <Card variant="flat" padding="lg" style={styles.ingredientsCard}>
                        <H3 style={[styles.sectionTitle, { color: isDark ? '#E5E7EB' : '#27272A' }]}>
                            Ingredients ({product.ingredients?.length || 'N/A'})
                        </H3>
                        <Body style={styles.ingredientsText}>
                            {product.ingredients_text || 'No ingredient data available.'}
                        </Body>
                    </Card>

                    <AllergensDisplay
                        allergens={product.allergens}
                        allergensTags={product.allergens_tags}
                        traces={product.traces}
                        tracesTags={product.traces_tags}
                    />

                    <AdditivesList
                        additives={product.additives_tags}
                        count={product.additives_n}
                    />

                    <ExtendedNutrition
                        nutriments={product.nutriments}
                        nutrientLevels={product.nutrient_levels}
                    />

                    <PackagingInfo packaging={product.packaging as any} packagings={product.packagings} />

                    <ProductMetadata
                        categories={product.categories}
                        categoriesTags={product.categories_tags}
                        labels={product.labels}
                        labelsTags={product.labels_tags}
                        origins={product.origins}
                        countries={product.countries}
                        stores={product.stores}
                        brands={product.brands}
                        quantity={product.quantity}
                    />

                    {/* DATA SOURCE FOOTER */}
                    <View style={[styles.footer, { backgroundColor: isDark ? 'rgba(24,24,27,0.5)' : '#F4F4F5' }]}>
                        <Caption style={styles.footerText}>
                            Data provided by Open Food Facts
                        </Caption>
                        <Caption style={styles.footerText}>
                            Last updated: {new Date((product.last_modified_t || 0) * 1000).toLocaleDateString()}
                        </Caption>
                        <Caption style={styles.footerText}>
                            Product added: {new Date((product.created_t || 0) * 1000).toLocaleDateString()}
                        </Caption>
                    </View>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        color: '#71717A',
        marginTop: 16,
        textAlign: 'center',
    },
    loadingSubtext: {
        color: '#A1A1AA',
        marginTop: 8,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    errorTitle: {
        marginTop: 16,
        textAlign: 'center',
    },
    errorBarcode: {
        color: '#A1A1AA',
        marginTop: 8,
        textAlign: 'center',
        marginBottom: 16,
    },
    headerActions: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: -80,
        zIndex: 50,
        marginTop: 40,
        paddingHorizontal: 16,
    },
    actionButton: {
        borderRadius: 24,
        width: 48,
        height: 48,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    headerSection: {
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        paddingBottom: 40,
        paddingTop: 80,
        paddingHorizontal: 24,
    },
    productHeader: {
        alignItems: 'center',
    },
    productImage: {
        width: 192,
        height: 192,
        borderRadius: 16,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
    },
    productName: {
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    brandName: {
        textAlign: 'center',
        color: '#71717A',
        marginBottom: 8,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontSize: 12,
    },
    barcodeText: {
        color: '#A1A1AA',
        fontSize: 10,
    },
    scoresRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        marginTop: 24,
        width: '100%',
        paddingHorizontal: 8,
    },
    scoreItem: {
        alignItems: 'center',
        flex: 1,
    },
    scoreDivider: {
        width: 1,
        height: 48,
    },
    scoreLabel: {
        marginTop: 8,
        color: '#A1A1AA',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 32,
        gap: 12,
        width: '100%',
    },
    metricCard: {
        flex: 1,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        minWidth: '30%',
    },
    metricValue: {
        marginTop: 8,
        fontSize: 14,
    },
    metricLabel: {
        fontSize: 10,
        color: '#A1A1AA',
        textTransform: 'uppercase',
    },
    detailsContainer: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    ingredientsCard: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    ingredientsText: {
        lineHeight: 28,
        color: '#52525B',
        fontSize: 14,
    },
    footer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 32,
    },
    footerText: {
        textAlign: 'center',
        color: '#A1A1AA',
        fontSize: 10,
        marginTop: 4,
    },
});
