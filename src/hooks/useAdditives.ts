import { useState, useEffect, useCallback } from 'react';
import { AdditiveData, AdditiveDatabase, SOUTHAMPTON_SIX } from '../types/additives';
import additivesJson from '../data/additives-data.json'; // Import the JSON directly

// Risk assessment based on functional classes and known concerns
const assessRisk = (code: string, additive: any): AdditiveData['risk_level'] => {
    const functionalClasses = additive.functional_class || [];
    const name = additive.name.toLowerCase();

    // Southampton Six - High risk (hyperactivity in children)
    if (SOUTHAMPTON_SIX.includes(code.toUpperCase())) {
        return 'high';
    }

    // Artificial colours generally moderate to high
    if (functionalClasses.includes('Colour')) {
        // Natural colours are safer
        if (name.includes('curcumin') || name.includes('chlorophyll') ||
            name.includes('carotene') || name.includes('beet') ||
            name.includes('paprika') || name.includes('lycopene')) {
            return 'low';
        }
        // Synthetic colours
        if (name.includes('azorubine') || name.includes('ponceau') ||
            name.includes('erythrosine') || name.includes('indigotine')) {
            return 'high';
        }
        return 'moderate';
    }

    // Sulphites (preservatives/antioxidants) - moderate risk (allergies)
    if (code.match(/^E22[0-9]/) || name.includes('sulfite') || name.includes('sulphite')) {
        return 'moderate';
    }

    // Synthetic preservatives - moderate to high
    if (functionalClasses.includes('Preservative')) {
        if (name.includes('benzoate') || name.includes('sorbate') ||
            name.includes('nitrite') || name.includes('nitrate')) {
            return 'moderate';
        }
        return 'moderate';
    }

    // Artificial sweeteners - moderate
    if (functionalClasses.includes('Sweetener')) {
        if (name.includes('aspartame') || name.includes('saccharin') ||
            name.includes('cyclamate')) {
            return 'moderate';
        }
        // Natural sweeteners
        if (name.includes('steviol') || name.includes('thaumatin') ||
            name.includes('xylitol') || name.includes('erythritol')) {
            return 'low';
        }
        return 'moderate';
    }

    // Antioxidants - generally low to moderate
    if (functionalClasses.includes('Antioxidant')) {
        if (name.includes('bha') || name.includes('bht') || name.includes('tbhq')) {
            return 'high';
        }
        if (name.includes('ascorbic') || name.includes('tocopherol') ||
            name.includes('vitamin') || name.includes('citric')) {
            return 'low';
        }
        return 'moderate';
    }

    // Thickeners/Stabilisers/Emulsifiers - generally low
    if (functionalClasses.some((fc: any) => ['Thickener', 'Stabilizer', 'Emulsifier', 'Gelling agent'].includes(fc))) {
        // Carrageenan is controversial
        if (name.includes('carrageenan')) return 'moderate';
        // Natural gums
        if (name.includes('pectin') || name.includes('arabic') ||
            name.includes('guar') || name.includes('xanthan') ||
            name.includes('agar') || name.includes('alginate')) {
            return 'low';
        }
        return 'low';
    }

    // Acidity regulators - generally low
    if (functionalClasses.includes('Acidity regulator')) {
        return 'low';
    }

    // Flavour enhancers (MSG, etc.) - moderate
    if (functionalClasses.includes('Flavour enhancer')) {
        if (name.includes('glutamate')) return 'moderate';
        return 'low';
    }

    // Default
    return 'unknown';
};

export const useAdditives = () => {
    const [database, setDatabase] = useState<Record<string, AdditiveData>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Transform the imported JSON
        const loadDatabase = () => {
            try {
                const rawData = additivesJson as AdditiveDatabase;
                const transformed: Record<string, AdditiveData> = {};

                Object.entries(rawData.additives).forEach(([code, data]) => {
                    transformed[code] = {
                        name: data.name,
                        function: data.functional_class[0] || 'Unknown', // Primary function
                        functional_classes: data.functional_class,
                        risk_level: assessRisk(code, data),
                        subtypes: data.subtypes, // Include subtypes for variant lookups
                        warning: SOUTHAMPTON_SIX.includes(code.toUpperCase())
                            ? 'May have an adverse effect on activity and attention in children'
                            : undefined
                    };
                });

                setDatabase(transformed);
                setLoading(false);
            } catch (error) {
                console.error('Error loading additives database:', error);
                setLoading(false);
            }
        };

        loadDatabase();
    }, []);

    const getAdditiveInfo = useCallback((code: string): AdditiveData | null => {
        // Normalize code: "en:e100" -> "100", "E100" -> "100"
        // The JSON uses keys without "E" prefix (e.g., "100", "160a", "330")
        let normalizedCode = code.toUpperCase().replace('EN:', '').trim();

        // Remove the "E" prefix if present (database keys don't have it)
        if (normalizedCode.startsWith('E')) {
            normalizedCode = normalizedCode.substring(1);
        }

        // Convert to lowercase for consistent matching (JSON keys can be like "160a")
        normalizedCode = normalizedCode.toLowerCase();

        // Check main database (exact match)
        if (database[normalizedCode]) {
            return database[normalizedCode];
        }

        // Check subtypes with parentheses (e.g., "160a(i)" -> lookup under "160a")
        const codeWithoutParens = normalizedCode.replace(/\(.*\)/, '');
        if (database[codeWithoutParens]) {
            const baseData = database[codeWithoutParens];
            if (baseData.subtypes && baseData.subtypes[normalizedCode]) {
                return {
                    ...baseData,
                    name: baseData.subtypes[normalizedCode]
                };
            }
            return baseData;
        }

        // Handle letter-suffix codes (e.g., "150d" -> lookup "150" and find subtype "150d")
        // Extract numeric base: "150d" -> "150", "160a" -> "160"
        const numericMatch = normalizedCode.match(/^(\d+)([a-z])?/i);
        if (numericMatch) {
            const numericBase = numericMatch[1]; // e.g., "150"
            const letterSuffix = numericMatch[2]; // e.g., "d"

            if (database[numericBase]) {
                const baseData = database[numericBase];
                // Check for subtype with letter suffix (e.g., "150d")
                if (letterSuffix && baseData.subtypes) {
                    const subtypeKey = `${numericBase}${letterSuffix}`;
                    if (baseData.subtypes[subtypeKey]) {
                        return {
                            ...baseData,
                            name: baseData.subtypes[subtypeKey]
                        };
                    }
                }
                return baseData;
            }
        }

        return null;
    }, [database]);

    return { getAdditiveInfo, loading, database };
};