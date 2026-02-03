import React from 'react';
import { View, ScrollView, ViewProps, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../providers/ThemeProvider';

interface ScreenLayoutProps extends ViewProps {
    children: React.ReactNode;
    loading?: boolean;
    header?: React.ReactNode;
    scrollable?: boolean;
    edges?: ('top' | 'right' | 'bottom' | 'left')[];
    padding?: 'none' | 'standard';
}

export function ScreenLayout({
    children,
    header,
    scrollable = true,
    edges = ['top'],
    padding = 'standard',
    style,
    ...props
}: ScreenLayoutProps) {
    const { theme, isDark } = useTheme();
    const ContentWrapper = scrollable ? ScrollView : View;
    const paddingHorizontal = padding === 'standard' ? 16 : 0;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.canvas }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <SafeAreaView edges={edges} style={styles.container}>
                {header}
                <ContentWrapper
                    style={[styles.container, style]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={scrollable ? { paddingBottom: 120 } : undefined}
                    {...props}
                >
                    <View style={{ paddingHorizontal }}>
                        {children}
                    </View>
                </ContentWrapper>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
