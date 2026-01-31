
import {
    OpenFoodFactsResponse,
    Product,
    ScanResult,
    DataSource,
    FoundScanResult,
    NotFoundScanResult,
    ErrorScanResult
} from '../types/openFoodFacts';

// ✅ Fixed: Removed trailing spaces
const WORLD_URL = 'https://world.openfoodfacts.org/api/v2/product';
const INDIA_URL = 'https://in.openfoodfacts.org/api/v2/product';

const REQUEST_TIMEOUT = 2000000;

const isIndianBarcode = (barcode: string): boolean => {
    return barcode.startsWith('890');
};

const fetchFromEndpoint = async (
    barcode: string,
    endpoint: string
): Promise<OpenFoodFactsResponse | null> => {
    try {
        const url = `${endpoint}/${barcode}.json`;
        console.log(`Fetching: ${url}`);

        // Use AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'FoodTruth/1.0 (contact@foodtruth.app)',
                'Accept': 'application/json'
            },
            signal: controller.signal as AbortSignal
        });

        clearTimeout(timeoutId);

        if (response.status === 404) {
            console.log(`Product not found at ${endpoint}`);
            return null;
        }

        if (!response.ok) {
            console.error(`Error fetching from ${endpoint}: Status ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (data?.status === 1 && data?.product) {
            return data as OpenFoodFactsResponse;
        }
        return null;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.warn(`Timeout fetching from ${endpoint}`);
        } else {
            console.error(`Fetch Error fetching from ${endpoint}:`, error.message || error);
        }
        return null;
    }
};

export const getProductByBarcode = async (barcode: string): Promise<ScanResult> => {
    const cleanBarcode = barcode.trim();

    if (!cleanBarcode || !/^\d{8,13}$/.test(cleanBarcode)) { // ✅ Better validation (EAN-8 to EAN-13)
        return {
            found: false,
            status: 'error',
            barcode: cleanBarcode,
            error: new Error('Invalid barcode format'),
            message: 'Invalid barcode format. Must be 8-13 digits.'
        } as ErrorScanResult;
    }

    // Try both endpoints
    const endpoints = isIndianBarcode(cleanBarcode)
        ? [{ url: INDIA_URL, name: DataSource.INDIA }, { url: WORLD_URL, name: DataSource.WORLD }]
        : [{ url: WORLD_URL, name: DataSource.WORLD }, { url: INDIA_URL, name: DataSource.INDIA }];

    const searchedSources: DataSource[] = [];

    for (const { url, name } of endpoints) {
        searchedSources.push(name);
        const data = await fetchFromEndpoint(cleanBarcode, url);

        if (data?.product) {
            return {
                found: true,
                status: 'found',
                data: data.product,
                barcode: cleanBarcode,
                source: name,
                url: `${url}/${cleanBarcode}.json`
            } as FoundScanResult;
        }
    }

    return {
        found: false,
        status: 'not_found',
        barcode: cleanBarcode,
        searchedSources,
        message: 'Product not found in database'
    } as NotFoundScanResult;
};