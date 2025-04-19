import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  ScrollView,
  RefreshControl,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { FileText, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { mockAgreements } from '@/utils/mockData';

const statusColors = {
  active: '#10B981', // Green
  pending: '#F59E0B', // Amber
  expired: '#EF4444', // Red
  completed: '#6B7280', // Gray
};

export default function AgreementsScreen() {
  const { theme, isDarkMode } = useTheme();
  const { hasAgreement, setHasAgreement } = useAuth();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [agreements, setAgreements] = useState(mockAgreements);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter agreements based on active tab
  const filteredAgreements = React.useMemo(() => {
    if (activeTab === 'all') return agreements;
    return agreements.filter(agreement => agreement.status.toLowerCase() === activeTab);
  }, [activeTab, agreements]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Handle agreement press - if agreement is active, set hasAgreement to true
  const handleAgreementPress = (agreement: any) => {
    if (agreement.status.toLowerCase() === 'active') {
      setHasAgreement(true);
    }
    router.push(`/agreement/${agreement.id}`);
  };

  const renderAgreementItem = ({ item, index }: { item: any, index: number }) => {
    const statusColor = statusColors[item.status.toLowerCase() as keyof typeof statusColors];
    
    let StatusIcon;
    switch (item.status.toLowerCase()) {
      case 'active':
        StatusIcon = CheckCircle;
        break;
      case 'pending':
        StatusIcon = Clock;
        break;
      case 'expired':
      case 'completed':
        StatusIcon = AlertCircle;
        break;
      default:
        StatusIcon = FileText;
    }
    
    return (
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <TouchableOpacity 
          style={[styles.agreementItem, { backgroundColor: theme.card }]} 
          onPress={() => handleAgreementPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.agreementHeader}>
            <Image source={{ uri: item.propertyImage }} style={styles.propertyImage} />
            <View style={styles.headerContent}>
              <Text style={[styles.propertyTitle, { color: theme.text }]} numberOfLines={1}>
                {item.propertyTitle}
              </Text>
              <Text style={[styles.agreementAddress, { color: theme.textSecondary }]} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
          </View>
          
          <View style={styles.agreementDetails}>
            <View style={styles.detailColumn}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>MONTHLY RENT</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>${item.rent}</Text>
            </View>
            
            <View style={styles.detailColumn}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>DURATION</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{item.duration}</Text>
            </View>
            
            <View style={styles.detailColumn}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>STATUS</Text>
              <View style={styles.statusContainer}>
                <StatusIcon size={14} color={statusColor} />
                <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {item.status === 'Active' ? 'Started' : item.status === 'Pending' ? 'Received' : item.status === 'Expired' ? 'Expired' : 'Ended'}: {item.date}
            </Text>
            <ChevronRight size={20} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Agreements</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.tabsContainer}
      >
        {['all', 'active', 'pending', 'expired'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === tab ? theme.primary : theme.backgroundTertiary,
              },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab ? '#FFFFFF' : theme.textSecondary,
                },
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {filteredAgreements.length > 0 ? (
        <Animated.View entering={FadeIn} style={{ flex: 1 }}>
          <FlatList
            data={filteredAgreements}
            renderItem={renderAgreementItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.agreementsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </Animated.View>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: theme.backgroundTertiary }]}>
            <FileText size={32} color={theme.primary} />
          </View>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No {activeTab === 'all' ? '' : activeTab} agreements found
          </Text>
          <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
            {activeTab === 'pending' 
              ? 'You don\'t have any pending agreements waiting for your signature'
              : activeTab === 'active'
                ? 'You don\'t have any active rental agreements'
                : activeTab === 'expired'
                  ? 'You don\'t have any expired agreements'
                  : 'Start exploring properties and connect with landlords to receive rental agreements'}
          </Text>
          
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: theme.primary }]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.emptyButtonText}>
              {activeTab === 'all' ? 'Explore Properties' : 'View All Agreements'}
            </Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
  },
  tabsContainer: {
    paddingBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 12,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  agreementsList: {
    paddingBottom: 100,
  },
  agreementItem: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  agreementHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  propertyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  propertyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  agreementAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  agreementDetails: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailColumn: {
    flex: 1,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});