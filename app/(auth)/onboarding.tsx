import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Check, MapPin, Search, FileText, CreditCard } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Find Properties',
    description: 'Search for properties based on your location, budget, and preferences.',
    icon: Search,
  },
  {
    id: '2',
    title: 'Explore Neighborhoods',
    description: 'Discover the perfect neighborhood with detailed information about amenities and safety.',
    icon: MapPin,
  },
  {
    id: '3',
    title: 'Sign Agreements',
    description: 'Complete the rental process with digital agreements and secure signatures.',
    icon: FileText,
  },
  {
    id: '4',
    title: 'Manage Payments',
    description: 'Pay rent and track payment history easily through multiple payment methods.',
    icon: CreditCard,
  },
];

export default function OnboardingScreen() {
  const { theme, isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item, index }: { item: typeof onboardingData[0], index: number }) => {
    const Icon = item.icon;
    
    return (
      <Animated.View 
        style={[styles.slide, { width }]}
        entering={FadeIn.delay(index * 100)}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight + '20' }]}>
          <Icon size={32} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
      </Animated.View>
    );
  };

  const goToNextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { 
                  backgroundColor: index === currentIndex ? theme.primary : theme.border,
                  width: index === currentIndex ? 24 : 8,
                }
              ]}
            />
          ))}
        </View>

        <Animated.View entering={FadeInRight.delay(500).springify()}>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: theme.primary }]}
            onPress={goToNextSlide}
          >
            {currentIndex === onboardingData.length - 1 ? (
              <Check size={24} color="#fff" />
            ) : (
              <ArrowRight size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 40,
    paddingTop: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
});