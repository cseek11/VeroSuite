// ============================================================================
// VeroField Mobile App - Job Details Screen
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { JOB_STATUS_COLORS, JOB_PRIORITY_COLORS, PHOTO_TYPES } from '../constants';
import Button from '../components/Button';
import Card from '../components/Card';
import jobsService from '../services/jobsService';
import locationService from '../services/locationService';
import offlineService from '../services/offlineService';

type JobDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JobDetails'>;
type JobDetailsScreenRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;

interface Job {
  id: string;
  title: string;
  description: string;
  status: 'unassigned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  serviceType: string;
  estimatedDuration: number; // in minutes
  notes?: string;
  photos?: Array<{
    id: string;
    type: string;
    url: string;
    timestamp: string;
  }>;
  signatures?: Array<{
    id: string;
    type: 'customer' | 'technician';
    url: string;
    timestamp: string;
  }>;
}

const JobDetailsScreen: React.FC = () => {
  const navigation = useNavigation<JobDetailsScreenNavigationProp>();
  const route = useRoute<JobDetailsScreenRouteProp>();
  
  const { jobId } = route.params || {};
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Mock job data - replace with actual API call
  const mockJob: Job = {
    id: jobId || '1',
    title: 'Quarterly Pest Control Service',
    description: 'Comprehensive pest control treatment for residential property including interior and exterior applications.',
    status: 'scheduled',
    priority: 'medium',
    scheduledDate: '2024-03-15T10:00:00Z',
    customer: {
      name: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main Street, Anytown, ST 12345',
    },
    serviceType: 'General Pest Control',
    estimatedDuration: 90,
    notes: 'Customer mentioned seeing ants in kitchen area. Focus on entry points around windows and doors.',
    photos: [],
    signatures: [],
  };

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    setIsLoading(true);
    try {
      const isOnline = await offlineService.isOnline();
      
      if (isOnline && jobId) {
        // Load from API
        const jobData = await jobsService.getJobById(jobId);
        setJob(jobData as any); // Type conversion for compatibility
        
        // Store offline for future access
        await offlineService.storeJobOffline(jobData);
      } else {
        // Load from offline storage or use mock data
        const offlineJobs = await offlineService.getOfflineJobs();
        const offlineJob = offlineJobs.find(j => j.id === jobId);
        
        if (offlineJob) {
          setJob(offlineJob as any);
        } else {
          // Fallback to mock data
          setJob(mockJob);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load job details');
      console.error('Load job error:', error);
      
      // Try to load from offline storage as fallback
      try {
        const offlineJobs = await offlineService.getOfflineJobs();
        const offlineJob = offlineJobs.find(j => j.id === jobId);
        if (offlineJob) {
          setJob(offlineJob as any);
        } else {
          setJob(mockJob);
        }
      } catch (offlineError) {
        setJob(mockJob);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadJobDetails();
    setIsRefreshing(false);
  };

  const handleStatusUpdate = async (newStatus: Job['status']) => {
    if (!job) return;
    
    setIsUpdatingStatus(true);
    try {
      const isOnline = await offlineService.isOnline();
      
      if (isOnline) {
        // Update status online
        await jobsService.updateJobStatus(job.id, newStatus);
      }
      
      // Update local state
      setJob(prev => prev ? { ...prev, status: newStatus } : null);
      
      // Store offline for sync later if needed
      const updatedJob = { ...job, status: newStatus };
      await offlineService.storeJobOffline(updatedJob as any);
      
      // Handle location tracking
      if (newStatus === 'in_progress') {
        await locationService.startTracking(job.id);
        Alert.alert('Job Started', 'Location tracking enabled for this job.');
      } else if (newStatus === 'completed') {
        await locationService.stopTracking();
        Alert.alert('Job Completed', 'Location tracking stopped and data uploaded.');
      } else {
        Alert.alert('Success', `Job status updated to ${newStatus.replace('_', ' ')}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update job status');
      console.error('Status update error:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePhotoCapture = (photoType: string) => {
    navigation.navigate('PhotoCapture', {
      jobId: job?.id,
      photoType,
    });
  };

  const handleSignatureCapture = (signatureType: 'customer' | 'technician') => {
    navigation.navigate('SignatureCapture', {
      jobId: job?.id,
      signatureType,
    });
  };

  const renderStatusBadge = (status: Job['status']) => {
    const color = JOB_STATUS_COLORS[status];
    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{status.replace('_', ' ').toUpperCase()}</Text>
      </View>
    );
  };

  const renderPriorityBadge = (priority: Job['priority']) => {
    const color = JOB_PRIORITY_COLORS[priority];
    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{priority.toUpperCase()}</Text>
      </View>
    );
  };

  const renderActionButtons = () => {
    if (!job) return null;

    const actions = [];

    if (job.status === 'scheduled') {
      actions.push(
        <Button
          key="start"
          title="Start Job"
          onPress={() => handleStatusUpdate('in_progress')}
          loading={isUpdatingStatus}
          style={styles.actionButton}
        />
      );
    }

    if (job.status === 'in_progress') {
      actions.push(
        <Button
          key="complete"
          title="Complete Job"
          onPress={() => handleStatusUpdate('completed')}
          loading={isUpdatingStatus}
          style={[styles.actionButton, styles.completeButton]}
        />
      );
    }

    return actions;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Job not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Job Header */}
        <Card style={styles.jobHeader}>
          <View style={styles.jobTitleRow}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={styles.badges}>
              {renderStatusBadge(job.status)}
              {renderPriorityBadge(job.priority)}
            </View>
          </View>
          <Text style={styles.jobDescription}>{job.description}</Text>
          
          <View style={styles.jobMeta}>
            <Text style={styles.metaLabel}>Service Type:</Text>
            <Text style={styles.metaValue}>{job.serviceType}</Text>
          </View>
          
          <View style={styles.jobMeta}>
            <Text style={styles.metaLabel}>Scheduled:</Text>
            <Text style={styles.metaValue}>
              {new Date(job.scheduledDate).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.jobMeta}>
            <Text style={styles.metaLabel}>Duration:</Text>
            <Text style={styles.metaValue}>{job.estimatedDuration} minutes</Text>
          </View>
        </Card>

        {/* Customer Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{job.customer.name}</Text>
            <Text style={styles.customerDetail}>{job.customer.phone}</Text>
            <Text style={styles.customerDetail}>{job.customer.email}</Text>
            <Text style={styles.customerAddress}>{job.customer.address}</Text>
          </View>
        </Card>

        {/* Notes */}
        {job.notes && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{job.notes}</Text>
          </Card>
        )}

        {/* Photo Capture */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photoActions}>
            {PHOTO_TYPES.map((photoType) => (
              <TouchableOpacity
                key={photoType.key}
                style={styles.photoButton}
                onPress={() => handlePhotoCapture(photoType.key)}
              >
                <Text style={styles.photoButtonIcon}>{photoType.icon}</Text>
                <Text style={styles.photoButtonText}>{photoType.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Signatures */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Signatures</Text>
          <View style={styles.signatureActions}>
            <TouchableOpacity
              style={styles.signatureButton}
              onPress={() => handleSignatureCapture('technician')}
            >
              <Text style={styles.signatureButtonIcon}>👨‍🔧</Text>
              <Text style={styles.signatureButtonText}>Technician Signature</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.signatureButton}
              onPress={() => handleSignatureCapture('customer')}
            >
              <Text style={styles.signatureButtonIcon}>✍️</Text>
              <Text style={styles.signatureButtonText}>Customer Signature</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {renderActionButtons()}
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 24,
    textAlign: 'center',
  },
  jobHeader: {
    marginTop: 16,
  },
  jobTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  badges: {
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  jobMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 100,
  },
  metaValue: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  customerInfo: {
    gap: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  customerDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  customerAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20,
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  photoActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    minWidth: 80,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photoButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  photoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  signatureActions: {
    gap: 12,
  },
  signatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  signatureButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  signatureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  actions: {
    marginTop: 24,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
});

export default JobDetailsScreen;
