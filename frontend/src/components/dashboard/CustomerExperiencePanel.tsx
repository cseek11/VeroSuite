import React from 'react';
import { Card, Typography, Chip, ProgressBar } from '@/components/ui/EnhancedUI';
import { Users, Star, MessageCircle, TrendingUp, Heart, AlertTriangle } from 'lucide-react';

const CustomerExperiencePanel: React.FC = () => {
  // Mock data - would come from API
  const customerMetrics = {
    totalCustomers: 1247,
    satisfactionScore: 4.8,
    responseTime: '2.3 hours',
    retentionRate: 94.2,
    complaints: 3,
    testimonials: 156
  };

  const recentFeedback = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent service! The technician was professional and thorough.',
      date: '2024-01-15'
    },
    {
      id: 2,
      customer: 'Mike Chen',
      rating: 4,
      comment: 'Good work, but arrived 30 minutes late.',
      date: '2024-01-14'
    },
    {
      id: 3,
      customer: 'Lisa Rodriguez',
      rating: 5,
      comment: 'Outstanding customer service and attention to detail.',
      date: '2024-01-13'
    }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'primary';
    return 'warning';
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
            <Typography variant="h3" className="font-bold text-blue-600">
              {customerMetrics.totalCustomers.toLocaleString()}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Total Customers
            </Typography>
          </div>

          <div className="text-center">
            <Star className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <Typography variant="h3" className="font-bold text-yellow-600">
              {customerMetrics.satisfactionScore}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Satisfaction Score
            </Typography>
          </div>

          <div className="text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <Typography variant="h3" className="font-bold text-green-600">
              {customerMetrics.retentionRate}%
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Retention Rate
            </Typography>
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
                <Typography variant="body1">Average Response Time</Typography>
              </div>
              <Typography variant="body1" className="font-medium">
                {customerMetrics.responseTime}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <Typography variant="body1">Open Complaints</Typography>
              </div>
              <Typography variant="body1" className="font-medium text-red-600">
                {customerMetrics.complaints}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-green-500" />
                <Typography variant="body1">Testimonials</Typography>
              </div>
              <Typography variant="body1" className="font-medium text-green-600">
                {customerMetrics.testimonials}
              </Typography>
            </div>
          </div>
        </Card>

        <Card title="Satisfaction Trend">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography variant="body1">Overall Satisfaction</Typography>
              <Chip variant={getRatingColor(customerMetrics.satisfactionScore) as any}>
                {customerMetrics.satisfactionScore}/5.0
              </Chip>
            </div>
            
            <div className="flex items-center space-x-1 mb-2">
              {renderStars(customerMetrics.satisfactionScore)}
            </div>

            <ProgressBar
              value={(customerMetrics.satisfactionScore / 5) * 100}
              color={getRatingColor(customerMetrics.satisfactionScore) as any}
              showLabel
            />

            <div className="text-center pt-2">
              <Typography variant="body2" className="text-gray-600">
                Based on {customerMetrics.testimonials} reviews
              </Typography>
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
                <Typography variant="body1" className="font-medium">
                  {feedback.customer}
                </Typography>
                <div className="flex items-center space-x-1">
                  {renderStars(feedback.rating)}
                </div>
              </div>
              
              <Typography variant="body2" className="text-gray-600 mb-2">
                "{feedback.comment}"
              </Typography>
              
              <Typography variant="caption" className="text-gray-400">
                {new Date(feedback.date).toLocaleDateString()}
              </Typography>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CustomerExperiencePanel;

