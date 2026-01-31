import { Tabs } from 'expo-router';
import React from 'react';
import { FloatingNavBar } from '../../components/ui/FloatingNavBar';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={() => <FloatingNavBar />}
            screenOptions={{
                headerShown: false,
                // Hide default tab bar mechanisms since we use floating bar
            }}
        >
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
            <Tabs.Screen name="scan" options={{
                title: 'Scan',
                href: null, // Hide from tab bar loop since it's a modal/action usually, but here we can keep it accessible via nav
            }} />
            <Tabs.Screen name="history" options={{ title: 'History' }} />
            <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
        </Tabs>
    );
}
