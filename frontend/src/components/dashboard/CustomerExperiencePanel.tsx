import React from 'react';
import Card from '@/components/ui/Card';
import {
  Badge,
  Heading,
  Text,
} from '@/components/ui';
import { Users, Star, MessageCircle, TrendingUp, Heart, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';

const CustomerExperiencePanel: React.FC = () => {
  // Fetch customer metrics from API
  const { data: customerMetrics = {
    totalCustomers: 0,
    satisfactionScore: 0,
    responseTime: '0 hours',
    retentionRate: 0,
    complaints: 0,
    testimonials: 0
  }, isLoading: _isLoading } = useQuery({
    queryKey: ['customer', 'experience-metrics'],
    queryFn: () => enhancedApi.customers.getExperienceMetrics(),
  });

  // Fetch recent feedback from API
  const { data: recentFeedback = [] } = useQuery({
    queryKey: ['customer', 'recent-feedback'],
    queryFn: () => enhancedApi.customers.getRecentFeedback(),
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800';
    if (rating >= 3.5) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Customer Metrics Overview */}
      <Card title="Customer Experience Overview">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Users className="mx-auto h-8 w-8 text-blue-500 mb-2" />
            <Heading level={3} className="font-bold text-blue-600">
              {customerMetrics.totalCustomers.toLocaleString()}
            </Heading>
            <Text variant="small" className="text-gray-600">
              Total Customers
            </Text>
          </div>

          <div className="text-center">
            <Star className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <Heading level={3} className="font-bold text-yellow-600">
              {customerMetrics.satisfactionScore}
            </Heading>
            <Text variant="small" className="text-gray-600">
              Satisfaction Score
            </Text>
          </div>

          <div className="text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <Heading level={3} className="font-bold text-green-600">
              {customerMetrics.retentionRate}%
            </Heading>
            <Text variant="small" className="text-gray-600">
              Retention Rate
            </Text>
          </div>
        </div>
      </Card>

      {/* Response Time & Complaints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Response Metrics">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <Text variant="body">Average Response Time</Text>
              </div>
              <Text variant="body" className="font-medium">
                {customerMetrics.responseTime}
              </Text>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <Text variant="body">Open Complaints</Text>
              </div>
              <Text variant="body" className="font-medium text-red-600">
                {customerMetrics.complaints}
              </Text>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-green-500" />
                <Text variant="body">Testimonials</Text>
              </div>
              <Text variant="body" className="font-medium text-green-600">
                {customerMetrics.testimonials}
              </Text>
            </div>
          </div>
        </Card>

        <Card title="Satisfaction Trend">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Text variant="body">Overall Satisfaction</Text>
              <Badge variant="default" className={getRatingColor(customerMetrics.satisfactionScore)}>
                {customerMetrics.satisfactionScore}/5.0
              </Badge>
            </div>
            
            <div className="flex items-center space-x-1 mb-2">
              {renderStars(customerMetrics.satisfactionScore)}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  customerMetrics.satisfactionScore >= 4.5 ? 'bg-green-500' :
                  customerMetrics.satisfactionScore >= 3.5 ? 'bg-blue-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${(customerMetrics.satisfactionScore / 5) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 text-center">
              {Math.round((customerMetrics.satisfactionScore / 5) * 100)}%
            </div>

            <div className="text-center pt-2">
              <Text variant="small" className="text-gray-600">
                Based on {customerMetrics.testimonials} reviews
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Customer Feedback */}
      <Card title="Recent Customer Feedback">
        <div className="space-y-4">
          {recentFeedback.map((feedback) => (
            <div key={feedback.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <Text variant="body" className="font-medium">
                  {feedback.customer}
                </Text>
                <div className="flex items-center space-x-1">
                  {renderStars(feedback.rating)}
                </div>
              </div>
              
              <Text variant="small" className="text-gray-600 mb-2">
                "{feedback.comment}"
              </Text>
              
              <Text variant="small" className="text-gray-400">
                {new Date(feedback.date).toLocaleDateString()}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CustomerExperiencePanel;

