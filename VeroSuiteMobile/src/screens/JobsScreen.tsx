// ============================================================================
// VeroField Mobile App - Jobs Screen
// ============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../hooks/useAuth';
import { Job, JobStatus, RootStackParamList } from '../types';
import { JOB_STATUS_COLORS, JOB_PRIORITY_COLORS } from '../constants';
import Card from '../components/Card';
import Button from '../components/Button';
import SyncStatus from '../components/SyncStatus';

type JobsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const JobsScreen: React.FC = () => {
  const navigation = useNavigation<JobsScreenNavigationProp>();
  const { user } = useAuth();
  const {
    jobs,
    isLoadingJobs,
    jobsError,
    startJob,
    completeJob,
    refetchJobs,
    isStartingJob,
    isCompletingJob,
  } = useJobs();

  const handleStartJob = (job: Job) => {
    Alert.alert(
      'Start Job',
      `Are you sure you want to start this job for ${job.customer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => startJob(job.id),
        },
      ]
    );
  };

  const handleCompleteJob = (job: Job) => {
    Alert.alert(
      'Complete Job',
      `Are you sure you want to complete this job for ${job.customer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => completeJob(job.id, { notes: 'Job completed' }),
        },
      ]
    );
  };

  const getStatusColor = (status: JobStatus): string => {
    return JOB_STATUS_COLORS[status] || '#6B7280';
  };

  const getPriorityColor = (priority: string): string => {
    return JOB_PRIORITY_COLORS[priority as keyof typeof JOB_PRIORITY_COLORS] || '#6B7280';
  };

  const formatTime = (time: string): string => {
    return new Date(time).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderJobItem = ({ item: job }: { item: Job }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
    >
      <Card style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={styles.jobInfo}>
            <Text style={styles.customerName}>{job.customer.name}</Text>
            <Text style={styles.serviceType}>{job.service.type}</Text>
          </View>
          <View style={styles.jobMeta}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
              <Text style={styles.statusText}>{job.status.toUpperCase()}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(job.priority) }]}>
              <Text style={styles.priorityText}>{job.priority.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <Text style={styles.locationText}>📍 {job.location.address}</Text>
          <Text style={styles.timeText}>
            🕐 {formatTime(job.time_window.start)} - {formatTime(job.time_window.end)}
          </Text>
          <Text style={styles.durationText}>
            ⏱️ {job.service.estimated_duration} minutes
          </Text>
          {job.service.special_instructions && (
            <Text style={styles.instructionsText}>
              📝 {job.service.special_instructions}
            </Text>
          )}
        </View>

        <View style={styles.jobActions}>
          <Text style={styles.tapHint}>Tap for details</Text>
          {job.status === 'scheduled' && (
            <Button
              title="Start Job"
              onPress={(e) => {
                e.stopPropagation();
                handleStartJob(job);
              }}
              loading={isStartingJob}
              size="small"
            />
          )}
          {job.status === 'in_progress' && (
            <Button
              title="Complete Job"
              onPress={(e) => {
                e.stopPropagation();
                handleCompleteJob(job);
              }}
              loading={isCompletingJob}
              size="small"
              variant="secondary"
            />
          )}
          {job.status === 'completed' && (
            <Text style={styles.completedText}>✅ Job Completed</Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Jobs Today</Text>
      <Text style={styles.emptyStateText}>
        You don't have any jobs scheduled for today.
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorTitle}>Error Loading Jobs</Text>
      <Text style={styles.errorText}>
        {jobsError?.message || 'Failed to load jobs. Please try again.'}
      </Text>
      <Button
        title="Retry"
        onPress={() => refetchJobs()}
        variant="secondary"
      />
    </View>
  );

  if (jobsError) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Jobs</Text>
        <Text style={styles.headerSubtitle}>
          Welcome back, {user?.name || 'Technician'}
        </Text>
        <SyncStatus style={styles.syncStatus} />
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingJobs}
            onRefresh={refetchJobs}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={!isLoadingJobs ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 12,
  },
  syncStatus: {
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    marginBottom: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  jobDetails: {
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tapHint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default JobsScreen;
