/**
 * Open Food Facts API v2 Response Types
 * Documentation: https://openfoodfacts.github.io/api-documentation/
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum DataSource {
    WORLD = 'world',
    INDIA = 'india',
    US = 'us',
    UK = 'uk'
}

export enum NutriscoreGrade {
    A = 'a',
    B = 'b',
    C = 'c',
    D = 'd',
    E = 'e',
    UNKNOWN = 'unknown'
}

export enum NovaGroup {
    UNPROCESSED = 1,      // Unprocessed or minimally processed foods
    PROCESSED_CULINARY = 2, // Processed culinary ingredients
    PROCESSED = 3,          // Processed foods
    ULTRA_PROCESSED = 4     // Ultra-processed food and drink products
}

// ============================================================================
// NUTRI-SCORE & HEALTH TYPES
// ============================================================================

export interface NutriscoreComponent {
    id: string;
    points: number;
    points_max: number;
    unit: string;
    value: number | null;
}

export interface NutriscoreData {
    grade?: NutriscoreGrade;
    score?: number;
    components?: {
        negative: NutriscoreComponent[];
        positive: NutriscoreComponent[];
    };
    positive_points?: number;
    negative_points?: number;
    [key: string]: any;
}

export interface NutrientLevels {
    fat?: 'low' | 'moderate' | 'high';
    salt?: 'low' | 'moderate' | 'high';
    'saturated-fat'?: 'low' | 'moderate' | 'high';
    sugars?: 'low' | 'moderate' | 'high';
}

// ============================================================================
// PROCESSING & NOVA TYPES
// ============================================================================

export interface NovaGroupsMarkers {
    [key: string]: [string, string][]; // e.g. "4": [["additives", "en:e129"], ...]
}

// ============================================================================
// ENVIRONMENT & ECO-SCORE TYPES
// ============================================================================

export interface EcoScoreData {
    grade?: EcoScoreGrade;
    score?: number;
    status?: string;
    adjustments?: {
        origins_of_ingredients?: {
            epi_score?: number;
            transportation_score?: number;
            [key: string]: any;
        };
        packaging?: {
            value?: number;
            score?: number;
            packagings?: Packaging[];
        };
        production_system?: {
            value?: number;
        };
        threatened_species?: any;
    };
    [key: string]: any;
}

export interface Packaging {
    material?: string;
    shape?: string;
    quantity_per_unit?: string;
    recycling?: string;
    weight?: number;
    parts?: PackagingPart[];
    packagings?: PackagingPart[]; // API sometimes uses this
}

export interface PackagingPart {
    material?: string;
    shape?: string;
    recycling?: string;
    quantity_per_unit?: string;
    weight?: number;
}

export enum EcoScoreGrade {
    A = 'a',
    B = 'b',
    C = 'c',
    D = 'd',
    E = 'e',
    UNKNOWN = 'unknown',
    NOT_APPLICABLE = 'not-applicable'
}

// ============================================================================
// NUTRITION TYPES
// ============================================================================

export interface Nutriments {
    // Energy
    energy?: number;                    // in kJ
    energy_kj?: number;
    energy_kcal?: number;               // in kcal
    energy_kcal_100g?: number;
    energy_100g?: number;

    // Macronutrients (per 100g)
    fat_100g?: number;
    saturated_fat_100g?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    proteins_100g?: number;
    fiber_100g?: number;
    salt_100g?: number;
    sodium_100g?: number;

    // Additional fats
    trans_fat_100g?: number;
    cholesterol_100g?: number;

    // Vitamins & Minerals (per 100g)
    vitamin_a_100g?: number;
    vitamin_c_100g?: number;
    vitamin_d_100g?: number;
    calcium_100g?: number;
    iron_100g?: number;
    potassium_100g?: number;

    // Per serving values
    fat_serving?: number;
    carbohydrates_serving?: number;
    proteins_serving?: number;
    energy_kcal_serving?: number;

    // Raw values without unit normalization
    [key: string]: number | string | undefined;
}

export interface NutrimentsEstimates {
    fat?: number;
    saturated_fat?: number;
    sugars?: number;
    salt?: number;
}

// ============================================================================
// PRODUCT METADATA
// ============================================================================

export interface ProductImages {
    front_url?: string;
    ingredients_url?: string;
    nutrition_url?: string;
    front_small_url?: string;
    [key: string]: string | undefined;
}

export interface Ingredient {
    id?: string;
    text?: string;
    vegan?: 'yes' | 'no' | 'maybe';
    vegetarian?: 'yes' | 'no' | 'maybe';
    from_palm_oil?: 'yes' | 'no' | 'maybe';
    percent_estimate?: number;
    percent_max?: number;
    percent_min?: number;
}

export interface Additive {
    id: string;
    name: string;
    description?: string;
}

export interface Allergen {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
}

// ============================================================================
// MAIN PRODUCT INTERFACE
// ============================================================================

export interface Product {
    // Identification
    code: string;
    _id?: string;

    // Basic Info
    product_name?: string;
    product_name_en?: string;
    brands?: string;
    brands_tags?: string[];

    // Descriptions
    generic_name?: string;
    generic_name_en?: string;
    ingredients_text?: string;
    ingredients_text_en?: string;
    ingredients_text_with_allergens?: string;

    // Structured Ingredients (if available)
    ingredients?: Ingredient[];
    ingredients_analysis_tags?: string[];

    // Allergens
    allergens?: string;              // Comma separated string
    allergens_from_ingredients?: string;
    allergens_hierarchy?: string[];
    allergens_tags?: string[];
    traces?: string;
    traces_tags?: string[];

    // Nutrition
    nutriments?: Nutriments;
    nutrition_data_per?: '100g' | 'serving';
    serving_size?: string;
    serving_quantity?: number;
    serving_quantity_g?: number;

    // Scores & Grades
    nutriscore_grade?: NutriscoreGrade;
    nutriscore_score?: number;
    nutriscore_data?: NutriscoreData;
    nutrient_levels?: NutrientLevels;
    nova_group?: NovaGroup;
    nova_groups_markers?: NovaGroupsMarkers;
    ecoscore_grade?: EcoScoreGrade;
    ecoscore_score?: number;
    ecoscore_data?: EcoScoreData;

    // Additives
    additives_tags?: string[];
    additives_n?: number;
    additives_original_tags?: string[];

    // Images
    image_url?: string;
    image_small_url?: string;
    image_thumb_url?: string;
    images?: ProductImages;
    selected_images?: {
        front?: { display?: { en?: string }, small?: { en?: string }, thumb?: { en?: string } };
        ingredients?: { display?: { en?: string }, small?: { en?: string } };
        nutrition?: { display?: { en?: string }, small?: { en?: string } };
    };

    // Categorization
    categories?: string;
    categories_tags?: string[];
    categories_hierarchy?: string[];
    pnns_groups_1?: string;
    pnns_groups_2?: string;
    food_groups_tags?: string[];

    // Origin & Manufacturing
    origins?: string;
    origins_tags?: string[];
    manufacturing_places?: string;
    countries?: string;
    countries_tags?: string[];
    country_of_origin?: string;
    country_of_origin_en?: string;
    stores?: string;
    stores_tags?: string[];

    // Labels & Certifications (important for Indian products)
    labels?: string;
    labels_tags?: string[];
    labels_hierarchy?: string[];
    labels_old?: string;

    // Specific Indian relevance
    vegetarian?: 'yes' | 'no' | 'unknown';  // Indian vegetarian marking
    vegan?: 'yes' | 'no' | 'unknown';

    // Metadata
    created_t?: number;
    last_modified_t?: number;
    last_check_t?: number;
    checkers_tags?: string[];
    correctors_tags?: string[];
    informers_tags?: string[];
    editors_tags?: string[];
    photographers_tags?: string[];
    sources?: string[];

    // Flags
    new_additives?: number;
    unknown_ingredients_n?: number;

    // Environment & Packaging
    packaging?: Packaging;
    packaging_tags?: string[];
    packagings?: PackagingPart[]; // API v2 returns array of packaging parts
    environment_infocard?: string;
    environment_impact_level?: string;
    environment_impact_level_tags?: string[];

    // Product quantity
    quantity?: string;

    // Additional fields (flexible)
    [key: string]: any;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface OpenFoodFactsResponse {
    code: string;
    product?: Product;
    status: 0 | 1;  // 0 = not found, 1 = found
    status_verbose?: 'product not found' | 'product found';
}

export interface OpenFoodFactsErrorResponse {
    status: 0;
    status_verbose: 'product not found';
    code: string;
}

// ============================================================================
// SERVICE RESPONSE TYPES
// ============================================================================

export type ScanStatus = 'found' | 'not_found' | 'error' | 'network_error' | 'timeout';

export interface FoundScanResult {
    found: true;
    status: Extract<ScanStatus, 'found'>;
    data: Product;
    barcode: string;
    source: DataSource;
    url: string;
    responseTime?: number;
}

export interface NotFoundScanResult {
    found: false;
    status: Extract<ScanStatus, 'not_found'>;
    barcode: string;
    searchedSources: DataSource[];
    message: string;
}

export interface ErrorScanResult {
    found: false;
    status: Extract<ScanStatus, 'error' | 'network_error' | 'timeout'>;
    barcode: string;
    error: Error;
    message: string;
    source?: DataSource;
}

export type ScanResult = FoundScanResult | NotFoundScanResult | ErrorScanResult;

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface OpenFoodFactsConfig {
    baseUrls?: {
        world: string;
        india: string;
        [key: string]: string;
    };
    timeout?: number;
    retries?: number;
    userAgent: string;  // Required by OFF API terms
}

export interface RequestOptions {
    timeout?: number;
    signal?: AbortSignal;
    headers?: Record<string, string>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type BarcodePrefix = '890' | '691' | '692' | '693' | '694' | '695' | '850' | '800' | string;

export interface RegionConfig {
    prefix: string;
    source: DataSource;
    name: string;
}

// Type guard to check if scan was successful
export function isFoundResult(result: ScanResult): result is FoundScanResult {
    return result.found === true;
}

// Type guard to check if product has nutrition data
export function hasNutritionData(product: Product): product is Product & { nutriments: Nutriments } {
    return !!product.nutriments && Object.keys(product.nutriments).length > 0;
}

// Type guard for Indian products
export function isIndianProduct(product: Product): boolean {
    const isIndianCode = product.code?.startsWith('890') ?? false;
    const isIndianCountry = product.countries_tags?.includes('en:india') ?? false;
    const isIndianOrigin = product.origins_tags?.includes('en:india') ?? false;

    return isIndianCode || isIndianCountry || isIndianOrigin;
}

// ============================================================================
// LEGACY COMPATIBILITY (for backward compatibility with your old code)
// ============================================================================

/**
 * @deprecated Use OpenFoodFactsResponse instead
 */
export interface ProductData extends OpenFoodFactsResponse { }
