import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Preferences {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    // We can add more here later (e.g. allergens)
}

interface PreferencesContextType {
    preferences: Preferences;
    togglePreference: (key: keyof Preferences) => void;
    loading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType>({
    preferences: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
    },
    togglePreference: () => { },
    loading: true,
});

const PREFS_KEY = 'foodtruth_preferences';

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<Preferences>({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
    });
    const [loading, setLoading] = useState(true);

    // Load from storage on mount
    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const stored = await AsyncStorage.getItem(PREFS_KEY);
            if (stored) {
                setPreferences(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load preferences', e);
        } finally {
            setLoading(false);
        }
    };

    const savePreferences = async (newPrefs: Preferences) => {
        try {
            await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(newPrefs));
        } catch (e) {
            console.error('Failed to save preferences', e);
        }
    };

    const togglePreference = (key: keyof Preferences) => {
        setPreferences(prev => {
            const next = { ...prev, [key]: !prev[key] };
            savePreferences(next);
            return next;
        });
    };

    return (
        <PreferencesContext.Provider value={{ preferences, togglePreference, loading }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export const usePreferences = () => useContext(PreferencesContext);
