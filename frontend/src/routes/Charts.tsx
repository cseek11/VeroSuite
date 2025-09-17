import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Clock, Target,
  Download, Calendar, Filter, ChevronDown, Plus, AlertTriangle,
  CheckCircle, XCircle, BarChart3, PieChart as PieChartIcon,
  Activity, UserCheck, Mail, Phone, Globe, Search
} from 'lucide-react';

// Real data will be fetched from API
import { enhancedApi } from '@/lib/enhanced-api';

const COLORS = {
  primary: '#6366F1',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  gray: '#6B7280',
  indigo: '#6366F1',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#EF4444',
  violet: '#8B5CF6'
};

// Default data structure for charts
const defaultData = {
  kpis: {
    revenue: 0,
    pipeline: 0,
    newCustomers: 0,
    retention: 0,
    avgCloseDays: 0,
    deltas: { revenue: 0, pipeline: 0, newCustomers: 0, retention: 0 }
  },
  sales: {
    revenueTrend: [],
    dealsByRep: [],
    funnel: []
  },
  support: {
    tickets: [],
    resolutionTrend: [],
    topIssues: []
  },
  customers: {
    segments: [],
    nps: 0,
    atRisk: 0
  },
  marketing: {
    leadSources: [],
    topCampaign: { name: '', roas: 0 },
    cpa: 0
  }
};

const ChartsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [teamFilter, setTeamFilter] = useState('all');
  const [exportFormat, setExportFormat] = useState('csv');

  // Fetch analytics data from API
  const { data: analyticsData = defaultData, isLoading } = useQuery({
    queryKey: ['analytics', dateRange, teamFilter],
    queryFn: async () => {
      // TODO: Replace with actual API calls when analytics endpoints are available
      // For now, return default empty data structure
      return defaultData;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getDeltaIcon = (delta: number) => {
    return delta >= 0 ? (
      <TrendingUp className="h-4 w-4 text-emerald-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-rose-600" />
    );
  };

  const getDeltaColor = (delta: number) => {
    return delta >= 0 ? 'text-emerald-600' : 'text-rose-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header with Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 text-sm">
              Executive insights and performance metrics across all departments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
              <Download className="h-3 w-3" />
              Export
            </button>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm">
              <Plus className="h-3 w-3" />
              New Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-indigo-100 rounded-md">
              <Calendar className="h-3 w-3 text-indigo-600" />
            </div>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-emerald-100 rounded-md">
              <Users className="h-3 w-3 text-emerald-600" />
            </div>
            <select 
              value={teamFilter} 
              onChange={(e) => setTeamFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">All Teams</option>
              <option value="sales">Sales Team</option>
              <option value="support">Support Team</option>
              <option value="marketing">Marketing Team</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        {/* Monthly Revenue */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                {getDeltaIcon(analyticsData.kpis.deltas.revenue)}
                <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md">
                  +{analyticsData.kpis.deltas.revenue}%
                </span>
              </div>
            </div>
            <div className="text-xl font-bold mb-1">
              {formatCurrency(analyticsData.kpis.revenue)}
            </div>
            <div className="text-blue-100 font-medium text-xs">
              Monthly Revenue
            </div>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Target className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                {getDeltaIcon(analyticsData.kpis.deltas.pipeline)}
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-md">
                  {analyticsData.kpis.deltas.pipeline}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatCurrency(analyticsData.kpis.pipeline)}
            </div>
            <div className="text-emerald-100 font-medium text-sm">
              Pipeline Value
            </div>
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                {getDeltaIcon(analyticsData.kpis.deltas.newCustomers)}
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-md">
                  +{analyticsData.kpis.deltas.newCustomers}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">
              {analyticsData.kpis.newCustomers}
            </div>
            <div className="text-violet-100 font-medium text-sm">
              New Customers
            </div>
          </div>
        </div>

        {/* Retention Rate */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <UserCheck className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                {getDeltaIcon(analyticsData.kpis.deltas.retention)}
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-md">
                  +{analyticsData.kpis.deltas.retention}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatPercentage(analyticsData.kpis.retention)}
            </div>
            <div className="text-amber-100 font-medium text-sm">
              Retention Rate
            </div>
          </div>
        </div>

        {/* Avg Time to Close */}
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-emerald-300" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-md">-2 days</span>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">
              {analyticsData.kpis.avgCloseDays}
            </div>
            <div className="text-rose-100 font-medium text-sm">
              Avg. Time to Close
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <div className="text-lg font-bold mb-3">
              Quick Actions
            </div>
            <div className="space-y-2">
              <button className="w-full text-left bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 text-xs font-medium">
                <Plus className="h-3 w-3" />
                New Deal
              </button>
              <button className="w-full text-left bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 text-xs font-medium">
                <AlertTriangle className="h-3 w-3" />
                New Ticket
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Sales & Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Revenue Trend */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="p-1 bg-indigo-100 rounded-md">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              Revenue Trend
            </h2>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.sales.revenueTrend}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                    labelStyle={{ color: '#1E293B', fontWeight: '600' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={COLORS.indigo}
                    fill="url(#revenueGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Deals by Sales Rep */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="p-1 bg-emerald-100 rounded-md">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
              </div>
              Deals by Sales Representative
            </h2>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.sales.dealsByRep}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" angle={-45} textAnchor="end" height={60} fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'deals' ? 'Deals' : 'Value']}
                    labelStyle={{ color: '#1E293B', fontWeight: '600' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Bar dataKey="deals" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="value" fill={COLORS.indigo} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Pipeline */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="p-1 bg-violet-100 rounded-md">
                <Target className="h-4 w-4 text-violet-600" />
              </div>
              Sales Pipeline
            </h2>
            <div className="space-y-3">
              {analyticsData.sales.funnel.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-full shadow-md"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-base font-semibold text-slate-700">
                      {stage.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-xs">
                      <div 
                        className="h-6 rounded-full transition-all duration-500 shadow-md"
                        style={{ 
                          backgroundColor: stage.color,
                          width: `${analyticsData.sales.funnel.length > 0 && analyticsData.sales.funnel[0]?.value > 0 
                            ? (stage.value / analyticsData.sales.funnel[0].value) * 100 
                            : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-lg font-bold text-slate-800 min-w-[70px] text-right">
                      {stage.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-slate-700">Conversion Rate:</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {analyticsData.sales.funnel.length > 0 && analyticsData.sales.funnel[0]?.value > 0 
                      ? ((analyticsData.sales.funnel[analyticsData.sales.funnel.length - 1]?.value / analyticsData.sales.funnel[0].value) * 100).toFixed(1)
                      : '0.0'
                    }%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Support & Service */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="p-1 bg-amber-100 rounded-md">
                <Activity className="h-4 w-4 text-amber-600" />
              </div>
              Support & Service Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Resolution Time Trend</h3>
                <div style={{ width: '100%', height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.support.resolutionTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avg"
                        stroke={COLORS.amber}
                        strokeWidth={3}
                        dot={{ fill: COLORS.amber, strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Ticket Status</h3>
                <div style={{ width: '100%', height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.support.tickets}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={6}
                        dataKey="value"
                      >
                        {analyticsData.support.tickets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Customer Health */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="p-1 bg-emerald-100 rounded-md">
                <UserCheck className="h-4 w-4 text-emerald-600" />
              </div>
              Customer Health
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Customer Segments</h3>
                <div style={{ width: '100%', height: '150px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.customers.segments}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analyticsData.customers.segments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <div className="text-lg font-bold text-emerald-600 mb-1">
                    {analyticsData.customers.nps}
                  </div>
                  <div className="text-xs font-medium text-emerald-700">
                    NPS Score
                  </div>
                </div>
                <div className="text-center p-2 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg border border-rose-200">
                  <div className="text-lg font-bold text-rose-600 mb-1">
                    {analyticsData.customers.atRisk}
                  </div>
                  <div className="text-xs font-medium text-rose-700">
                    At Risk
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Performance */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="p-1 bg-violet-100 rounded-md">
                <BarChart3 className="h-4 w-4 text-violet-600" />
              </div>
              Marketing Performance
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Lead Sources</h3>
                <div style={{ width: '100%', height: '150px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.marketing.leadSources} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis type="number" stroke="#64748B" fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke="#64748B" width={70} fontSize={10} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Bar dataKey="value" fill={COLORS.indigo} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg border border-violet-200">
                  <div className="text-2xl font-bold text-violet-600 mb-1">
                    {analyticsData.marketing.topCampaign.roas}x
                  </div>
                  <div className="text-xs font-medium text-violet-700">
                    Top Campaign ROAS
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    ${analyticsData.marketing.cpa}
                  </div>
                  <div className="text-xs font-medium text-indigo-700">
                    Avg. CPA
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Drilldowns */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="p-1 bg-slate-100 rounded-md">
                <Search className="h-4 w-4 text-slate-600" />
              </div>
              Quick Drilldowns
            </h2>
            <div className="space-y-2">
                              <button className="w-full text-left bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-200 text-rose-700 px-2 py-1.5 rounded-lg hover:from-rose-100 hover:to-rose-200 transition-all duration-200 flex items-center gap-2 font-medium text-xs">
                  <XCircle className="h-3 w-3" />
                  Lost Deals Analysis
                </button>
                <button className="w-full text-left bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-amber-700 px-2 py-1.5 rounded-lg hover:from-amber-100 hover:to-amber-200 transition-all duration-200 flex items-center gap-2 font-medium text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  At-risk Customers
                </button>
                <button className="w-full text-left bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-700 px-2 py-1.5 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200 flex items-center gap-2 font-medium text-xs">
                  <Download className="h-3 w-3" />
                  Export Detailed Report
                </button>
                <button className="w-full text-left bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-200 text-violet-700 px-2 py-1.5 rounded-lg hover:from-violet-100 hover:to-violet-200 transition-all duration-200 flex items-center gap-2 font-medium text-xs">
                  <BarChart3 className="h-3 w-3" />
                  Performance Comparison
                </button>
                <button className="w-full text-left bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 px-2 py-1.5 rounded-lg hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 flex items-center gap-2 font-medium text-xs">
                  <TrendingUp className="h-3 w-3" />
                  Growth Opportunities
                </button>
            </div>
            
            {/* Top Issues List */}
            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-700 mb-3">Top Support Issues</h3>
              <div className="space-y-2">
                {analyticsData.support.topIssues.slice(0, 3).map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
                    <span className="text-sm font-medium text-slate-700">{issue.issue}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      issue.priority === 'high' ? 'bg-rose-100 text-rose-800' : 
                      issue.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {issue.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
