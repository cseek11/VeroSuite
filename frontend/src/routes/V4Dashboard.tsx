import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import V4Layout from '@/components/layout/V4Layout';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Star, 
  Plus, 
  Route, 
  Phone, 
  Mail, 
  MessageCircle,
  Shield,
  Bug,
  Home,
  Mouse,
  AlertTriangle,
  Check,
  TrendingUp
} from 'lucide-react';

// Mock data - will be replaced with real API calls
const mockKPIs = [
  {
    id: 'revenue',
    label: "Today's Revenue",
    value: "$18,240",
    change: "+12.5%",
    changeType: 'positive',
    icon: DollarSign,
    iconColor: 'text-purple-500'
  },
  {
    id: 'jobs',
    label: "Jobs Completed",
    value: "47/52",
    change: "90.4% completion rate",
    changeType: 'positive',
    icon: CheckCircle,
    iconColor: 'text-green-500'
  },
  {
    id: 'ar',
    label: "AR Aging",
    value: "$12,670",
    change: "+8.3% overdue",
    changeType: 'negative',
    icon: Clock,
    iconColor: 'text-orange-500'
  },
  {
    id: 'satisfaction',
    label: "Customer Satisfaction",
    value: "4.8/5.0",
    change: "+0.2 this month",
    changeType: 'positive',
    icon: Star,
    iconColor: 'text-yellow-500'
  }
];

const mockJobs = [
  {
    id: 1,
    customer: "Johnson Family Residence",
    service: "General Pest Control",
    time: "9:00 AM",
    technician: "A. Davis",
    status: "scheduled",
    agreements: ["general", "mosquito"],
    overdue: false
  },
  {
    id: 2,
    customer: "Acme Corporation",
    service: "Termite Inspection",
    time: "10:30 AM",
    technician: null,
    status: "overdue",
    agreements: ["termite"],
    overdue: true,
    overdueDays: 2
  },
  {
    id: 3,
    customer: "Maria Lopez",
    service: "Rodent Control",
    time: "8:00 AM",
    technician: "B. Patel",
    status: "completed",
    agreements: ["rodent"],
    overdue: false
  }
];

const mockActivityFeed = [
  {
    id: 1,
    type: 'payment',
    message: 'Payment received from Johnson Family',
    amount: '$156.00',
    time: '2 minutes ago',
    color: 'bg-green-500'
  },
  {
    id: 2,
    type: 'job',
    message: 'New job scheduled for Acme Corp',
    detail: 'Termite inspection',
    time: '5 minutes ago',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    type: 'complaint',
    message: 'Customer complaint logged',
    detail: 'Maria Lopez',
    time: '15 minutes ago',
    color: 'bg-orange-500'
  },
  {
    id: 4,
    type: 'route',
    message: 'Route optimized for today',
    detail: 'Saved 23 minutes',
    time: '1 hour ago',
    color: 'bg-purple-500'
  }
];

const agreementIcons = {
  general: { icon: Shield, color: 'bg-green-500' },
  mosquito: { icon: Bug, color: 'bg-purple-500' },
  termite: { icon: Home, color: 'bg-red-500' },
  rodent: { icon: Mouse, color: 'bg-orange-500' }
};

export default function V4Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleAddJob = () => {
    navigate('/jobs/new');
  };

  const handleOptimizeRoute = () => {
    navigate('/routing');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500';
      case 'overdue': return 'border-red-500';
      case 'scheduled': return 'border-blue-500';
      default: return 'border-gray-300';
    }
  };

  const getStatusBadge = (status: string, technician: string | null) => {
    if (status === 'overdue') {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Unassigned</span>;
    }
    if (status === 'completed') {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{technician}</span>;
    }
    return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{technician}</span>;
  };

     return (
     <V4Layout>
       <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Overview of your pest control operations</p>
          </div>
          <div className="flex gap-3">
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
              onClick={handleAddJob}
            >
              <Plus className="w-4 h-4" />
              ADD
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors border">
              VERO PEST 2.1k
            </button>
          </div>
        </div>

                 {/* KPIs Grid */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {mockKPIs.map((kpi) => {
            const Icon = kpi.icon;
            return (
                             <div key={kpi.id} className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">{kpi.label}</div>
                  <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                </div>
                                 <div className="text-xl font-bold text-gray-800">{kpi.value}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {kpi.change}
                </div>
              </div>
            );
          })}
        </div>

                 {/* Main Content Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Today's Schedule */}
                                <div className="lg:col-span-2 bg-white/90 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
             <div className="p-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                    onClick={handleAddJob}
                  >
                    <Plus className="w-3 h-3" />
                    Add Job
                  </button>
                  <button 
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors flex items-center gap-1"
                    onClick={handleOptimizeRoute}
                  >
                    <Route className="w-3 h-3" />
                    Optimize Route
                  </button>
                </div>
              </div>
                         </div>
                           <div className="p-2">
                <div 
                  className="space-y-1 max-h-64"
                  style={{
                    marginRight: '15px',
                    scrollbarGutter: 'stable',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: '8px',
                    msOverflowStyle: 'none'
                  }}
                >
                  {mockJobs.map((job) => (
                                     <div 
                     key={job.id}
                     className={`bg-white rounded-lg border border-gray-200 p-1 hover:shadow-md transition-all cursor-pointer ${
                       getStatusColor(job.status)
                     } border-l-4`}
                   >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {job.agreements.map((agreement) => {
                            const { icon: Icon, color } = agreementIcons[agreement as keyof typeof agreementIcons];
                            return (
                              <span key={agreement} className={`w-3.5 h-3.5 rounded-full ${color} flex items-center justify-center`}>
                                <Icon className="w-2 h-2 text-white" />
                              </span>
                            );
                          })}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{job.customer}</div>
                          <div className="text-sm text-gray-600">{job.service} • {job.time}</div>
                          {job.overdue && (
                            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Overdue by {job.overdueDays} days
                            </div>
                          )}
                          {job.status === 'completed' && (
                            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Completed
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status, job.technician)}
                        <div className="flex gap-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                                         <div className="mt-1 pt-1 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Activities
                          {job.status === 'overdue' && (
                            <span className="bg-red-100 text-red-700 px-1 rounded ml-1">1</span>
                          )}
                          {job.status === 'completed' && (
                            <span className="bg-green-100 text-green-700 px-1 rounded ml-1">2</span>
                          )}
                        </div>
                        <button className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
                     {/* Activity Feed */}
                     <div className="bg-white/50 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="p-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Activity Feed</h3>
            </div>
                                      <div className="p-2">
               <div 
                 className="space-y-1 max-h-64"
                 style={{
                   marginRight: '15px',
                   scrollbarGutter: 'stable',
                   overflowY: 'auto',
                   overflowX: 'hidden',
                   scrollbarWidth: '8px',
                   msOverflowStyle: 'none'
                 }}
               >
                 {mockActivityFeed.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`}></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800">{activity.message}</div>
                      <div className="text-xs text-gray-500">
                        {activity.amount && `${activity.amount} • `}
                        {activity.detail && `${activity.detail} • `}
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </V4Layout>
  );
}
