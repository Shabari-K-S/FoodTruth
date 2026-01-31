import React, { useEffect, useState } from 'react';
import { View, Image, Share, ScrollView } from 'react-native';
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
import { ActivityIndicator } from 'react-native';

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

        // 1. Check cache first
        setLoadingMessage('Checking cache...');
        const cached = await getCachedProduct(code);
        if (cached) {
            setProduct(cached);
            addToHistory(code, cached);
            setLoading(false);
            return;
        }

        // 2. Fetch from API
        setLoadingMessage('Fetching from Open Food Facts...');
        const result = await getProductByBarcode(code);
        if (result.found && result.status === 'found') {
            setProduct(result.data);
            addToHistory(code, result.data);
            // 3. Cache the result
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
            <View className="flex-1 bg-zinc-50 dark:bg-black justify-center items-center p-8">
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Body className="text-zinc-500 mt-4 text-center">Fetching product details...</Body>
                <Caption className="text-zinc-400 mt-2 text-center">{loadingMessage}</Caption>
            </View>
        );
    }

    if (error || !product) {
        return (
            <ScreenLayout className="justify-center items-center p-8">
                <Ionicons name="alert-circle-outline" size={64} color={theme.colors.danger} />
                <H2 className="mt-4 text-center">Product Not Found</H2>
                <Body className="text-zinc-400 mt-2 text-center">Barcode: {barcode}</Body>
                <Button title="Go Home" onPress={() => router.replace('/(tabs)')} variant="outline" className="mt-4" />
            </ScreenLayout>
        );
    }

    const healthScore = product.nutriscore_grade?.toLowerCase() || '?';

    return (
        <ScreenLayout padding="none" edges={['top']}>
            {/* Sticky Header Actions */}
            <View className="w-full flex-row justify-between bg-white dark:bg-zinc-900 -mb-20 z-50 mt-10">
                <Button
                    title=""
                    icon={<Ionicons name="arrow-back" size={24} color={theme.colors.foreground} />}
                    onPress={() => router.back()}
                    variant="ghost"
                    className="bg-white/80 dark:bg-zinc-800/80 rounded-full w-12 h-12 p-0 items-center justify-center shadow-sm"
                />
                <Button
                    title=""
                    icon={<Ionicons name="share-outline" size={24} color={theme.colors.foreground} />}
                    onPress={handleShare}
                    variant="ghost"
                    className="bg-white/80 dark:bg-zinc-800/80 rounded-full w-12 h-12 p-0 items-center justify-center shadow-sm"
                />
            </View>

            <ScrollView>
                {/* ===== HEADER SECTION ===== */}
                <View className="bg-white dark:bg-zinc-900 rounded-b-[40px] shadow-sm pb-10 pt-20 px-6">
                    <View className="items-center">
                        <Image
                            source={{ uri: product.image_url }}
                            className="w-48 h-48 rounded-2xl mb-6 shadow-sm bg-white"
                            resizeMode="contain"
                        />
                        <H2 className="text-center text-3xl mb-1 text-zinc-900 dark:text-zinc-50 font-display tracking-tight">
                            {product.product_name}
                        </H2>
                        <Body className="text-center text-zinc-500 mb-2 font-body tracking-wide uppercase text-xs">
                            {product.brands}
                        </Body>
                        <Caption className="text-zinc-400 text-[10px]">Barcode: {product.code}</Caption>
                    </View>

                    {/* Primary Scores Row */}
                    <View className="flex-row justify-center items-center gap-6 mt-6 w-full px-2">
                        {/* Nutri-Score Hexagon */}
                        <View className="items-center flex-1">
                            <ProductBadge grade={healthScore} size={64} />
                            <Caption className="mt-2 text-zinc-400 text-[10px] uppercase tracking-wider">Nutri-Score</Caption>
                        </View>

                        <View className="w-[1px] h-12 bg-zinc-200 dark:bg-zinc-800" />

                        {/* NOVA Indicator */}
                        <View className="items-center flex-1">
                            <NovaIndicator group={product.nova_group || 0} />
                            <Caption className="mt-2 text-zinc-400 text-[10px] uppercase tracking-wider">Processing</Caption>
                        </View>
                    </View>

                    {/* Secondary Metrics Grid */}
                    <View className="flex-row flex-wrap justify-between mt-8 gap-3 w-full">
                        <View className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl items-center border border-zinc-100 dark:border-zinc-800 min-w-[30%]">
                            <Ionicons name="leaf" size={20} color={['a', 'b'].includes(product.ecoscore_grade || '') ? theme.colors.natural : theme.colors.caution} />
                            <BodyBold className="mt-2 text-sm capitalize">
                                {product.ecoscore_grade && product.ecoscore_grade !== 'not-applicable'
                                    ? `Eco ${product.ecoscore_grade.toUpperCase()}`
                                    : 'N/A'}
                            </BodyBold>
                            <Caption className="text-[10px] text-zinc-400 uppercase">Eco-Score</Caption>
                        </View>

                        <View className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl items-center border border-zinc-100 dark:border-zinc-800 min-w-[30%]">
                            <Ionicons name="flask" size={20} color={(product.additives_n || 0) > 0 ? theme.colors.caution : theme.colors.natural} />
                            <BodyBold className="mt-2 text-sm">{product.additives_n || 0}</BodyBold>
                            <Caption className="text-[10px] text-zinc-400 uppercase">Additives</Caption>
                        </View>

                        <View className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl items-center border border-zinc-100 dark:border-zinc-800 min-w-[30%]">
                            <Ionicons name="warning" size={20} color={(product.allergens_tags?.length || 0) > 0 ? theme.colors.danger : theme.colors.muted} />
                            <BodyBold className="mt-2 text-sm">{product.allergens_tags?.length || 0}</BodyBold>
                            <Caption className="text-[10px] text-zinc-400 uppercase">Allergens</Caption>
                        </View>
                    </View>
                </View>

                {/* ===== DETAILED SECTIONS ===== */}
                <View className="px-5 mt-6">

                    {/* 1. NUTRIENT LEVELS (Fat, Sugar, Salt indicators) */}
                    <NutrientLevels
                        levels={product.nutrient_levels}
                        nutriments={product.nutriments}
                    />

                    {/* 2. INGREDIENTS ANALYSIS (Vegan, Vegetarian, Palm Oil) */}
                    <IngredientsAnalysis tags={product.ingredients_analysis_tags} />

                    {/* 3. NOVA MARKERS (Why ultra-processed?) */}
                    <NovaMarkers
                        novaGroup={product.nova_group}
                        markers={product.nova_groups_markers}
                    />

                    {/* 4. INGREDIENTS LIST */}
                    <Card variant="flat" className="mb-6 bg-zinc-100 dark:bg-zinc-900/50 p-5">
                        <H3 className="mb-4 text-zinc-800 dark:text-zinc-200">
                            Ingredients ({product.ingredients?.length || 'N/A'})
                        </H3>
                        <Body className="leading-7 text-zinc-600 dark:text-zinc-400 text-sm font-body">
                            {product.ingredients_text || 'No ingredient data available.'}
                        </Body>
                    </Card>

                    {/* 5. ALLERGENS (Detailed) */}
                    <AllergensDisplay
                        allergens={product.allergens}
                        allergensTags={product.allergens_tags}
                        traces={product.traces}
                        tracesTags={product.traces_tags}
                    />

                    {/* 6. ADDITIVES (Detailed list) */}
                    <AdditivesList
                        additives={product.additives_tags}
                        count={product.additives_n}
                    />

                    {/* 7. FULL NUTRITION TABLE */}
                    <ExtendedNutrition
                        nutriments={product.nutriments}
                        nutrientLevels={product.nutrient_levels}
                    />

                    {/* 8. PACKAGING & ENVIRONMENT */}
                    <PackagingInfo packaging={product.packaging as any} packagings={product.packagings} />

                    {/* 9. PRODUCT METADATA */}
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
                    <View className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-2xl mb-8">
                        <Caption className="text-center text-zinc-400 text-[10px]">
                            Data provided by Open Food Facts
                        </Caption>
                        <Caption className="text-center text-zinc-400 text-[10px] mt-1">
                            Last updated: {new Date((product.last_modified_t || 0) * 1000).toLocaleDateString()}
                        </Caption>
                        <Caption className="text-center text-zinc-300 text-[10px] mt-1">
                            Product added: {new Date((product.created_t || 0) * 1000).toLocaleDateString()}
                        </Caption>
                    </View>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
}
