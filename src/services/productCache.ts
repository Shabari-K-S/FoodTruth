import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/openFoodFacts';

const CACHE_PREFIX = 'product_cache_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedProduct {
    product: Product;
    timestamp: number;
}

/**
 * Get a cached product by barcode
 */
export async function getCachedProduct(barcode: string): Promise<Product | null> {
    try {
        const key = `${CACHE_PREFIX}${barcode}`;
        const data = await AsyncStorage.getItem(key);

        if (!data) return null;

        const cached: CachedProduct = JSON.parse(data);
        const now = Date.now();

        // Check if cache is still valid
        if (now - cached.timestamp > CACHE_TTL_MS) {
            await AsyncStorage.removeItem(key);
            return null;
        }

        return cached.product;
    } catch (error) {
        console.warn('Cache read error:', error);
        return null;
    }
}

/**
 * Store a product in cache
 */
export async function cacheProduct(barcode: string, product: Product): Promise<void> {
    try {
        const key = `${CACHE_PREFIX}${barcode}`;
        const data: CachedProduct = {
            product,
            timestamp: Date.now(),
        };
        await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('Cache write error:', error);
    }
}

/**
 * Clear entire product cache
 */
export async function clearProductCache(): Promise<void> {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
        await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
        console.warn('Cache clear error:', error);
    }
}
