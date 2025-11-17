import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';
import { CacheService } from '../common/services/cache.service';
import { WebSocketGateway } from '../websocket/websocket.gateway';
import { CreateKPIDto, UpdateKPIDto, KPIResponseDto, KPIDataResponseDto, KPITrendResponseDto, KPICategory } from './dto';

@Injectable()
export class KPIsService {
  private readonly logger = new Logger(KPIsService.name);
  private readonly broadcastThrottle = new Map<string, number>();
  private readonly BROADCAST_THROTTLE_MS = 5000; // 5 seconds minimum between broadcasts

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly cacheService: CacheService,
    private readonly websocketGateway: WebSocketGateway
  ) {}

  async createKPI(tenantId: string, userId: string, createKPIDto: CreateKPIDto): Promise<KPIResponseDto> {
    const supabase = this.supabaseService.getClient();

    const kpiData = {
      name: createKPIDto.name,
      description: createKPIDto.description,
      template_id: createKPIDto.templateId, // Store template ID for tracking
      formula_expression: createKPIDto.formulaExpression || 'SUM(value)', // Use provided formula or default
      formula_fields: createKPIDto.formulaFields || [], // Use provided fields or default empty array
      threshold_config: createKPIDto.threshold,
      chart_config: {
        type: 'number',
        colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
      },
      data_source_config: {
        table: 'jobs', // Default table
        timeRange: 'created_at'
      },
      is_active: createKPIDto.enabled ?? true,
      tenant_id: tenantId,
      user_id: userId
    };

    const { data, error } = await supabase
      .from('user_kpis')
      .insert([kpiData])
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Failed to create KPI: ${error.message}`);
    }

    // Invalidate cache for this tenant
    await this.cacheService.invalidateKPICache(tenantId);

    return this.mapToResponseDto(data);
  }

  async getKPIs(tenantId: string): Promise<KPIResponseDto[]> {
    // Try to get from cache first
    const cachedKPIs = await this.cacheService.getKPIConfigs<KPIResponseDto[]>(tenantId);
    if (cachedKPIs && Array.isArray(cachedKPIs)) {
      this.logger.debug(`KPI configs served from cache for tenant: ${tenantId}`);
      return cachedKPIs;
    }

    // Cache miss - fetch from database
    this.logger.debug(`KPI configs cache miss for tenant: ${tenantId}, fetching from database`);
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('kpi_configs')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('enabled', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(`Failed to fetch KPIs: ${error.message}`);
    }

    const kpiConfigs = data.map(this.mapToResponseDto);
    
    // Cache the result
    await this.cacheService.setKPIConfigs(tenantId, kpiConfigs);
    
    return kpiConfigs;
  }

  async getKPI(tenantId: string, kpiId: string): Promise<KPIResponseDto> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('kpi_configs')
      .select('*')
      .eq('id', kpiId)
      .eq('tenant_id', tenantId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException('KPI not found');
      }
      throw new BadRequestException(`Failed to fetch KPI: ${error.message}`);
    }

    return this.mapToResponseDto(data);
  }

  // Return current user's saved KPIs (user_kpis table)
  async getUserKPIs(tenantId: string, userId: string): Promise<any[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('user_kpis')
      .select(`
        *
      `)
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(`Failed to fetch user KPIs: ${error.message}`);
    }

    return data || [];
  }

  async updateKPI(tenantId: string, kpiId: string, updateKPIDto: UpdateKPIDto): Promise<KPIResponseDto> {
    const supabase = this.supabaseService.getClient();

    const updateData = {
      ...updateKPIDto,
      drill_down: updateKPIDto.drillDown,
      real_time: updateKPIDto.realTime,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('kpi_configs')
      .update(updateData)
      .eq('id', kpiId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException('KPI not found');
      }
      throw new BadRequestException(`Failed to update KPI: ${error.message}`);
    }

    // Invalidate cache for this tenant
    await this.cacheService.invalidateKPICache(tenantId);

    return this.mapToResponseDto(data);
  }

  async deleteKPI(tenantId: string, kpiId: string): Promise<void> {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('kpi_configs')
      .delete()
      .eq('id', kpiId)
      .eq('tenant_id', tenantId);

    if (error) {
      throw new BadRequestException(`Failed to delete KPI: ${error.message}`);
    }

    // Invalidate cache for this tenant
    await this.cacheService.invalidateKPICache(tenantId);
  }

  // NEW: Batch KPI data fetching for dashboard performance
  async getBatchKPIData(tenantId: string, kpiIds: string[]): Promise<Record<string, KPIDataResponseDto[]>> {
    // Try to get from batch cache first
    const cachedData = await this.cacheService.getBatchKPIData<Record<string, KPIDataResponseDto[]>>(tenantId, kpiIds);
    if (cachedData && typeof cachedData === 'object' && Object.keys(cachedData).length > 0) {
      this.logger.debug(`Batch KPI data served from cache for tenant: ${tenantId}, kpis: ${kpiIds.length}`);
      return cachedData;
    }

    // Cache miss - fetch all KPIs from database in parallel
    this.logger.debug(`Batch KPI data cache miss for tenant: ${tenantId}, fetching ${kpiIds.length} KPIs from database`);
    
    const results: Record<string, KPIDataResponseDto[]> = {};
    const uncachedKpis: string[] = [];
    
    // Check which KPIs are not in cache
    for (const kpiId of kpiIds) {
      const cached = await this.cacheService.getKPIData<KPIDataResponseDto[]>(tenantId, kpiId);
      if (cached && Array.isArray(cached)) {
        results[kpiId] = cached;
      } else {
        uncachedKpis.push(kpiId);
      }
    }

    // Fetch uncached KPIs in parallel
    if (uncachedKpis.length > 0) {
      const fetchPromises = uncachedKpis.map(kpiId => this.getKPIData(tenantId, kpiId));
      const fetchedResults = await Promise.all(fetchPromises);
      
      uncachedKpis.forEach((kpiId, index) => {
        const result = fetchedResults[index];
        if (result) {
          results[kpiId] = result;
        }
      });
    }

    // Cache the batch results
    await this.cacheService.setBatchKPIData(tenantId, results);
    return results;
  }

  async getKPIData(tenantId: string, kpiId?: string): Promise<KPIDataResponseDto[]> {
    // Try to get from cache first
    if (kpiId) {
      const cachedData = await this.cacheService.getKPIData<KPIDataResponseDto[]>(tenantId, kpiId);
      if (cachedData && Array.isArray(cachedData)) {
        this.logger.debug(`KPI data served from cache for tenant: ${tenantId}, kpi: ${kpiId}`);
        return cachedData;
      }
    }

    // Cache miss - fetch from database
    this.logger.debug(`KPI data cache miss for tenant: ${tenantId}, kpi: ${kpiId || 'all'}, fetching from database`);
    const supabase = this.supabaseService.getClient();

    // Get KPI configurations
    const { data: configs, error: configError } = await supabase
      .from('kpi_configs')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('enabled', true);

    if (configError) {
      throw new BadRequestException(`Failed to fetch KPI configs: ${configError.message}`);
    }

    const results: KPIDataResponseDto[] = [];

    for (const config of configs) {
      if (kpiId && config.id !== kpiId) continue;

      let calculatedValue = 0;
      const currentTime = new Date().toISOString();

      try {
        // Calculate real-time values based on KPI name
        switch (config.name) {
          case 'Jobs Completed Today':
            calculatedValue = await this.calculateJobsCompletedToday(supabase, tenantId);
            break;
          case 'Daily Revenue':
            calculatedValue = await this.calculateDailyRevenue(supabase, tenantId);
            break;
          case 'Customer Satisfaction':
            calculatedValue = await this.calculateCustomerSatisfaction(supabase, tenantId);
            break;
          case 'Cancellation Rate':
            calculatedValue = await this.calculateCancellationRate(supabase, tenantId);
            break;
          default:
            // Fallback to stored data if available
            const { data: storedData } = await supabase
              .from('kpi_data')
              .select('*')
              .eq('kpi_id', config.id)
              .eq('tenant_id', tenantId)
              .order('timestamp', { ascending: false })
              .limit(1)
              .single();
            
            calculatedValue = storedData?.value || 0;
        }

        // Store the calculated value
        await this.storeKPIData(supabase, config.id, config.name, calculatedValue, tenantId);

            results.push({
              id: config.id,
              metric: config.name,
              value: calculatedValue,
              timestamp: currentTime,
              metadata: {
                calculated: true,
                source: 'real-time'
              }
            });

            // Check for threshold alerts
            await this.checkThresholdAlert(tenantId, config, calculatedValue);

      } catch (error) {
        console.error(`Error calculating KPI ${config.name}:`, error);
        // Fallback to stored data
        const { data: storedData } = await supabase
          .from('kpi_data')
          .select('*')
          .eq('kpi_id', config.id)
          .eq('tenant_id', tenantId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (storedData) {
          results.push({
            id: config.id,
            metric: config.name,
            value: storedData.value,
            timestamp: storedData.timestamp,
            metadata: {
              calculated: false,
              source: 'stored',
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          });
        }
      }
    }

    // Cache the results
    if (kpiId) {
      await this.cacheService.setKPIData(tenantId, results, kpiId);
    }
    
    // Throttled broadcast to prevent spam
    const throttleKey = `${tenantId}:${kpiId || 'all'}`;
    const lastBroadcast = this.broadcastThrottle.get(throttleKey) || 0;
    const now = Date.now();
    
    if (now - lastBroadcast > this.BROADCAST_THROTTLE_MS) {
      this.broadcastThrottle.set(throttleKey, now);
      await this.websocketGateway.broadcastKPIUpdate(tenantId, {
        tenantId,
        ...(kpiId && { kpiId }),
        data: results,
        timestamp: new Date().toISOString(),
      });
    }
    
    return results;
  }

  async getKPITrends(tenantId: string, period: string = '24h'): Promise<KPITrendResponseDto[]> {
    // Try to get from cache first
    const cachedTrends = await this.cacheService.getKPITrends<KPITrendResponseDto[]>(tenantId, period);
    if (cachedTrends && Array.isArray(cachedTrends)) {
      this.logger.debug(`KPI trends served from cache for tenant: ${tenantId}, period: ${period}`);
      return cachedTrends;
    }

    // Cache miss - fetch from database
    this.logger.debug(`KPI trends cache miss for tenant: ${tenantId}, period: ${period}, fetching from database`);
    const supabase = this.supabaseService.getClient();

    // Calculate time range based on period
    const now = new Date();
    let startTime: Date;

    switch (period) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const { data, error } = await supabase
      .from('kpi_data')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('timestamp', startTime.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      throw new BadRequestException(`Failed to fetch KPI trends: ${error.message}`);
    }

    // Group data by metric and calculate trends
    const trendsMap = new Map<string, KPITrendResponseDto>();

    data.forEach(item => {
      if (!trendsMap.has(item.metric)) {
        trendsMap.set(item.metric, {
          metric: item.metric,
          values: [],
          trend: 'stable',
          trendValue: 0,
          period
        });
      }

      trendsMap.get(item.metric)!.values.push({
        timestamp: item.timestamp,
        value: item.value
      });
    });

    // Calculate trend direction and percentage for each metric
    trendsMap.forEach((trend) => {
      if (trend.values.length >= 2) {
        const firstValue = trend.values[0]?.value;
        const lastValue = trend.values[trend.values.length - 1]?.value;
        
        if (firstValue === undefined || lastValue === undefined) return;
        
        const change = lastValue - firstValue;
        const percentage = firstValue !== 0 ? (change / firstValue) * 100 : 0;

        trend.trendValue = Math.round(percentage * 100) / 100;
        
        if (percentage > 5) {
          trend.trend = 'up';
        } else if (percentage < -5) {
          trend.trend = 'down';
        } else {
          trend.trend = 'stable';
        }
      }
    });

    const trends = Array.from(trendsMap.values());
    
    // Cache the results
    await this.cacheService.setKPITrends(tenantId, period, trends);
    
    return trends;
  }

  // Helper method to store KPI data
  private async storeKPIData(supabase: any, kpiId: string, metric: string, value: number, tenantId: string): Promise<void> {
    const { error } = await supabase
      .from('kpi_data')
      .insert({
        kpi_id: kpiId,
        metric: metric,
        value: value,
        tenant_id: tenantId,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing KPI data:', error);
    }
  }

  // Calculate Jobs Completed Today
  private async calculateJobsCompletedToday(supabase: any, tenantId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('jobs')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('status', 'completed')
      .gte('actual_end_time', today.toISOString())
      .lt('actual_end_time', tomorrow.toISOString());

    if (error) {
      console.error('Error calculating jobs completed today:', error);
      return 0;
    }

    return data?.length || 0;
  }

  // Calculate Daily Revenue
  private async calculateDailyRevenue(supabase: any, tenantId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('service_history')
      .select('cost')
      .eq('tenant_id', tenantId)
      .eq('status', 'completed')
      .gte('service_date', today.toISOString().split('T')[0])
      .lt('service_date', tomorrow.toISOString().split('T')[0]);

    if (error) {
      console.error('Error calculating daily revenue:', error);
      return 0;
    }

    return data?.reduce((sum: number, item: any) => sum + (parseFloat(item.cost) || 0), 0) || 0;
  }

  // Calculate Customer Satisfaction (mock for now - would need customer feedback table)
  private async calculateCustomerSatisfaction(supabase: any, tenantId: string): Promise<number> {
    // For now, return a mock value based on recent service history
    const { data, error } = await supabase
      .from('service_history')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('status', 'completed')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .limit(100);

    if (error) {
      console.error('Error calculating customer satisfaction:', error);
      return 4.0; // Default value
    }

    // Mock calculation: base 4.0 + some variation based on recent activity
    const recentServices = data?.length || 0;
    const satisfactionScore = 4.0 + (recentServices > 50 ? 0.3 : recentServices > 20 ? 0.1 : 0);
    return Math.min(5.0, Math.max(1.0, satisfactionScore));
  }

  // Calculate Cancellation Rate
  private async calculateCancellationRate(supabase: any, tenantId: string): Promise<number> {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get total jobs in last 30 days
    const { data: totalJobs, error: totalError } = await supabase
      .from('jobs')
      .select('id')
      .eq('tenant_id', tenantId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (totalError) {
      console.error('Error calculating total jobs:', totalError);
      return 0;
    }

    // Get cancelled jobs in last 30 days
    const { data: cancelledJobs, error: cancelledError } = await supabase
      .from('jobs')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('status', 'cancelled')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (cancelledError) {
      console.error('Error calculating cancelled jobs:', cancelledError);
      return 0;
    }

    const total = totalJobs?.length || 0;
    const cancelled = cancelledJobs?.length || 0;

    if (total === 0) return 0;

    return (cancelled / total) * 100;
  }

  async getDrillDownData(tenantId: string, kpiId: string, filters: Record<string, any>): Promise<any> {
    const kpi = await this.getKPI(tenantId, kpiId);
    
    // Real drill-down data based on KPI name and category
    switch (kpi.name) {
      case 'Jobs Completed Today':
        return await this.getJobsCompletedDrillDown(tenantId, filters);
      case 'Daily Revenue':
        return await this.getDailyRevenueDrillDown(tenantId, filters);
      case 'Customer Satisfaction':
        return await this.getCustomerSatisfactionDrillDown(tenantId, filters);
      case 'Cancellation Rate':
        return await this.getCancellationRateDrillDown(tenantId, filters);
      default:
        // Fallback to category-based drill-down
        switch (kpi.category) {
          case KPICategory.FINANCIAL:
            return await this.getFinancialDrillDownData(tenantId, filters);
          case KPICategory.OPERATIONAL:
            return await this.getOperationalDrillDownData(tenantId, filters);
          case KPICategory.CUSTOMER:
            return await this.getCustomerDrillDownData(tenantId, filters);
          case KPICategory.COMPLIANCE:
            return await this.getComplianceDrillDownData(tenantId, filters);
          default:
            return { data: [], message: 'No drill-down data available' };
        }
    }
  }

  // Real drill-down methods
  private async getJobsCompletedDrillDown(tenantId: string, _filters: Record<string, any>): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        id,
        status,
        actual_start_time,
        actual_end_time,
        completion_notes,
        accounts!inner(name),
        technician_id
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'completed')
      .gte('actual_end_time', today.toISOString())
      .lt('actual_end_time', tomorrow.toISOString())
      .order('actual_end_time', { ascending: false });

    if (error) {
      console.error('Error fetching jobs completed drill-down:', error);
      return { data: [], message: 'Error fetching data' };
    }

    return {
      title: 'Jobs Completed Today',
      description: 'Detailed breakdown of completed jobs',
      data: data?.map(job => ({
        id: job.id,
        customer: (job.accounts as any)?.name || 'Unknown',
        completed_at: job.actual_end_time,
        duration: this.calculateJobDuration(job.actual_start_time, job.actual_end_time),
        technician: job.technician_id,
        notes: job.completion_notes || 'No notes'
      })) || []
    };
  }

  private async getDailyRevenueDrillDown(tenantId: string, _filters: Record<string, any>): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('service_history')
      .select(`
        id,
        cost,
        service_type,
        service_date,
        technician_id,
        accounts!inner(name)
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'completed')
      .gte('service_date', today.toISOString().split('T')[0])
      .lt('service_date', tomorrow.toISOString().split('T')[0])
      .order('service_date', { ascending: false });

    if (error) {
      console.error('Error fetching daily revenue drill-down:', error);
      return { data: [], message: 'Error fetching data' };
    }

    return {
      title: 'Daily Revenue Breakdown',
      description: 'Detailed breakdown of today\'s revenue by service',
      data: data?.map(service => ({
        id: service.id,
        customer: (service.accounts as any)?.name || 'Unknown',
        service_type: service.service_type,
        cost: parseFloat(service.cost) || 0,
        date: service.service_date,
        technician: service.technician_id
      })) || []
    };
  }

  private async getCustomerSatisfactionDrillDown(tenantId: string, _filters: Record<string, any>): Promise<any> {
    const supabase = this.supabaseService.getClient();
    
    // Get recent service history to simulate customer satisfaction data
    const { data, error } = await supabase
      .from('service_history')
      .select(`
        id,
        service_date,
        service_type,
        cost,
        accounts!inner(name)
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'completed')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching customer satisfaction drill-down:', error);
      return { data: [], message: 'Error fetching data' };
    }

    return {
      title: 'Customer Satisfaction Details',
      description: 'Recent service history and customer interactions',
      data: data?.map(service => ({
        id: service.id,
        customer: (service.accounts as any)?.name || 'Unknown',
        service_type: service.service_type,
        service_date: service.service_date,
        cost: parseFloat(service.cost) || 0,
        // Mock satisfaction score based on service type and recency
        satisfaction_score: this.calculateMockSatisfactionScore(service.service_type, service.service_date)
      })) || []
    };
  }

  private async getCancellationRateDrillDown(tenantId: string, _filters: Record<string, any>): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        id,
        status,
        scheduled_date,
        created_at,
        accounts!inner(name)
      `)
      .eq('tenant_id', tenantId)
      .in('status', ['cancelled', 'completed', 'in_progress'])
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cancellation rate drill-down:', error);
      return { data: [], message: 'Error fetching data' };
    }

    return {
      title: 'Cancellation Rate Analysis',
      description: 'Job status breakdown over the last 30 days',
      data: data?.map(job => ({
        id: job.id,
        customer: (job.accounts as any)?.name || 'Unknown',
        status: job.status,
        scheduled_date: job.scheduled_date,
        created_at: job.created_at,
        is_cancelled: job.status === 'cancelled'
      })) || []
    };
  }

  // Helper methods for drill-down calculations
  private calculateJobDuration(startTime: string, endTime: string): string {
    if (!startTime || !endTime) return 'Unknown';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  private calculateMockSatisfactionScore(serviceType: string, serviceDate: string): number {
    // Mock calculation based on service type and recency
    const baseScore = 4.0;
    const serviceTypeBonus = serviceType === 'Pest Control' ? 0.2 : serviceType === 'Termite' ? 0.1 : 0;
    const recencyBonus = new Date(serviceDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 0.1 : 0;
    const randomVariation = (Math.random() - 0.5) * 0.4; // ±0.2 variation
    
    return Math.min(5.0, Math.max(1.0, baseScore + serviceTypeBonus + recencyBonus + randomVariation));
  }

  private async getFinancialDrillDownData(_tenantId: string, _filters: Record<string, any>): Promise<any> {
    return {
      title: 'Financial Details',
      description: 'Detailed financial breakdown',
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 10000) + 5000,
        expenses: Math.floor(Math.random() * 5000) + 2000,
        profit: Math.floor(Math.random() * 5000) + 3000,
        service_type: ['Pest Control', 'Termite', 'Wildlife'][i % 3]
      }))
    };
  }

  private async getOperationalDrillDownData(_tenantId: string, _filters: Record<string, any>): Promise<any> {
    return {
      title: 'Operational Details',
      description: 'Detailed operational breakdown',
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        job_id: `JOB-${1000 + i}`,
        technician: `Tech ${i + 1}`,
        status: ['Completed', 'In Progress', 'Scheduled'][i % 3],
        duration: Math.floor(Math.random() * 240) + 60,
        location: `Location ${i + 1}`,
        service_type: ['Inspection', 'Treatment', 'Follow-up'][i % 3]
      }))
    };
  }

  private async getCustomerDrillDownData(_tenantId: string, _filters: Record<string, any>): Promise<any> {
    return {
      title: 'Customer Details',
      description: 'Detailed customer breakdown',
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        customer_name: `Customer ${i + 1}`,
        satisfaction_score: (Math.random() * 2 + 3).toFixed(1),
        last_service: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        service_count: Math.floor(Math.random() * 10) + 1,
        feedback: ['Excellent', 'Good', 'Average', 'Poor'][i % 4]
      }))
    };
  }

  private async getComplianceDrillDownData(_tenantId: string, _filters: Record<string, any>): Promise<any> {
    return {
      title: 'Compliance Details',
      description: 'Detailed compliance breakdown',
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        requirement: `Requirement ${i + 1}`,
        status: ['Compliant', 'Pending', 'Overdue'][i % 3],
        due_date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        completion_date: i % 2 === 0 ? new Date(Date.now() - i * 86400000).toISOString().split('T')[0] : null,
        responsible: `Tech ${i + 1}`
      }))
    };
  }

  // Check for threshold alerts and broadcast if needed
  private async checkThresholdAlert(tenantId: string, config: any, value: number): Promise<void> {
    if (!config.threshold) return;

    const threshold = config.threshold;
    let status: 'warning' | 'critical' | null = null;

    // Determine alert status based on threshold
    if (threshold.warning && value >= threshold.warning) {
      status = 'warning';
    }
    if (threshold.critical && value >= threshold.critical) {
      status = 'critical';
    }

    // If we have an alert, broadcast it
    if (status) {
      await this.websocketGateway.broadcastKPIAlert(tenantId, {
        tenantId,
        kpiId: config.id,
        metric: config.name,
        value,
        threshold: threshold[status] || threshold.warning || threshold.critical,
        status,
        timestamp: new Date().toISOString(),
      });

      this.logger.warn(`KPI threshold alert: ${config.name} = ${value} (${status}) for tenant ${tenantId}`);
    }
  }

  private mapToResponseDto(data: any): KPIResponseDto {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      threshold: data.threshold_config, // Map from database field to response field
      drillDown: data.drill_down,
      realTime: data.real_time,
      enabled: data.is_active, // Map from database field to response field
      tags: data.tags,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      tenant_id: data.tenant_id
    };
  }

}
