import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { ChevronRight, Bell, Calendar, CreditCard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

export const CurrentRental = () => {
  const { theme } = useTheme();
  const router = useRouter();
  
  // Mock rental data
  const rental = {
    id: '1',
    address: '123 Maple Avenue, Apt 4B',
    city: 'New York',
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    landlord: 'John Smith',
    rent: 1500,
    dueDate: '2025-05-01',
    status: 'Active',
    daysLeft: 7,
  };

  return (
    <Animated.View entering={FadeIn.delay(200).springify()}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.label, { color: theme.textTertiary }]}>CURRENT RENTAL</Text>
            <Text style={[styles.address, { color: theme.text }]} numberOfLines={1}>
              {rental.address}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.notificationButton, { backgroundColor: theme.input }]}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: rental.imageUrl }} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          <Text style={styles.city}>{rental.city}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>NEXT PAYMENT</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>${rental.rent}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>DUE IN</Text>
              <Text 
                style={[
                  styles.detailValue, 
                  { 
                    color: rental.daysLeft <= 3 ? theme.error : rental.daysLeft <= 7 ? theme.warning : theme.text 
                  }
                ]}
              >
                {rental.daysLeft} days
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/payment')}
          >
            <CreditCard size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Pay Rent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.backgroundTertiary }]}
            onPress={() => router.push('/agreement-details')}
          >
            <Calendar size={18} color={theme.text} />
            <Text style={[styles.actionText, { color: theme.text }]}>View Agreement</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.moreDetailsButton, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
        onPress={() => router.push('/rental-details')}
      >
        <Text style={[styles.moreDetailsText, { color: theme.textSecondary }]}>
          View rental details
        </Text>
        <ChevronRight size={16} color={theme.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  address: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginTop: 2,
    width: '90%',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  city: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  moreDetailsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  moreDetailsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});