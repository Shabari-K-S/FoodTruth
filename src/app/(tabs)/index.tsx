import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FloatingNavBar } from '../../components/ui/FloatingNavBar';
import { theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { H1, H2, Body, Caption } from '../../components/ui/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [eanInput, setEanInput] = useState('');

    const handleScanPress = () => {
        router.push('/scan');
    };

    const handleManualSearch = () => {
        const cleanEan = eanInput.trim();
        if (cleanEan && /^\d{8,13}$/.test(cleanEan)) {
            Keyboard.dismiss();
            router.push(`/product/${cleanEan}`);
            setEanInput('');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <View className="flex-1 bg-zinc-50 dark:bg-black">
                {/* Background Gradient */}
                <LinearGradient
                    colors={['#0D948820', '#F59E0B10', '#EF444410']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />

                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Caption className="text-zinc-400 uppercase tracking-widest text-xs">FoodTruth</Caption>
                        <H1 className="text-zinc-900 dark:text-zinc-100 text-3xl mt-1">Scan & Discover</H1>
                        <Body className="text-zinc-500 mt-2">
                            Uncover what's really in your food
                        </Body>
                    </View>

                    {/* Central Scan Button */}
                    <View style={styles.scanContainer}>
                        <TouchableOpacity
                            onPress={handleScanPress}
                            activeOpacity={0.8}
                            style={styles.scanButton}
                        >
                            <LinearGradient
                                colors={[theme.colors.primary, '#059669']}
                                style={styles.scanButtonGradient}
                            >
                                <Ionicons name="scan" size={48} color="white" />
                                <Body className="text-white font-bold mt-2 text-lg">Scan Barcode</Body>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Caption className="text-zinc-400 mt-6 text-center">
                            Point your camera at any product barcode
                        </Caption>
                    </View>

                    {/* Manual EAN Input */}
                    <View style={styles.inputContainer}>
                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Caption className="text-zinc-400 mx-4">or enter manually</Caption>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter EAN / Barcode (8-13 digits)"
                                placeholderTextColor="#9CA3AF"
                                value={eanInput}
                                onChangeText={setEanInput}
                                keyboardType="number-pad"
                                maxLength={13}
                                returnKeyType="search"
                                onSubmitEditing={handleManualSearch}
                            />
                            <TouchableOpacity
                                onPress={handleManualSearch}
                                style={styles.searchButton}
                                disabled={!eanInput.trim() || !/^\d{8,13}$/.test(eanInput.trim())}
                            >
                                <Ionicons
                                    name="arrow-forward-circle"
                                    size={44}
                                    color={eanInput.trim() && /^\d{8,13}$/.test(eanInput.trim()) ? theme.colors.primary : '#CBD5E1'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 20,
    },
    scanContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 280,
    },
    scanButton: {
        width: 180,
        height: 180,
        borderRadius: 90,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    scanButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        paddingBottom: 120, // Space for floating nav
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingLeft: 16,
        paddingRight: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: '#1F2937',
    },
    searchButton: {
        padding: 4,
    },
});
