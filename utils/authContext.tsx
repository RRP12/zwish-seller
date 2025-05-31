import { SplashScreen } from 'expo-router'; // Added SplashScreen
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import apiClient, { setupApiClientInterceptors } from './apiClient';

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from auto-hiding

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  isNewUser: boolean;
  shopId: string | null; // Added shopId
  sellerId: string | null; // Added sellerId
  logIn: (accessToken: string, refreshToken: string, isNew: boolean) => void;
  logOut: () => void;
  setShopId: (shopId: string | null) => void; // Added setShopId
  setSellerId: (sellerId: string | null) => void; // Added setSellerId
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [shopId, setShopIdState] = useState<string | null>(null); // Added shopId state
  const [sellerId, setSellerIdState] = useState<string | null>(null); // Added sellerId state

  const logIn = (newAccessToken: string, newRefreshToken: string, isNew: boolean) => {
    console.log('AuthContext: logIn called', { hasNewAccessToken: !!newAccessToken, hasNewRefreshToken: !!newRefreshToken, isNew });
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsLoggedIn(true);
    setIsNewUser(isNew); // Set isNewUser state
    SecureStore.setItemAsync('accessToken', newAccessToken);
    SecureStore.setItemAsync('refreshToken', newRefreshToken);
    console.log('AuthContext: Attempting to store tokens', { accessTokenLength: newAccessToken?.length, refreshTokenLength: newRefreshToken?.length });
    console.log('AuthContext: DEBUG_ACCESS_TOKEN_VALUE:', newAccessToken); // WARNING: SECURITY RISK - REMOVE AFTER DEBUGGING
    SecureStore.setItemAsync('isNewUser', JSON.stringify(isNew)); // Store isNewUser
    // shopId will be set during onboarding for new users or loaded for existing users
  };

  const logOut = () => {
    console.log('AuthContext: logOut called');
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
    SecureStore.deleteItemAsync('accessToken');
    SecureStore.deleteItemAsync('refreshToken');
    SecureStore.deleteItemAsync('isNewUser'); // Clear isNewUser on logout
    SecureStore.deleteItemAsync('shopId'); // Clear shopId on logout
    SecureStore.deleteItemAsync('sellerId'); // Clear sellerId on logout
    setIsNewUser(false); // Reset in-memory state for isNewUser
    setShopIdState(null); // Reset in-memory state for shopId
    setSellerIdState(null); // Reset in-memory state for sellerId
  };

  const refreshTokens = async () => {
    console.log('Attempting to refresh tokens...'); // Added log
    const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
    if (storedRefreshToken) {
      try {
        const response = await apiClient.post('/api/auth/v1/refresh', { refresh_token: storedRefreshToken });
        const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;
        console.log('Tokens refreshed successfully.'); // Added log
        logIn(newAccessToken, newRefreshToken, false); // User is not new when refreshing tokens
      } catch (error) {
        console.error('Token refresh failed:', error); // Added log
        logOut();
      }
    } else {
      console.log('No refresh token found in storage, cannot refresh.');
    }
  };

  const setShopId = (id: string | null) => {
    setShopIdState(id);
    if (id) {
      SecureStore.setItemAsync('shopId', id);
      console.log('Shop ID set and stored:', id);
    } else {
      SecureStore.deleteItemAsync('shopId');
      console.log('Shop ID cleared');
    }
  };

  const setSellerId = (id: string | null) => {
    setSellerIdState(id);
    if (id) {
      SecureStore.setItemAsync('sellerId', id);
      console.log('Seller ID set and stored:', id);
    } else {
      SecureStore.deleteItemAsync('sellerId');
      console.log('Seller ID cleared');
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
          // Load isNewUser status
          const storedIsNewUser = await SecureStore.getItemAsync('isNewUser');
          if (storedIsNewUser) {
            const isNew = JSON.parse(storedIsNewUser);
            setIsNewUser(isNew);
            console.log('Loaded isNewUser status from storage:', isNew);
          } else {
            console.log('isNewUser status not found in storage.');
          }
          // Load shopId status
          const storedShopId = await SecureStore.getItemAsync('shopId');
          if (storedShopId) {
            setShopIdState(storedShopId);
            console.log('Loaded shopId from storage:', storedShopId);
          } else {
            console.log('shopId not found in storage.');
          }
          // Load sellerId status
          const storedSellerId = await SecureStore.getItemAsync('sellerId');
          if (storedSellerId) {
            setSellerIdState(storedSellerId);
            console.log('Loaded sellerId from storage:', storedSellerId);
          } else {
            console.log('sellerId not found in storage.');
          }
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
    <AuthContext.Provider value={{ 
      accessToken, 
      refreshToken, 
      isLoggedIn, 
      isAuthLoading, 
      isNewUser, 
      shopId, // Added shopId
      sellerId, // Added sellerId
      logIn, 
      logOut, 
      setShopId, // Added setShopId
      setSellerId, // Added setSellerId
      refreshTokens
    }}>
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
