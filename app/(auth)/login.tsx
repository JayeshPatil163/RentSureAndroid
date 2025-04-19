import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Chrome as Home, Building2, Key, MessageCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { theme, isDarkMode } = useTheme();

  function handleLogin() {
    signIn();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={[styles.appName, { color: theme.primary }]}>RentSure</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={[styles.tagline, { color: theme.text }]}>Find your perfect property</Text>
        </Animated.View>
      </View>

      <Animated.View 
        style={styles.featuresContainer} 
        entering={FadeInDown.delay(600).springify()}
      >
        <Feature 
          icon={<Home color={theme.primary} size={24} />}
          title="Find Properties"
          description="Search and filter properties based on your preferences"
          theme={theme}
        />
        <Feature 
          icon={<MessageCircle color={theme.primary} size={24} />}
          title="Connect with Landlords"
          description="Direct messaging with property owners"
          theme={theme}
        />
        <Feature 
          icon={<Key color={theme.primary} size={24} />}
          title="Digital Agreements"
          description="Sign rental agreements digitally within the app"
          theme={theme}
        />
        <Feature 
          icon={<Building2 color={theme.primary} size={24} />}
          title="Manage Rentals"
          description="Track payments and manage your rental property"
          theme={theme}
        />
      </Animated.View>

      <Animated.View 
        style={styles.footer}
        entering={FadeInDown.delay(800).springify()}
      >
        <TouchableOpacity 
          style={[styles.googleButton, { backgroundColor: theme.card, borderColor: theme.border }]} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
            style={styles.googleIcon} 
          />
          <Text style={[styles.googleButtonText, { color: theme.text }]}>Continue with Google</Text>
        </TouchableOpacity>
        <Text style={[styles.terms, { color: theme.textSecondary }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const Feature = ({ 
  icon, 
  title, 
  description, 
  theme 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  theme: any 
}) => (
  <View style={styles.featureItem}>
    <View style={[styles.iconContainer, { backgroundColor: theme.backgroundTertiary }]}>
      {icon}
    </View>
    <View style={styles.featureTextContainer}>
      <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 60,
    alignItems: 'center',
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 40,
    marginBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  terms: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});