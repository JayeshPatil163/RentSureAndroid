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
import axios from 'axios';

const categoryData = ['All', 'House', 'Apartment', 'Villa', 'Condo', 'Studio'];
const images = ['https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', 'https://images.pexels.com/photos/1082355/pexels-photo-1082355.jpeg'];

// Function to map backend property data to the format expected by PropertyCard
const mapPropertyData = (backendProperty, index) => {
  // Map property data from backend to frontend format
  return {
    id: backendProperty._id || backendProperty.propertyHash || index,
    title: backendProperty.propertysummary || `Property ${index + 1}`,
    location: backendProperty.location || 'Unknown location',
    price: backendProperty.rentAmountInFiat || 1500,
    type: getPropertyType(backendProperty),
    beds: getBedsCount(backendProperty),
    baths: getBathsCount(backendProperty),
    area: getPropertyArea(backendProperty),
    imageUrl: images[index % images.length],
    isFavorite: false,
    // Track if user is interested in this property
    isInterested: backendProperty.interestedUsers && 
                  Array.isArray(backendProperty.interestedUsers) && 
                  backendProperty.interestedUsers.includes("user123"),
    // Keep original data for reference if needed
    originalData: backendProperty
  };
};

// Helper functions to extract property details
const getPropertyType = (property) => {
  // Try to determine property type from description or summary
  const summary = (property.propertysummary || property.Description || '').toLowerCase();
  
  if (summary.includes('house')) return 'House';
  if (summary.includes('apartment')) return 'Apartment';
  if (summary.includes('villa')) return 'Villa';
  if (summary.includes('condo')) return 'Condo';
  if (summary.includes('studio')) return 'Studio';
  
  // Default to Apartment if we can't determine
  return 'Apartment';
};

const getBedsCount = (property) => {
  // Try to extract from description or amenities
  const description = (property.Description || '').toLowerCase();
  const match = description.match(/(\d+)\s*bed/);
  
  if (match) return parseInt(match[1]);
  
  // Default value
  return 2;
};

const getBathsCount = (property) => {
  // Try to extract from description
  const description = (property.Description || '').toLowerCase();
  const match = description.match(/(\d+)\s*bath/);
  
  if (match) return parseInt(match[1]);
  
  // Default value
  return 1;
};

const getPropertyArea = (property) => {
  // Try to extract from description
  const description = (property.Description || '').toLowerCase();
  const match = description.match(/(\d+)\s*sq\s*ft/);
  
  if (match) return parseInt(match[1]);
  
  // Default value
  return 1000;
};

export default function ExploreScreen() {
  const { user, hasAgreement } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'interested'
  
  // Fetch properties from API on component mount
  useEffect(() => {
    fetchProperties();
  }, []);
  
  // Filter properties when search query, category, or tab changes
  useEffect(() => {
    filterProperties();
  }, [searchQuery, selectedCategory, properties, activeTab]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://192.168.137.55:5050/api/properties');
      //console.log("Fetched properties:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Map backend data to the format expected by PropertyCard
        const mappedProperties = response.data.map(mapPropertyData);
        setProperties(mappedProperties);
      } else {
        // Fallback to mock data if response is not as expected
        console.log("Invalid response format, using mock data");
        setProperties(mockProperties);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties");
      // Fallback to mock data on error
      setProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];
    
    // First filter by user interest based on active tab
    if (activeTab === 'interested') {
      filtered = filtered.filter(property => property.isInterested);
    } else if (activeTab === 'explore') {
      // The explore tab includes all properties, but we could also choose to exclude interested ones
      // For now, showing all in explore tab
      filtered = filtered.filter(property => !property.isInterested);
    }
    
    // Then apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        property => 
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Then apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(property => property.type === selectedCategory);
    }
    
    setFilteredProperties(filtered);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refresh data from API
    fetchProperties()
      .finally(() => {
        setRefreshing(false);
      });
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

          {loading ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Loading properties...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {error}
              </Text>
            </View>
          ) : filteredProperties.length > 0 ? (
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

          {/* Tab buttons for Explore and Interested */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'explore' && { borderBottomWidth: 2, borderBottomColor: theme.primary }
              ]}
              onPress={() => setActiveTab('explore')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'explore' ? theme.primary : theme.textSecondary }
                ]}
              >
                Explore
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'interested' && { borderBottomWidth: 2, borderBottomColor: theme.primary }
              ]}
              onPress={() => setActiveTab('interested')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'interested' ? theme.primary : theme.textSecondary }
                ]}
              >
                Interested
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category filters */}
          <View style={styles.categoriesContainer}>
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
                    marginRight: 8,
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
          </View>

          <Text style={[styles.resultCount, { color: theme.textSecondary }]}>
            {filteredProperties.length} properties found
          </Text>

          {loading ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Loading properties...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {error}
              </Text>
            </View>
          ) : filteredProperties.length > 0 ? (
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
                {activeTab === 'interested' ? 'No interested properties found' : 'No properties found'}
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
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  categoriesContainer: {
    // paddingVertical: 8,
  },
  categoryItem: {
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
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