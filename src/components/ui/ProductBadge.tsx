import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { H1, BodyBold } from './Typography';
import { theme } from '../../theme';
import Svg, { Polygon } from 'react-native-svg';

interface ProductBadgeProps {
    grade: string; // a, b, c, d, e
    size?: number;
}

export function ProductBadge({ grade, size = 64 }: ProductBadgeProps) {
    const cleanGrade = grade?.toLowerCase() || '?';

    const getColor = (g: string) => {
        if (['a', 'b'].includes(g)) return theme.colors.primary; // Sage
        if (g === 'c') return '#FACC15'; // Yellow
        if (['d', 'e'].includes(g)) return theme.colors.danger; // Coral
        return theme.colors.muted;
    };

    const color = getColor(cleanGrade);

    // Hexagon points calculation
    // A regular hexagon's points can be calculated or hardcoded for a unit size and scaled.
    // For simplicity in React Native SVG, we'll use a standard path.
    // 0,25 50,0 100,25 100,75 50,100 0,75

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View style={StyleSheet.absoluteFill}>
                <Svg height="100%" width="100%" viewBox="0 0 100 100">
                    <Polygon
                        points="50,0 95,25 95,75 50,100 5,75 5,25"
                        fill={color}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                    />
                </Svg>
            </View>

            {/* Inner Glow / Shadow effect via opacity layers if needed, or just text */}
            <View style={styles.content}>
                <H1 style={{ color: 'white', marginBottom: 0, fontSize: size * 0.5 }}>
                    {cleanGrade.toUpperCase()}
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
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
