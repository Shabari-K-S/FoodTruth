import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, useSegments } from 'expo-router'
import * as SecureStore from 'expo-secure-store'

// Define a basic User type for now
interface User {
    id: string;
    name?: string;
    email?: string;
    token?: string;
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    signIn: (token: string, userData: User) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const segments = useSegments()
    const router = useRouter()

    // Check authentication on mount
    useEffect(() => {
        checkAuth()
    }, [])

    // Optional: Protect routes logic can be added here
    // For now, we just restore session

    async function checkAuth() {
        try {
            const token = await SecureStore.getItemAsync('authToken')
            const userDataString = await SecureStore.getItemAsync('userData')

            if (token && userDataString) {
                setUser(JSON.parse(userDataString))
            }
        } catch (error) {
            console.error("Auth restoration failed", error);
        } finally {
            setIsLoading(false)
        }
    }

    async function signIn(token: string, userData: User) {
        await SecureStore.setItemAsync('authToken', token)
        await SecureStore.setItemAsync('userData', JSON.stringify(userData))
        setUser(userData)
        // router.replace('/(tabs)') // Optional: Navigate after sign in
    }

    async function signOut() {
        await SecureStore.deleteItemAsync('authToken')
        await SecureStore.deleteItemAsync('userData')
        setUser(null)
        // router.replace('/(auth)/login') // Optional: Navigate after sign out
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
