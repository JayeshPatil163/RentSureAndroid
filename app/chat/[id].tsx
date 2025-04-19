import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Phone, MoveVertical as MoreVertical, Send, Image as ImageIcon, Paperclip, Mic } from 'lucide-react-native';
import { mockChats } from '@/utils/mockData';

// Mock messages data
const mockMessages = [
  {
    id: 1,
    text: 'Hello! I saw your listing for the apartment and I\'m interested.',
    sender: 'user',
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    text: 'Hi there! Thanks for your interest. The apartment is still available.',
    sender: 'other',
    timestamp: '10:32 AM',
  },
  {
    id: 3,
    text: 'Great! I have a few questions about the property.',
    sender: 'user',
    timestamp: '10:33 AM',
  },
  {
    id: 4,
    text: 'Of course! Feel free to ask anything.',
    sender: 'other',
    timestamp: '10:34 AM',
  },
  {
    id: 5,
    text: 'Is parking included in the rent?',
    sender: 'user',
    timestamp: '10:35 AM',
  },
  {
    id: 6,
    text: 'Yes, one parking spot is included. Additional spots are available for $100/month.',
    sender: 'other',
    timestamp: '10:36 AM',
  },
  {
    id: 7,
    text: 'And what about utilities? Are they included in the monthly rent?',
    sender: 'user',
    timestamp: '10:37 AM',
  },
  {
    id: 8,
    text: 'Water and garbage are included. Electricity, internet, and gas are the tenant\'s responsibility.',
    sender: 'other',
    timestamp: '10:39 AM',
  },
  {
    id: 9,
    text: 'When would the apartment be available for move-in?',
    sender: 'user',
    timestamp: '10:40 AM',
  },
  {
    id: 10,
    text: 'The apartment will be available from the 1st of next month. Would you like to schedule a viewing?',
    sender: 'other',
    timestamp: '10:41 AM',
  },
];

export default function ChatScreen() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  // Find the chat by ID
  const chat = mockChats.find(c => c.id === Number(id));
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        scrollToBottom();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View 
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View 
          style={[
            styles.messageBubble,
            isUser 
              ? { backgroundColor: theme.primary } 
              : { backgroundColor: theme.backgroundTertiary },
          ]}
        >
          <Text 
            style={[
              styles.messageText,
              isUser ? { color: '#FFFFFF' } : { color: theme.text },
            ]}
          >
            {item.text}
          </Text>
        </View>
        <Text 
          style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.otherTimestamp,
            { color: theme.textTertiary },
          ]}
        >
          {item.timestamp}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.headerProfile}>
          <Image 
            source={{ uri: chat?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }} 
            style={styles.headerAvatar} 
          />
          <View>
            <Text style={[styles.headerName, { color: theme.text }]}>
              {chat?.name || 'Chat'}
            </Text>
            <Text style={[styles.headerStatus, { color: theme.textSecondary }]}>
              {chat?.online ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Phone size={20} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreVertical size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={24} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <View style={[styles.textInputContainer, { backgroundColor: theme.backgroundTertiary }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Type a message..."
              placeholderTextColor={theme.textTertiary}
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
            />
            
            <TouchableOpacity style={styles.mediaButton}>
              <ImageIcon size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {inputMessage.trim() ? (
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: theme.primary }]} 
              onPress={sendMessage}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micButton}>
              <Mic size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  headerStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    marginTop: 4,
  },
  userTimestamp: {
    alignSelf: 'flex-end',
  },
  otherTimestamp: {
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  attachButton: {
    marginRight: 8,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    maxHeight: 100,
    paddingTop: 10,
    paddingBottom: 10,
  },
  mediaButton: {
    marginLeft: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    marginLeft: 8,
  },
});