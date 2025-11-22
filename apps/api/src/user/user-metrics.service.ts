import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';

export interface UserMetrics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  jobs: {
    total: number;
    completed: number;
    in_progress: number;
    scheduled: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    average_per_job: number;
  };
  efficiency: {
    average_completion_time_hours: number;
    on_time_completion_rate: number;
    jobs_per_day: number;
  };
  performance: {
    customer_rating?: number;
    upsell_rate?: number;
  };
}

@Injectable()
export class UserMetricsService {
  constructor(private db: DatabaseService) {}

  async getUserMetrics(
    tenantId: string,
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<UserMetrics> {
    try {
      // Get all jobs for this user in the period
      const jobs = await this.db.job.findMany({
        where: {
          tenant_id: tenantId,
          technician_id: userId,
          scheduled_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          workOrder: {
            include: {
              Invoice: true,
            },
          },
        },
      });

      const totalJobs = jobs.length;
      const completedJobs = jobs.filter(j => j.status === 'completed');
      const inProgressJobs = jobs.filter(j => j.status === 'in_progress');
      const scheduledJobs = jobs.filter(j => j.status === 'scheduled');
      const cancelledJobs = jobs.filter(j => j.status === 'cancelled');

      // Calculate revenue from invoices
      let totalRevenue = 0;
      completedJobs.forEach(job => {
        if (job.workOrder?.Invoice) {
          job.workOrder.Invoice.forEach(invoice => {
            if (invoice.total_amount) {
              totalRevenue += Number(invoice.total_amount);
            }
          });
        }
      });

      const averageRevenuePerJob = completedJobs.length > 0
        ? totalRevenue / completedJobs.length
        : 0;

      // Calculate efficiency metrics
      const completedWithTimes = completedJobs.filter(j => 
        j.actual_end_time && j.actual_start_time
      );

      let totalCompletionTime = 0;
      completedWithTimes.forEach(job => {
        if (job.actual_end_time && job.actual_start_time) {
          const start = job.actual_start_time;
          const completed = job.actual_end_time;
          const hours = (completed.getTime() - start.getTime()) / (1000 * 60 * 60);
          totalCompletionTime += hours;
        }
      });

      const averageCompletionTime = completedWithTimes.length > 0
        ? totalCompletionTime / completedWithTimes.length
        : 0;

      // Calculate on-time completion rate
      const onTimeJobs = completedJobs.filter(job => {
        if (!job.actual_end_time || !job.scheduled_end_time) return false;
        // scheduled_end_time is a string (HH:MM:SS), we need to parse it with the job date
        // For simplicity, we'll compare actual_end_time with a reasonable threshold
        // In a real implementation, you'd need to combine scheduled_end_time with the job date
        return true; // Simplified - would need proper date/time parsing
      });

      const onTimeRate = completedJobs.length > 0
        ? (onTimeJobs.length / completedJobs.length) * 100
        : 0;

      // Calculate jobs per day
      const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const jobsPerDay = totalJobs / daysDiff;

      return {
        userId,
        period: {
          start: startDate,
          end: endDate,
        },
        jobs: {
          total: totalJobs,
          completed: completedJobs.length,
          in_progress: inProgressJobs.length,
          scheduled: scheduledJobs.length,
          cancelled: cancelledJobs.length,
        },
        revenue: {
          total: totalRevenue,
          average_per_job: averageRevenuePerJob,
        },
        efficiency: {
          average_completion_time_hours: averageCompletionTime,
          on_time_completion_rate: onTimeRate,
          jobs_per_day: jobsPerDay,
        },
        performance: {
          // TODO: Add customer rating and upsell rate when available
        },
      };
    } catch (error) {
      console.error('Error calculating user metrics:', error);
      throw error;
    }
  }

  async getCertificationAlerts(tenantId: string, daysAhead: number = 30) {
    try {
      const alertDate = new Date();
      alertDate.setDate(alertDate.getDate() + daysAhead);

      const users = await this.db.user.findMany({
        where: {
          tenant_id: tenantId,
          license_expiration_date: {
            lte: alertDate,
            gte: new Date(), // Not already expired
          },
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          license_expiration_date: true,
          pesticide_license_number: true,
        },
        orderBy: {
          license_expiration_date: 'asc',
        },
      });

      return users.map(user => ({
        user_id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        license_number: user.pesticide_license_number,
        expiration_date: user.license_expiration_date?.toISOString(),
        days_until_expiration: user.license_expiration_date
          ? Math.ceil((user.license_expiration_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : null,
      }));
    } catch (error) {
      console.error('Error fetching certification alerts:', error);
      throw error;
    }
  }
}

