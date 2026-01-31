import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { H2, Body, Caption } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

export default function ScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const isFocused = useIsFocused();
    const router = useRouter();

    useEffect(() => {
        if (isFocused) {
            setScanned(false);
        }
    }, [isFocused]);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;
        setScanned(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push({
            pathname: '/product/[barcode]',
            params: { barcode: data }
        });
    };

    if (!permission) return <View className="flex-1 bg-black" />;

    if (!permission.granted) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-canvas p-8">
                <Ionicons name="camera-outline" size={80} color={theme.colors.muted} />
                <H2 className="text-center mt-6">Camera Access Required</H2>
                <Body className="text-center mb-8 px-4">
                    We need camera access to scan barcodes and reveal product insights.
                </Body>
                <Button onPress={requestPermission} title="Grant Permission" variant="primary" />
            </SafeAreaView>
        );
    }

    if (!isFocused) return <View className="flex-1 bg-black" />;

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["ean13", "ean8", "upc_e", "upc_a", "qr"],
                }}
            >
                <SafeAreaView className="flex-1 justify-between p-6">
                    {/* Header */}
                    <View className="flex-row justify-between items-start">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-black/40 items-center justify-center border border-white/10"
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <View className="bg-black/40 px-4 py-2 rounded-full border border-white/10">
                            <Caption className="text-white font-body-bold">Scan Barcode</Caption>
                        </View>
                        <View className="w-10" />
                    </View>

                    {/* Center Frame */}
                    <View className="items-center justify-center flex-1">
                        <View style={styles.scanFrame}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                            <View className="absolute inset-0 items-center justify-center">
                                <Ionicons name="scan-outline" size={64} color="rgba(255,255,255,0.2)" />
                            </View>
                        </View>
                    </View>

                    {/* Footer Warning/Tip */}
                    <Card variant="glass" className="mb-20 self-center w-full max-w-sm" intensity={40}>
                        <Body className="text-white text-center text-sm">
                            Point your camera at a food barcode to verify its ingredients automatically.
                        </Body>
                    </Card>
                </SafeAreaView>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scanFrame: {
        width: 250,
        height: 250,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderColor: theme.colors.primary,
        borderWidth: 4,
        borderRadius: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 16,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 16,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 16,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 16,
    },
});
