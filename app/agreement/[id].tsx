import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, FileText, MessageCircle, Calendar, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, Download, Share2, Pen } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { mockAgreements } from '@/utils/mockData';

export default function AgreementDetailScreen() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { setHasAgreement } = useAuth();
  
  // Find the agreement by ID
  const agreement = mockAgreements.find(a => a.id === Number(id));
  
  if (!agreement) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Agreement not found</Text>
      </View>
    );
  }

  const isPending = agreement.status.toLowerCase() === 'pending';
  const isActive = agreement.status.toLowerCase() === 'active';
  const isExpired = agreement.status.toLowerCase() === 'expired';
  
  let StatusIcon;
  let statusColor;
  
  switch (agreement.status.toLowerCase()) {
    case 'active':
      StatusIcon = CheckCircle;
      statusColor = '#10B981'; // Green
      break;
    case 'pending':
      StatusIcon = Clock;
      statusColor = '#F59E0B'; // Amber
      break;
    case 'expired':
    case 'completed':
      StatusIcon = AlertCircle;
      statusColor = '#EF4444'; // Red
      break;
    default:
      StatusIcon = FileText;
      statusColor = '#6B7280'; // Gray
  }

  const handleSign = () => {
    if (isPending) {
      router.push(`/sign-agreement/${id}`);
    }
  };

  const handleDownload = () => {
    // Implement download functionality
    Alert.alert('Download', 'Agreement document will be downloaded');
  };

  const handleShare = () => {
    // Implement share functionality
    Alert.alert('Share', 'Agreement document will be shared');
  };

  const handleContactLandlord = () => {
    router.push(`/chat/landlord`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.backgroundTertiary }]} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Agreement Details</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={[styles.statusCard, { backgroundColor: statusColor + '10' }]}
          entering={FadeIn.delay(200)}
        >
          <View style={styles.statusContent}>
            <StatusIcon size={24} color={statusColor} />
            <View style={styles.statusTextContainer}>
              <Text style={[styles.statusTitle, { color: statusColor }]}>
                {agreement.status} Agreement
              </Text>
              <Text style={[styles.statusDescription, { color: theme.textSecondary }]}>
                {isPending 
                  ? 'This agreement requires your signature' 
                  : isActive 
                  ? 'This agreement is currently active'
                  : 'This agreement has expired'}
              </Text>
            </View>
          </View>
          
          {isPending && (
            <TouchableOpacity 
              style={[styles.signButton, { backgroundColor: theme.primary }]} 
              onPress={handleSign}
            >
              <Text style={styles.signButtonText}>Sign Now</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
        
        <Animated.View
          style={[styles.propertyCard, { backgroundColor: theme.card }]}
          entering={FadeInUp.delay(300).springify()}
        >
          <View style={styles.propertyHeader}>
            <Image source={{ uri: agreement.propertyImage }} style={styles.propertyImage} />
            <View style={styles.propertyInfo}>
              <Text style={[styles.propertyTitle, { color: theme.text }]}>
                {agreement.propertyTitle}
              </Text>
              <Text style={[styles.propertyAddress, { color: theme.textSecondary }]}>
                {agreement.address}
              </Text>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View
          style={[styles.detailsCard, { backgroundColor: theme.card }]}
          entering={FadeInUp.delay(400).springify()}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Agreement Details</Text>
          
          <View style={styles.detailsGrid}>
            <DetailItem 
              label="LANDLORD" 
              value={agreement.landlordName}
              theme={theme}
            />
            <DetailItem 
              label="MONTHLY RENT" 
              value={`$${agreement.rent}`}
              theme={theme}
            />
            <DetailItem 
              label="TERM LENGTH" 
              value={agreement.duration}
              theme={theme}
            />
            <DetailItem 
              label="START DATE" 
              value={formatDate(agreement.startDate)}
              theme={theme}
            />
            <DetailItem 
              label="END DATE" 
              value={formatDate(agreement.endDate)}
              theme={theme}
            />
            <DetailItem 
              label={isPending ? "RECEIVED ON" : isActive ? "SIGNED ON" : "EXPIRED ON"} 
              value={agreement.date}
              theme={theme}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.documentsSection}>
            <Text style={[styles.documentTitle, { color: theme.text }]}>Agreement Document</Text>
            
            <View style={[styles.documentItem, { backgroundColor: theme.backgroundSecondary }]}>
              <View style={styles.documentIconContainer}>
                <FileText size={24} color={theme.primary} />
              </View>
              <View style={styles.documentInfo}>
                <Text style={[styles.documentName, { color: theme.text }]}>
                  Rental_Agreement_{agreement.id}.pdf
                </Text>
                <Text style={[styles.documentSize, { color: theme.textTertiary }]}>
                  2.4 MB • PDF
                </Text>
              </View>
              <View style={styles.documentActions}>
                <TouchableOpacity 
                  style={[styles.documentButton, { backgroundColor: theme.backgroundTertiary }]} 
                  onPress={handleDownload}
                >
                  <Download size={16} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.documentButton, { backgroundColor: theme.backgroundTertiary }]} 
                  onPress={handleShare}
                >
                  <Share2 size={16} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {(isPending || isActive) && (
            <View style={styles.actionButtonsContainer}>
              {isPending ? (
                <TouchableOpacity 
                  style={[styles.primaryButton, { backgroundColor: theme.primary }]} 
                  onPress={handleSign}
                >
                  <Pen size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Sign Agreement</Text>
                </TouchableOpacity>
              ) : isActive && (
                <>
                  <TouchableOpacity 
                    style={[styles.secondaryButton, { backgroundColor: theme.backgroundTertiary }]} 
                    onPress={() => router.push('/payment')}
                  >
                    <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Make Payment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.secondaryButton, { backgroundColor: theme.backgroundTertiary }]} 
                    onPress={() => router.push('/leave-notice')}
                  >
                    <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Request Change</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>
      
      <Animated.View 
        style={[styles.footer, { backgroundColor: theme.card }]}
        entering={FadeIn.delay(500)}
      >
        <TouchableOpacity 
          style={[styles.contactButton, { backgroundColor: theme.primary }]} 
          onPress={handleContactLandlord}
        >
          <MessageCircle size={20} color="#FFFFFF" />
          <Text style={styles.contactButtonText}>Contact Landlord</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const DetailItem = ({ label, value, theme }: { label: string, value: string, theme: any }) => {
  return (
    <View style={styles.detailItem}>
      <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  statusCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  statusDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  signButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  signButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  propertyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  propertyInfo: {
    marginLeft: 12,
    flex: 1,
  },
  propertyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  propertyAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  detailsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  documentsSection: {
    marginBottom: 16,
  },
  documentTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginBottom: 2,
  },
  documentSize: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  documentActions: {
    flexDirection: 'row',
  },
  documentButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButtonsContainer: {
    marginTop: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
  },
  contactButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});