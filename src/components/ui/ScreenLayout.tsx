import React from 'react';
import { View, ScrollView, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../providers/ThemeProvider';

interface ScreenLayoutProps extends ViewProps {
    children: React.ReactNode;
    loading?: boolean;
    header?: React.ReactNode;
    scrollable?: boolean;
    edges?: ('top' | 'right' | 'bottom' | 'left')[];
    padding?: 'none' | 'standard'; // Simplified padding options
    className?: string; // Add className support
}

export function ScreenLayout({
    children,
    header,
    scrollable = true,
    edges = ['top'],
    padding = 'standard',
    className = '',
    ...props
}: ScreenLayoutProps) {
    const { theme, isDark } = useTheme();
    const ContentWrapper = scrollable ? ScrollView : View;
    const paddingClass = padding === 'standard' ? 'px-4' : ''; // Standard 16px padding

    return (
        <View className="flex-1" style={{ backgroundColor: theme.colors.canvas }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <SafeAreaView edges={edges} className="flex-1">
                {header}
                <ContentWrapper
                    className={`flex-1 ${className}`}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={scrollable ? { paddingBottom: 120 } : undefined}
                >
                    <View className={paddingClass}>
                        {children}
                    </View>
                </ContentWrapper>
            </SafeAreaView>
        </View>
    );
}

