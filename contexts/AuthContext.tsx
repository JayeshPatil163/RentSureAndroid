import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Replace with your own values
const EXPO_CLIENT_ID = 'YOUR_EXPO_CLIENT_ID';
const ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID';
const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID';

type User = {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  hasAgreement: boolean;
  setHasAgreement: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAgreement, setHasAgreement] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "343013871993-mlemo00ni1utl1aib7kmrc53am1pu461.apps.googleusercontent.com",
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    // Use redirect URI for web platforms to avoid popup blocking
    ...(Platform.OS === 'web' ? { 
      responseType: 'id_token',
      redirectUri: window.location.origin + '/_expo/google-callback'
    } : {})
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedAgreement = await AsyncStorage.getItem('hasAgreement');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        if (storedAgreement === 'true') {
          setHasAgreement(true);
        }
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const getUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
      
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        photoUrl: userData.picture,
      };
      
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const signIn = async () => {
    try {
      // Make sure the Google authentication prompt is directly tied to a user interaction
      if (!request) {
        console.log('Authentication request was not prepared');
        return;
      }
      
      // For web platforms, ensure that the promptAsync call happens immediately in response to user action
      await promptAsync();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('hasAgreement');
      setHasAgreement(false);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, hasAgreement, setHasAgreement }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}