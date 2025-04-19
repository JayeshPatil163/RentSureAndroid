// import React from 'react';
// import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
// import { useTheme } from '@/contexts/ThemeContext';
// import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react-native';

// const { width } = Dimensions.get('window');
// const cardWidth = width - 32;

// type PropertyCardProps = {
//   property: {
//     id: number;
//     title: string;
//     location: string;
//     price: number;
//     type: string;
//     beds: number;
//     baths: number;
//     area: number;
//     imageUrl: string;
//     isFavorite?: boolean;
//   };
//   onPress: () => void;
// };

// export const PropertyCard = ({ property, onPress }: PropertyCardProps) => {
//   const { theme } = useTheme();
//   const [isFavorite, setIsFavorite] = React.useState(property.isFavorite || false);

//   const toggleFavorite = (e: any) => {
//     e.stopPropagation();
//     setIsFavorite(!isFavorite);
//   };
  

//   return (
//     <TouchableOpacity 
//       style={[styles.container, { backgroundColor: theme.card }]} 
//       onPress={onPress}
//       activeOpacity={0.9}
//     >
//       <View style={styles.imageContainer}>
//         <Image 
//           source={{ uri: property.imageUrl }} 
//           style={styles.image} 
//           resizeMode="cover" 
//         />
//         <TouchableOpacity 
//           style={[styles.favoriteButton, { backgroundColor: isFavorite ? theme.primary : 'rgba(255,255,255,0.9)' }]} 
//           onPress={toggleFavorite}
//         >
//           <Heart 
//             size={16} 
//             color={isFavorite ? '#FFFFFF' : theme.textSecondary} 
//             fill={isFavorite ? '#FFFFFF' : 'transparent'} 
//           />
//         </TouchableOpacity>
//         <View style={[styles.typeTag, { backgroundColor: theme.primary }]}>
//           <Text style={styles.typeText}>{property.type}</Text>
//         </View>
//       </View>
      
//       <View style={styles.contentContainer}>
//         <View style={styles.headingRow}>
//           <Text style={[styles.price, { color: theme.text }]}>
//             ${property.price.toLocaleString()}<Text style={[styles.perMonth, { color: theme.textSecondary }]}>/mo</Text>
//           </Text>
//         </View>
        
//         <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{property.title}</Text>
        
//         <View style={styles.locationContainer}>
//           <MapPin size={14} color={theme.textSecondary} />
//           <Text style={[styles.locationText, { color: theme.textSecondary }]} numberOfLines={1}>
//             {property.location}
//           </Text>
//         </View>
        
//         <View style={styles.detailsContainer}>
//           <View style={styles.detailItem}>
//             <Bed size={14} color={theme.textSecondary} />
//             <Text style={[styles.detailText, { color: theme.textSecondary }]}>{property.beds} Beds</Text>
//           </View>
          
//           <View style={styles.detailItem}>
//             <Bath size={14} color={theme.textSecondary} />
//             <Text style={[styles.detailText, { color: theme.textSecondary }]}>{property.baths} Baths</Text>
//           </View>
          
//           <View style={styles.detailItem}>
//             <Square size={14} color={theme.textSecondary} />
//             <Text style={[styles.detailText, { color: theme.textSecondary }]}>{property.area} sqft</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: cardWidth,
//     borderRadius: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   imageContainer: {
//     position: 'relative',
//     width: '100%',
//     height: 200,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   favoriteButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   typeTag: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   typeText: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 12,
//     color: '#FFFFFF',
//   },
//   contentContainer: {
//     padding: 16,
//   },
//   headingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   price: {
//     fontFamily: 'Poppins-Bold',
//     fontSize: 18,
//   },
//   perMonth: {
//     fontFamily: 'Poppins-Regular',
//     fontSize: 14,
//   },
//   title: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 16,
//     marginTop: 8,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   locationText: {
//     fontFamily: 'Poppins-Regular',
//     fontSize: 14,
//     marginLeft: 4,
//     flex: 1,
//   },
//   detailsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginTop: 12,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   detailText: {
//     fontFamily: 'Poppins-Regular',
//     fontSize: 12,
//     marginLeft: 4,
//   },
// });




import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

type PropertyCardProps = {
  property: {
    id: number | string;
    title: string;
    location: string;
    price: number;
    type: string;
    beds: number;
    baths: number;
    area: number;
    imageUrl: string;
    isFavorite?: boolean;
    originalData?: any; // Store original data if needed for detail view
  };
  onPress: () => void;
};

export const PropertyCard = ({ property, onPress }: PropertyCardProps) => {
  const { theme } = useTheme();
  const [isFavorite, setIsFavorite] = React.useState(property.isFavorite || false);

  const toggleFavorite = (e: any) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  // Handle potentially missing image
  const imageUrl = property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.card }]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        <TouchableOpacity 
          style={[styles.favoriteButton, { backgroundColor: isFavorite ? theme.primary : 'rgba(255,255,255,0.9)' }]} 
          onPress={toggleFavorite}
        >
          <Heart 
            size={16} 
            color={isFavorite ? '#FFFFFF' : theme.textSecondary} 
            fill={isFavorite ? '#FFFFFF' : 'transparent'} 
          />
        </TouchableOpacity>
        <View style={[styles.typeTag, { backgroundColor: theme.primary }]}>
          <Text style={styles.typeText}>{property.type}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headingRow}>
          <Text style={[styles.price, { color: theme.text }]}>
            ${property.price.toLocaleString()}<Text style={[styles.perMonth, { color: theme.textSecondary }]}>/mo</Text>
          </Text>
        </View>
        
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{property.title}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={theme.textSecondary} />
          <Text style={[styles.locationText, { color: theme.textSecondary }]} numberOfLines={1}>
            {property.location || 'Location not specified'}
          </Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Bed size={14} color={theme.textSecondary} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>{property.beds} Beds</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Bath size={14} color={theme.textSecondary} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>{property.baths} Baths</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Square size={14} color={theme.textSecondary} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>{property.area} sqft</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  perMonth: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
});