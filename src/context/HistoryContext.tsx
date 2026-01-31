import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/openFoodFacts';

interface HistoryItem {
    barcode: string;
    timestamp: number;
    product?: Product;
}

interface HistoryContextType {
    history: HistoryItem[];
    addToHistory: (barcode: string, product?: Product) => Promise<void>;
    clearHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType>({
    history: [],
    addToHistory: async () => { },
    clearHistory: async () => { },
});

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const stored = await AsyncStorage.getItem('scan_history');
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load history', e);
        }
    };

    const addToHistory = async (barcode: string, product?: Product) => {
        try {
            // Remove existing item with same barcode to avoid duplicates, move to top
            const filtered = history.filter(item => item.barcode !== barcode);
            const newItem: HistoryItem = { barcode, timestamp: Date.now(), product };
            const newHistory = [newItem, ...filtered];

            setHistory(newHistory);
            await AsyncStorage.setItem('scan_history', JSON.stringify(newHistory));
        } catch (e) {
            console.error('Failed to save history', e);
        }
    };

    const clearHistory = async () => {
        try {
            setHistory([]);
            await AsyncStorage.removeItem('scan_history');
        } catch (e) {
            console.error('Failed to clear history', e);
        }
    };

    return (
        <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};
