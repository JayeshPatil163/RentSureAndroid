
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Check, 
  MessageCircle,
  ThumbsUp
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { mockProperties } from '@/utils/mockData';
import axios from 'axios';

const { width } = Dimensions.get('window');

// Helper functions to extract or determine property details
const getPropertyType = (property) => {
  // Try to determine property type from description or summary
  const summary = (property.propertysummary || property.Description || '').toLowerCase();
  
  if (summary.includes('house')) return 'House';
  if (summary.includes('warehouse')) return 'Warehouse';
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
const images = ['https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', 'https://images.pexels.com/photos/1082355/pexels-photo-1082355.jpeg'];

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

export default function PropertyDetailScreen() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [interestActionInProgress, setInterestActionInProgress] = useState(false);
  
  // Current user ID (in a real app, this would come from authentication)
  const currentUserId = "user123"; // Example user ID
  
  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);
 let inc = 0;
  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to fetch from API
      try {
        const response = await axios.get(`http://192.168.137.55:5050/api/properties/${id}`);
        console.log("Fetched property details:", response.data);
        
        if (response.data) {
          // Map the backend property data to the format needed for UI
          const backendProperty = response.data;
          const mappedProperty = {
            id: backendProperty._id || backendProperty.propertyHash || id,
            title: backendProperty.propertysummary || `Property ${id}`,
            location: backendProperty.location || 'Unknown location',
            price: backendProperty.rentAmountInFiat || 1500,
            type: getPropertyType(backendProperty),
            beds: getBedsCount(backendProperty),
            baths: getBathsCount(backendProperty),
            area: getPropertyArea(backendProperty),
            imageUrl: images[Math.floor(Math.random() * images.length)],
            description: backendProperty.Description || '',
            amenities: backendProperty.Amenities || defaultAmenities,
            landlord: backendProperty.landlord || 'Property Owner',
            interestedUsers: backendProperty.interestedUsers || [],
            originalData: backendProperty
          };
          setProperty(mappedProperty);
          
          // Check if current user is in the interested users array
          setIsInterested(mappedProperty.interestedUsers.includes(currentUserId));
          return;
        }
      } catch (apiError) {
        console.error("API fetch error:", apiError);
        // Continue to fallback if API fails
      }

      // Fallback to mock data if API fetch fails or returns invalid data
      const mockProperty = mockProperties.find(p => p.id === Number(id));
      if (mockProperty) {
        // Add interestedUsers field to mock data if it doesn't exist
        if (!mockProperty.interestedUsers) {
          mockProperty.interestedUsers = [];
        }
        setProperty(mockProperty);
        setIsInterested(mockProperty.interestedUsers.includes(currentUserId));
      } else {
        setError("Property not found");
      }
    } catch (err) {
      console.error("Error in property details:", err);
      setError("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareProperty = () => {
    // Implement share functionality
    console.log('Share property');
  };

  const handleContactLandlord = () => {
    router.push('/chat/new');
  };

  const handleShowInterest = async () => {
    try {
      setInterestActionInProgress(true);
      
      // Create a copy of the current interested users array
      const updatedInterestedUsers = [...(property.interestedUsers || [])];
      
      // Add current user to the interested users array if not already present
      if (!updatedInterestedUsers.includes(currentUserId)) {
        updatedInterestedUsers.push(currentUserId);
      }
      
      // Send PUT request to update interestedUsers array
      const response = await axios.put(`http://192.168.137.55:5050/api/properties/${id}`, {
        interestedUsers: updatedInterestedUsers
      });

      console.log("This is current property id: " + id);
      
      if (response.data) {
        console.log("Interest shown successfully:", response.data);
        setIsInterested(true);
        setProperty(prev => ({
          ...prev,
          interestedUsers: updatedInterestedUsers
        }));
        
        // Show success message
        Alert.alert(
          "Interest Shown",
          "You have successfully shown interest in this property. The landlord will be notified.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error showing interest:", error);
      Alert.alert(
        "Action Failed",
        "There was an error processing your request. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setInterestActionInProgress(false);
    }
  };

  const handleRemoveInterest = async () => {
    try {
      setInterestActionInProgress(true);
      
      // Create a copy of the current interested users array and remove current user
      const updatedInterestedUsers = (property.interestedUsers || []).filter(
        userId => userId !== currentUserId
      );
      
      // Send PUT request to update interestedUsers array
      const response = await axios.put(`http://192.168.137.55:5050/api/properties/${id}`, {
        interestedUsers: updatedInterestedUsers
      });
      
      if (response.data) {
        console.log("Interest removed successfully:", response.data);
        setIsInterested(false);
        setProperty(prev => ({
          ...prev,
          interestedUsers: updatedInterestedUsers
        }));
        
        // Show success message
        Alert.alert(
          "Interest Removed",
          "You are no longer interested in this property.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error removing interest:", error);
      Alert.alert(
        "Action Failed",
        "There was an error processing your request. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setInterestActionInProgress(false);
    }
  };
  
  // Default amenities if not provided by backend
  const defaultAmenities = [
    'Air Conditioning',
    'Heating',
    'Washer/Dryer',
    'Wi-Fi',
    'Parking',
    'Elevator',
    'Gym',
    'Swimming Pool',
    'Pet Friendly',
    'Balcony'
  ];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading property details...</Text>
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{error || "Property not found"}</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.primary }]} 
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use property amenities if available, otherwise use default
  const amenities = property.amenities || property.Amenities || defaultAmenities;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />
      
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: property.imageUrl }} 
          style={styles.propertyImage} 
          resizeMode="cover" 
        />
        
        <View style={styles.imageOverlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
                onPress={shareProperty}
              >
                <Share2 size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.headerButton, { 
                  backgroundColor: isFavorite ? theme.primary : 'rgba(0,0,0,0.5)',
                }]} 
                onPress={toggleFavorite}
              >
                <Heart 
                  size={20} 
                  color="#FFFFFF" 
                  fill={isFavorite ? '#FFFFFF' : 'transparent'} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.typeTag, { backgroundColor: theme.primary }]}>
            <Text style={styles.typeText}>{property.type}</Text>
          </View>
          
          {isInterested && (
            <View style={[styles.interestStatusTag, { backgroundColor: '#4CAF50' }]}>
              <ThumbsUp size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.interestStatusText}>Interested</Text>
            </View>
          )}
        </View>
      </View>
      
      <Animated.View 
        style={[styles.detailsCard, { backgroundColor: theme.card }]}
        entering={FadeInUp.delay(200).springify()}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.text }]}>{property.title}</Text>
            <Text style={[styles.price, { color: theme.primary }]}>
              ${(property.price || property.rentAmountInFiat || 0).toLocaleString()}<Text style={[styles.perMonth, { color: theme.textSecondary }]}>/month</Text>
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={theme.textSecondary} />
            <Text style={[styles.location, { color: theme.textSecondary }]}>{property.location}</Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.featuresContainer}>
            <FeatureItem 
              icon={<Bed size={20} color={theme.primary} />}
              value={`${property.beds} Bedrooms`}
              theme={theme}
            />
            <FeatureItem 
              icon={<Bath size={20} color={theme.primary} />}
              value={`${property.baths} Bathrooms`}
              theme={theme}
            />
            <FeatureItem 
              icon={<Square size={20} color={theme.primary} />}
              value={`${property.area} sqft`}
              theme={theme}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {property.description || property.Description || 
                `This beautiful ${property.type.toLowerCase()} features ${property.beds} bedrooms and ${property.baths} bathrooms, 
                spanning ${property.area} square feet of elegant living space. Located in the heart of ${property.location}, 
                this property offers a perfect blend of comfort and convenience.
                
                Enjoy high-end finishes, plenty of natural light, and a thoughtfully designed layout perfect for modern living.`
              }
            </Text>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Check size={16} color={theme.primary} />
                  <Text style={[styles.amenityText, { color: theme.text }]}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Location</Text>
            <View style={[styles.mapContainer, { backgroundColor: theme.backgroundTertiary }]}>
              <Text style={[styles.mapPlaceholder, { color: theme.textSecondary }]}>Map View</Text>
            </View>
          </View>
          
          <View style={styles.landlordContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.landlordImage} 
            />
            <View style={styles.landlordInfo}>
              <Text style={[styles.landlordTitle, { color: theme.textSecondary }]}>LANDLORD</Text>
              <Text style={[styles.landlordName, { color: theme.text }]}>
                {property.landlord || property.originalData?.landlord || "John Smith"}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: theme.primary + '20' }]}
              onPress={handleContactLandlord}
            >
              <MessageCircle size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          {isInterested && (
            <View style={styles.interestInfoContainer}>
              <View style={[styles.interestInfoBox, { backgroundColor: theme.backgroundTertiary }]}>
                <ThumbsUp size={24} color="#4CAF50" style={{ marginRight: 12 }} />
                <View>
                  <Text style={[styles.interestInfoTitle, { color: theme.text }]}>You're Interested!</Text>
                  <Text style={[styles.interestInfoText, { color: theme.textSecondary }]}>
                    The landlord has been notified of your interest in this property. They may contact you soon.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>
      
      <Animated.View 
        style={[styles.footer, { backgroundColor: theme.card }]}
        entering={FadeIn.delay(400)}
      >
        <View style={styles.footerContent}>
          <TouchableOpacity 
            style={[styles.contactLandlordButton, { borderColor: theme.border }]} 
            onPress={handleContactLandlord}
          >
            <Text style={[styles.contactLandlordText, { color: theme.text }]}>Contact Landlord</Text>
          </TouchableOpacity>
          
          {!isInterested ? (
            <TouchableOpacity 
              style={[
                styles.interestButton, 
                { backgroundColor: theme.primary },
                interestActionInProgress && { opacity: 0.7 }
              ]} 
              onPress={handleShowInterest}
              disabled={interestActionInProgress}
            >
              {interestActionInProgress ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.interestButtonText}>Show Interest</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.interestButton, 
                { backgroundColor: '#E53935' },
                interestActionInProgress && { opacity: 0.7 }
              ]} 
              onPress={handleRemoveInterest}
              disabled={interestActionInProgress}
            >
              {interestActionInProgress ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.interestButtonText}>Not Interested</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const FeatureItem = ({ icon, value, theme }: { icon: React.ReactNode, value: string, theme: any }) => {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIconContainer, { backgroundColor: theme.backgroundTertiary }]}>
        {icon}
      </View>
      <Text style={[styles.featureValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  typeTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  interestStatusTag: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestStatusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  typeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  detailsCard: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  price: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
  perMonth: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  amenityText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  landlordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  landlordImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  landlordInfo: {
    flex: 1,
    marginLeft: 12,
  },
  landlordTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  landlordName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interestInfoContainer: {
    marginBottom: 24,
  },
  interestInfoBox: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestInfoTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  interestInfoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  footerContent: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    alignItems: 'center',
  },
  contactLandlordButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactLandlordText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  interestButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interestButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});