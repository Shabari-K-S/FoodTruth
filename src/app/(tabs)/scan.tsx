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

    if (!permission) return <View style={styles.blackBg} />;

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.permissionContainer}>
                <Ionicons name="camera-outline" size={80} color={theme.colors.muted} />
                <H2 style={styles.permissionTitle}>Camera Access Required</H2>
                <Body style={styles.permissionText}>
                    We need camera access to scan barcodes and reveal product insights.
                </Body>
                <Button onPress={requestPermission} title="Grant Permission" variant="primary" />
            </SafeAreaView>
        );
    }

    if (!isFocused) return <View style={styles.blackBg} />;

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["ean13", "ean8", "upc_e", "upc_a", "qr"],
                }}
            >
                <SafeAreaView style={styles.overlay}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={styles.headerBadge}>
                            <Caption style={styles.headerText}>Scan Barcode</Caption>
                        </View>
                        <View style={styles.spacer} />
                    </View>

                    {/* Center Frame */}
                    <View style={styles.centerContainer}>
                        <View style={styles.scanFrame}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                            <View style={styles.scanIconContainer}>
                                <Ionicons name="scan-outline" size={64} color="rgba(255,255,255,0.2)" />
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <Card variant="glass" intensity={40} style={styles.footerCard}>
                        <Body style={styles.footerText}>
                            Point your camera at a food barcode to verify its ingredients automatically.
                        </Body>
                    </Card>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    blackBg: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 32,
    },
    permissionTitle: {
        textAlign: 'center',
        marginTop: 24,
    },
    permissionText: {
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerBadge: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    spacer: {
        width: 40,
    },
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    scanFrame: {
        width: 250,
        height: 250,
        position: 'relative',
    },
    scanIconContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
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
    footerCard: {
        marginBottom: 80,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 320,
    },
    footerText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 14,
    },
});
