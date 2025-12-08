// ============================================================================
// VeroField Mobile App - Signature Capture Screen
// ============================================================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Button from '../components/Button';
import uploadService, { SignatureUploadData } from '../services/uploadService';
import offlineService from '../services/offlineService';

type SignatureCaptureScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignatureCapture'>;
type SignatureCaptureScreenRouteProp = RouteProp<RootStackParamList, 'SignatureCapture'>;

const { width, height } = Dimensions.get('window');

const SignatureCaptureScreen: React.FC = () => {
  const navigation = useNavigation<SignatureCaptureScreenNavigationProp>();
  const route = useRoute<SignatureCaptureScreenRouteProp>();
  const signatureRef = useRef<any>(null);
  
  // Get jobId and signatureType from route params
  const { jobId, signatureType = 'customer' } = route.params || {};
  
  const [signature, setSignature] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const signatureConfig = {
    customer: {
      title: 'Customer Signature',
      description: 'Please have the customer sign below to confirm service completion.',
      icon: '✍️',
    },
    technician: {
      title: 'Technician Signature',
      description: 'Sign below to confirm you have completed this service.',
      icon: '👨‍🔧',
    },
  };

  const config = signatureConfig[signatureType as keyof typeof signatureConfig] || signatureConfig.customer;

  const handleSignature = (signature: string) => {
    setSignature(signature);
  };

  const handleEmpty = () => {
    console.log('Signature canvas is empty');
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSignature(null);
  };

  const handleSave = async () => {
    if (!signature) {
      Alert.alert('No Signature', 'Please provide a signature first.');
      return;
    }

    setIsUploading(true);
    
    try {
      const isOnline = await offlineService.isOnline();
      
      const signatureUploadData: SignatureUploadData = {
        jobId: jobId || '',
        signatureType,
        signatureData: signature,
      };

      if (!isOnline) {
        // Store for offline upload
        await offlineService.storePendingUpload('signature', signatureUploadData);
        
        Alert.alert(
          'Stored for Upload',
          'Signature saved. It will be uploaded when you\'re back online.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      // Upload signature online
      await uploadService.uploadSignature(signatureUploadData);
      
      Alert.alert(
        'Success',
        'Signature saved successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Save Failed', 'Failed to save signature. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const webStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: 2px solid #E5E7EB;
      border-radius: 8px;
      background-color: #FFFFFF;
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--footer {
      display: none;
    }
    body,html {
      width: ${width}px;
      height: ${height * 0.6}px;
    }
  `;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {config.icon} {config.title}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            {config.description}
          </Text>
        </View>

        <View style={styles.signatureContainer}>
          <Text style={styles.signatureLabel}>Signature</Text>
          <View style={styles.canvasContainer}>
            <SignatureCanvas
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={handleEmpty}
              descriptionText=""
              clearText="Clear"
              confirmText="Save"
              webStyle={webStyle}
              autoClear={false}
              imageType="image/png"
              style={styles.signature}
            />
          </View>
          
          <View style={styles.canvasActions}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title={isUploading ? 'Saving...' : 'Save Signature'}
            onPress={handleSave}
            loading={isUploading}
            disabled={isUploading || !signature}
            style={[
              styles.saveButton,
              (!signature && !isUploading) && styles.disabledButton
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  instructions: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
  },
  signatureContainer: {
    flex: 1,
    marginBottom: 24,
  },
  signatureLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  signature: {
    flex: 1,
  },
  canvasActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6B7280',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 16,
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
});

export default SignatureCaptureScreen;
