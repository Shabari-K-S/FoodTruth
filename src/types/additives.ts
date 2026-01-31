// Matches the JSON structure from CODEX CAC/GL 36-1989
export interface CodexAdditive {
    name: string;
    functional_class: string[];
    purpose: string[];
    subtypes?: Record<string, string>;
}

export interface AdditiveData {
    name: string;
    function: string;        // Primary function (first from array)
    risk_level: 'low' | 'moderate' | 'high' | 'unknown';
    functional_classes: string[]; // All functions
    warning?: string;        // For Southampton Six
    subtypes?: Record<string, string>; // Subtype variants (e.g., 160a(i), 160a(ii))
}

export interface AdditiveDatabase {
    metadata: {
        source: string;
        title: string;
        version: string;
        total_entries: number;
    };
    additives: Record<string, CodexAdditive>;
}

// Southampton Six - colours requiring EU warning labels
export const SOUTHAMPTON_SIX = ['E102', 'E104', 'E110', 'E122', 'E124', 'E129'];