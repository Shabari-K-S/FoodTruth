import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { H1, BodyBold } from './Typography';
import { theme } from '../../theme';
import Svg, { Polygon } from 'react-native-svg';

interface ProductBadgeProps {
    grade: string; // a, b, c, d, e
    size?: number;
}

import { useTheme } from '../../providers/ThemeProvider';

export function ProductBadge({ grade, size = 64 }: ProductBadgeProps) {
    const { theme: themeColors, isDark } = useTheme();
    const cleanGrade = grade?.toLowerCase() || '?';
    const isUnknown = ['?', 'unknown', 'undefined', 'null', ''].includes(cleanGrade);

    const getColor = (g: string) => {
        if (['a', 'b'].includes(g)) return theme.colors.primary; // Sage
        if (g === 'c') return '#FACC15'; // Yellow
        if (['d', 'e'].includes(g)) return theme.colors.danger; // Coral
        return theme.colors.muted;
    };

    const color = getColor(cleanGrade);
    const borderColor = isUnknown ? (isDark ? '#52525B' : '#D4D4D8') : 'rgba(255,255,255,0.2)';
    const textColor = isUnknown ? (isDark ? '#71717A' : '#A1A1AA') : 'white';

    // Nutri-Score style: Rounded Rectangle
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View style={[
                StyleSheet.absoluteFill,
                styles.badgeBackground,
                {
                    backgroundColor: isUnknown ? 'transparent' : color,
                    borderColor: borderColor,
                    borderStyle: isUnknown ? 'dashed' : 'solid',
                    borderWidth: isUnknown ? 2 : 2,
                }
            ]} />

            <View style={styles.content}>
                <H1 style={{
                    color: textColor,
                    marginBottom: 0,
                    fontSize: size * 0.6,
                    lineHeight: size * 0.7
                }}>
                    {isUnknown ? '?' : cleanGrade.toUpperCase()}
                </H1>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    badgeBackground: {
        borderRadius: 16, // Squircle look
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
