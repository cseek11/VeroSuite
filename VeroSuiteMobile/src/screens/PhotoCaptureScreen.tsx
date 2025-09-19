// ============================================================================
// VeroField Mobile App - Photo Capture Screen
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { launchCamera, launchImageLibrary, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { PHOTO_TYPES } from '../constants';
import Button from '../components/Button';
import uploadService, { PhotoUploadData } from '../services/uploadService';
import offlineService from '../services/offlineService';

type PhotoCaptureScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PhotoCapture'>;
type PhotoCaptureScreenRouteProp = RouteProp<RootStackParamList, 'PhotoCapture'>;

interface PhotoData {
  uri: string;
  type: string;
  fileName?: string;
  fileSize?: number;
}

const PhotoCaptureScreen: React.FC = () => {
  const navigation = useNavigation<PhotoCaptureScreenNavigationProp>();
  const route = useRoute<PhotoCaptureScreenRouteProp>();
  
  // Get jobId and photoType from route params
  const { jobId, photoType = 'service' } = route.params || {};
  
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const photoTypeConfig = PHOTO_TYPES.find(type => type.key === photoType) || PHOTO_TYPES[0];

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const photoData: PhotoData = {
          uri: asset.uri || '',
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || `photo_${Date.now()}.jpg`,
          fileSize: asset.fileSize,
        };
        
        setPhotos(prev => [...prev, photoData]);
      }
    });
  };

  const handleGalleryLaunch = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      selectionLimit: 5, // Allow multiple selection
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets) {
        const newPhotos: PhotoData[] = response.assets.map(asset => ({
          uri: asset.uri || '',
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || `photo_${Date.now()}.jpg`,
          fileSize: asset.fileSize,
        }));
        
        setPhotos(prev => [...prev, ...newPhotos]);
      }
    });
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setPhotos(prev => prev.filter((_, i) => i !== index));
          }
        },
      ]
    );
  };

  const handleUploadPhotos = async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please capture or select photos first.');
      return;
    }

    setIsUploading(true);
    
    try {
      const isOnline = await offlineService.isOnline();
      
      if (!isOnline) {
        // Store for offline upload
        for (const photo of photos) {
          const uploadData: PhotoUploadData = {
            jobId: jobId || '',
            photoType: photoType as any,
            uri: photo.uri,
            fileName: photo.fileName || `photo_${Date.now()}.jpg`,
            fileSize: photo.fileSize,
          };
          
          await offlineService.storePendingUpload('photo', uploadData);
        }
        
        Alert.alert(
          'Stored for Upload',
          `${photos.length} photo(s) saved. They will be uploaded when you're back online.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      // Upload photos online
      const uploadPromises = photos.map(photo => {
        const uploadData: PhotoUploadData = {
          jobId: jobId || '',
          photoType: photoType as any,
          uri: photo.uri,
          fileName: photo.fileName || `photo_${Date.now()}.jpg`,
          fileSize: photo.fileSize,
        };
        
        return uploadService.uploadPhoto(uploadData);
      });

      await Promise.all(uploadPromises);
      
      Alert.alert(
        'Success',
        `${photos.length} photo(s) uploaded successfully!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Upload Failed', 'Failed to upload photos. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderPhotoGrid = () => {
    return (
      <View style={styles.photoGrid}>
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={index}
            style={styles.photoContainer}
            onPress={() => handleRemovePhoto(index)}
          >
            <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
            <View style={styles.removeButton}>
              <Text style={styles.removeButtonText}>×</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
          {photoTypeConfig.icon} {photoTypeConfig.label} Photos
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Capture or select {photoTypeConfig.label.toLowerCase()} photos for this job.
          </Text>
          <Text style={styles.photoCount}>
            {photos.length} photo(s) selected
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="📷 Take Photo"
            onPress={handleCameraLaunch}
            style={styles.actionButton}
          />
          
          <Button
            title="📁 Choose from Gallery"
            onPress={handleGalleryLaunch}
            style={[styles.actionButton, styles.secondaryButton]}
          />
        </View>

        {photos.length > 0 && (
          <View style={styles.photosSection}>
            <Text style={styles.sectionTitle}>Selected Photos</Text>
            {renderPhotoGrid()}
          </View>
        )}
      </ScrollView>

      {photos.length > 0 && (
        <View style={styles.footer}>
          <Button
            title={isUploading ? 'Uploading...' : `Upload ${photos.length} Photo(s)`}
            onPress={handleUploadPhotos}
            loading={isUploading}
            disabled={isUploading}
            style={styles.uploadButton}
          />
        </View>
      )}
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
    marginBottom: 8,
  },
  photoCount: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryButton: {
    backgroundColor: '#6B7280',
  },
  photosSection: {
    marginBottom: 100, // Space for footer
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  uploadButton: {
    backgroundColor: '#10B981',
  },
});

export default PhotoCaptureScreen;
