import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Platform
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
  MessageCircle 
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { mockProperties } from '@/utils/mockData';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find the property by ID
  const property = mockProperties.find(p => p.id === Number(id));
  
  if (!property) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Property not found</Text>
      </View>
    );
  }

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

  const handleBookProperty = () => {
    //router.push('/booking');
  };
  
  // Mock amenities
  const amenities = [
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
              ${property.price.toLocaleString()}<Text style={[styles.perMonth, { color: theme.textSecondary }]}>/month</Text>
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
              This beautiful {property.type.toLowerCase()} features {property.beds} bedrooms and {property.baths} bathrooms, 
              spanning {property.area} square feet of elegant living space. Located in the heart of {property.location}, 
              this property offers a perfect blend of comfort and convenience.
              
              Enjoy high-end finishes, plenty of natural light, and a thoughtfully designed layout perfect for modern living.
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
              <Text style={[styles.landlordName, { color: theme.text }]}>John Smith</Text>
            </View>
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: theme.primary + '20' }]}
              onPress={handleContactLandlord}
            >
              <MessageCircle size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
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
          
          <TouchableOpacity 
            style={[styles.bookPropertyButton, { backgroundColor: theme.primary }]} 
            onPress={handleBookProperty}
          >
            <Text style={styles.bookPropertyText}>Book Property</Text>
          </TouchableOpacity>
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
  bookPropertyButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookPropertyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});