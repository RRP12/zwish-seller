import { SplashScreen } from 'expo-router'; // Added SplashScreen
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import apiClient, { setupApiClientInterceptors } from './apiClient';

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from auto-hiding

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isAuthLoading: boolean; // Added isAuthLoading
  logIn: (accessToken: string, refreshToken: string) => void;
  logOut: () => void;
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Added isAuthLoading state

  const logIn = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsLoggedIn(true);
    SecureStore.setItemAsync('accessToken', newAccessToken);
    SecureStore.setItemAsync('refreshToken', newRefreshToken);
  };

  const logOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
    SecureStore.deleteItemAsync('accessToken');
    SecureStore.deleteItemAsync('refreshToken');
  };

  const refreshTokens = async () => {
    const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
    if (storedRefreshToken) {
      try {
        const response = await apiClient.post('/refresh', { refreshToken: storedRefreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        logIn(newAccessToken, newRefreshToken);
      } catch (error) {
        logOut();
      }
    }
  };

  // Setup API client interceptors
  useEffect(() => {
    setupApiClientInterceptors(
      () => accessToken,
      refreshTokens,
      logOut
    );
  }, [accessToken, refreshTokens, logOut]);

  // Enhanced initialization effect with better debugging
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state from SecureStore...');
        const storedAccessToken = await SecureStore.getItemAsync('accessToken');
        const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
        
        console.log('Retrieved tokens:', { 
          hasAccessToken: !!storedAccessToken, 
          hasRefreshToken: !!storedRefreshToken 
        });
        
        if (storedAccessToken && storedRefreshToken) {
          console.log('Found valid tokens in storage, restoring session');
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setIsLoggedIn(true);
        } else {
          console.log('No valid tokens found in storage');
        }
      } catch (error) {
        console.error('Error initializing auth from storage:', error);
      } finally {
        setIsAuthLoading(false); // Set loading to false after attempt
      }
    };
    
    initializeAuth();
  }, []);

  // Hide SplashScreen when auth is no longer loading
  useEffect(() => {
    if (!isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [isAuthLoading]);

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, isLoggedIn, isAuthLoading, logIn, logOut, refreshTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
