import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { User, Bell, CreditCard, CircleHelp as HelpCircle, FileText, Lock, LogOut, ChevronRight, Moon, HeartHandshake } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // Default user data if not available
  const defaultUser = {
    name: 'User',
    email: 'user@example.com',
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  const menuItems = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      onPress: () => router.push('/notifications'),
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      icon: CreditCard,
      onPress: () => router.push('/payment-methods'),
    },
    {
      id: 'preferences',
      title: 'Rental Preferences',
      icon: HeartHandshake,
      onPress: () => router.push('/preferences'),
    },
    {
      id: 'documents',
      title: 'My Documents',
      icon: FileText,
      onPress: () => router.push('/documents'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Lock,
      onPress: () => router.push('/privacy'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      onPress: () => router.push('/help'),
    },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeIn}>
          <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
            <Image 
              source={{ uri: user?.photoUrl || defaultUser.photoUrl }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: theme.text }]}>
                {user?.name || defaultUser.name}
              </Text>
              <Text style={[styles.email, { color: theme.textSecondary }]}>
                {user?.email || defaultUser.email}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: theme.backgroundTertiary }]}
              onPress={() => router.push('/edit-profile')}
            >
              <Text style={[styles.editButtonText, { color: theme.text }]}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.settingsSection, { backgroundColor: theme.card }]}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity 
                  key={item.id}
                  style={[
                    styles.menuItem, 
                    { borderBottomColor: index === menuItems.length - 1 ? 'transparent' : theme.border }
                  ]} 
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.backgroundTertiary }]}>
                      <Icon size={20} color={theme.primary} />
                    </View>
                    <Text style={[styles.menuItemText, { color: theme.text }]}>{item.title}</Text>
                  </View>
                  <ChevronRight size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              );
            })}
          </View>
          
          <View style={[styles.settingsSection, { backgroundColor: theme.card }]}>
            <View style={styles.themeToggleItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.backgroundTertiary }]}>
                  <Moon size={20} color={theme.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: theme.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: theme.primaryLight }}
                thumbColor={isDarkMode ? theme.primary : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.signOutButton, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]} 
            onPress={handleSignOut}
          >
            <LogOut size={20} color={theme.error} />
            <Text style={[styles.signOutText, { color: theme.error }]}>Sign Out</Text>
          </TouchableOpacity>
          
          <Text style={[styles.versionText, { color: theme.textTertiary }]}>
            Version 1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 120,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 2,
  },
  email: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  settingsSection: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  themeToggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  signOutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 12,
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});