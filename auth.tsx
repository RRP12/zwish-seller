// auth.tsx (Context setup with token handling)

import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router, useSegments } from 'expo-router';
import API from './lib/jwt-auth'; // Adjusted path to where jwt-auth.js was created

interface User {
  // Define user properties based on what API.get('/auth/v1/me') returns
  // Example: id: string; email: string; name: string;
  [key: string]: any; // Replace with actual user properties
}

interface AuthContextType {
  user: User | null;
  signIn: (email?: string, password?: string) => Promise<void>; // Made params optional for flexibility if needed later
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (accessToken) {
          // Assuming API instance is already configured with interceptors
          const { data } = await API.get('/auth/v1/me');
          setUser(data);
        }
      } catch (err) {
        console.warn('Auth init failed:', err);
        // Clear tokens if profile fetch fails or token is invalid
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        setUser(null); // Ensure user state is cleared
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (loading) return; // Don't run navigation logic if still loading

    const inAuthGroup = segments[0] === '(auth)'; // Assuming (auth) is a route group for auth screens like login

    if (!user && !inAuthGroup) {
      router.replace('/sign-in'); // Ensure '/sign-in' is the correct route for login
    } else if (user && inAuthGroup) {
      router.replace('/'); // Redirect to home or main app screen after login
    }
  }, [segments, user, loading]);

  const signIn = async (email?: string, password?: string) => {
    try {
      // Ensure email and password are provided if your API requires them
      if (!email || !password) {
        throw new Error("Email and password are required for sign in.");
      }
      const { data } = await API.post('/auth/v1/login', { email, password });
      await SecureStore.setItemAsync('accessToken', data.access_token);
      await SecureStore.setItemAsync('refreshToken', data.refresh_token);
      
      // Fetch user profile after successful login
      const userRes = await API.get('/auth/v1/me');
      setUser(userRes.data);
      // Navigation to '/' should be handled by the useEffect above
    } catch (err) {
      console.error('Login failed:', err);
      // Potentially clear tokens here too, or let user retry
      throw err; // Re-throw to allow UI to handle it
    }
  };

  const signOut = async () => {
    try {
      // Optional: Call logout endpoint. Best effort.
      await API.post('/auth/v1/logout');
    } catch (err) {
      console.warn('Logout API failed (might be expected if token already invalid):', err);
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      setUser(null);
      // Navigation to login screen is handled by the useEffect above
      // For explicit redirect on signout:
      router.replace('/sign-in'); // Ensure '/sign-in' is the correct route
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
