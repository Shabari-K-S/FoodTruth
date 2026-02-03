import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingNavBar } from '../../components/ui/FloatingNavBar';
import { H1, H2, Body, Caption } from '../../components/ui/Typography';
import { useTheme } from '../../providers/ThemeProvider';

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme, isDark } = useTheme();

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

    const isValidEan = eanInput.trim() && /^\d{8,13}$/.test(eanInput.trim());

    // Dynamic colors based on theme
    const colors = {
        bg: theme.colors.canvas,
        textPrimary: theme.colors.foreground,
        textSecondary: theme.colors.muted,
        textMuted: isDark ? '#71717A' : '#A1A1AA', // Keep variations if needed or map to theme
        border: theme.colors.border,
        inputBg: theme.colors.surface,
        placeholder: isDark ? '#52525B' : '#A1A1AA',
        divider: theme.colors.border,
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.bg }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                {/* Background Gradient - Adjusted for dark mode */}
                <LinearGradient
                    colors={isDark
                        ? ['#0D948830', '#05966920', '#DC262620']
                        : ['#0D948820', '#F59E0B10', '#EF444410']
                    }
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
                        <Caption style={[styles.brandLabel, { color: colors.textSecondary }]}>
                            FoodTruth
                        </Caption>
                        <H1 style={[styles.title, { color: colors.textPrimary }]}>
                            Scan & Discover
                        </H1>
                        <Body style={[styles.subtitle, { color: colors.textSecondary }]}>
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
                                <Body style={styles.scanButtonText}>Scan Barcode</Body>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Caption style={[styles.hint, { color: colors.textSecondary }]}>
                            Point your camera at any product barcode
                        </Caption>
                    </View>

                    {/* Manual EAN Input */}
                    <View style={styles.inputContainer}>
                        <View style={styles.dividerRow}>
                            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
                            <Caption style={[styles.dividerText, { color: colors.textSecondary }]}>
                                or enter manually
                            </Caption>
                            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
                        </View>

                        <View style={[
                            styles.inputRow,
                            {
                                backgroundColor: colors.inputBg,
                                borderColor: colors.border,
                                shadowColor: '#000',
                                shadowOpacity: isDark ? 0.3 : 0.05,
                            }
                        ]}>
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="Enter EAN / Barcode (8-13 digits)"
                                placeholderTextColor={colors.placeholder}
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
                                disabled={!isValidEan}
                            >
                                <Ionicons
                                    name="arrow-forward-circle"
                                    size={44}
                                    color={isValidEan ? theme.colors.primary : isDark ? '#3F3F46' : '#D4D4D8'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <FloatingNavBar />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 20,
    },
    brandLabel: {
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 4,
    },
    subtitle: {
        marginTop: 8,
        fontSize: 16,
        lineHeight: 24,
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
        shadowColor: '#10B981',
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
    scanButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 8,
        fontSize: 18,
    },
    hint: {
        marginTop: 24,
        textAlign: 'center',
        fontSize: 14,
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
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingLeft: 16,
        paddingRight: 4,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
    },
    searchButton: {
        padding: 4,
    },
});