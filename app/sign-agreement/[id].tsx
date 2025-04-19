import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Trash2, Check } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import SignatureCanvas from 'react-native-signature-canvas';
import { mockAgreements } from '@/utils/mockData';

export default function SignAgreementScreen() {
  const { theme, isDarkMode } = useTheme();
  const { setHasAgreement } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const signatureRef = useRef<any>(null);
  
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  
  // Find the agreement by ID
  const agreement = mockAgreements.find(a => a.id === Number(id));
  
  if (!agreement) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Agreement not found</Text>
      </View>
    );
  }

  const handleSignature = (signature: string) => {
    setSignature(signature);
    setIsSigned(true);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setIsSigned(false);
    setSignature(null);
  };

  const handleConfirm = () => {
    if (!isSigned) {
      Alert.alert('Signature Required', 'Please sign the agreement before submitting.');
      return;
    }

    Alert.alert(
      'Confirm Signature',
      'By signing this agreement, you agree to the terms and conditions. This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            // Set the agreement as active
            setHasAgreement(true);
            // Navigate back to tabs
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const signatureStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
      width: 100%;
      height: 100%;
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--footer {
      display: none;
    }
    body {
      background-color: ${theme.backgroundTertiary};
    }
  `;

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Sign Agreement</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={styles.contentContainer}
          entering={FadeInUp.delay(200).springify()}
        >
          <Text style={[styles.instruction, { color: theme.text }]}>
            Please sign below to confirm the rental agreement for:
          </Text>
          
          <Text style={[styles.propertyTitle, { color: theme.primary }]}>
            {agreement.propertyTitle}
          </Text>
          
          <Text style={[styles.propertyAddress, { color: theme.textSecondary }]}>
            {agreement.address}
          </Text>
          
          <View style={[styles.signatureContainer, { backgroundColor: theme.backgroundTertiary, borderColor: theme.border }]}>
            <SignatureCanvas
              ref={signatureRef}
              onOK={handleSignature}
              webStyle={signatureStyle}
              autoClear={false}
              descriptionText=""
              minWidth={2}
              maxWidth={4}
              penColor={theme.text}
            />
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.clearButton, { borderColor: theme.border }]} 
              onPress={handleClear}
            >
              <Trash2 size={20} color={theme.error} />
              <Text style={[styles.clearText, { color: theme.error }]}>Clear</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.confirmButton, 
                { 
                  backgroundColor: isSigned ? theme.primary : theme.backgroundTertiary,
                  opacity: isSigned ? 1 : 0.7,
                }
              ]} 
              onPress={handleConfirm}
              disabled={!isSigned}
            >
              <Check size={20} color={isSigned ? '#FFFFFF' : theme.textSecondary} />
              <Text 
                style={[
                  styles.confirmText, 
                  { color: isSigned ? '#FFFFFF' : theme.textSecondary }
                ]}
              >
                Confirm & Sign
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
            By signing, you agree to all terms and conditions in the rental agreement. 
            This is a legally binding contract.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    flexGrow: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
  },
  instruction: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  propertyTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  propertyAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginBottom: 32,
  },
  signatureContainer: {
    height: 200,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    marginRight: 12,
  },
  clearText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
  },
  confirmText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  disclaimer: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});