import { Stack } from 'expo-router';
import { ThemeProvider } from '../providers/ThemeProvider';
import { QueryProvider } from '../providers/QueryProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { HistoryProvider } from '../providers/HistoryProvider';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Lexend_400Regular, Lexend_700Bold } from '@expo-google-fonts/lexend';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Outfit_700Bold,
        Lexend_400Regular,
        Lexend_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <QueryProvider>
            <AuthProvider>
                <HistoryProvider>
                    <ThemeProvider>
                        <StatusBar style="auto" />
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        </Stack>
                    </ThemeProvider>
                </HistoryProvider>
            </AuthProvider>
        </QueryProvider>
    )
}
