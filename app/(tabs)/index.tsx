import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Platform,
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Search, FileSliders as Sliders, MapPin, Bookmark, Heart } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { PropertyCard } from '@/components/PropertyCard';
import { CurrentRental } from '@/components/CurrentRental';
import { mockProperties } from '@/utils/mockData';

const categoryData = ['All', 'House', 'Apartment', 'Villa', 'Condo', 'Studio'];

export default function ExploreScreen() {
  const { user, hasAgreement } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  
  useEffect(() => {
    filterProperties();
  }, [searchQuery, selectedCategory]);

  const filterProperties = () => {
    let filtered = [...properties];
    
    if (searchQuery) {
      filtered = filtered.filter(
        property => 
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(property => property.type === selectedCategory);
    }
    
    setFilteredProperties(filtered);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <PropertyCard property={item} onPress={() => router.push(`/property/${item.id}`)} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {hasAgreement ? (
        // Home screen with current rental
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                Welcome back,
              </Text>
              <Text style={[styles.userName, { color: theme.text }]}>
                {user?.name?.split(' ')[0] || 'User'}
              </Text>
            </View>
          </View>

          <CurrentRental />
          
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recommended Properties
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {filteredProperties.length > 0 ? (
            <FlatList
              data={filteredProperties.slice(0, 5)}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.propertyListContainer}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No properties found
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        // Explore screen
        <>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                Hello,
              </Text>
              <Text style={[styles.userName, { color: theme.text }]}>
                {user?.name?.split(' ')[0] || 'User'}
              </Text>
            </View>
          </View>
          
          <View style={styles.searchContainer}>
            <View style={[styles.searchInputContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
              <Search size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search for locations or properties"
                placeholderTextColor={theme.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity 
              style={[styles.filterButton, { backgroundColor: theme.primary }]}
              // onPress={() => router.push('/filters')}
            >
              <Sliders size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoriesContainer}
          >
            {categoryData.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryItem,
                  {
                    backgroundColor: selectedCategory === category ? theme.primary : theme.backgroundTertiary,
                  },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selectedCategory === category ? '#FFFFFF' : theme.textSecondary,
                    },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.resultCount, { color: theme.textSecondary }]}>
            {filteredProperties.length} properties found
          </Text>

          {filteredProperties.length > 0 ? (
            <FlatList
              data={filteredProperties}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.propertyListContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No properties found
              </Text>
            </View>
          )}
        </>
      )}
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
  greeting: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 12,
    height: 50,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  resultCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginVertical: 8,
  },
  propertyListContainer: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  seeAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});