import { Injectable } from '@nestjs/common';

interface Metric {
  name: string;
  value: number;
  labels?: Record<string, string> | undefined;
  timestamp: Date;
}

/**
 * Metrics service for Prometheus-compatible metrics
 */
@Injectable()
export class MetricsService {
  private readonly metrics: Map<string, Metric[]> = new Map();
  private readonly counters: Map<string, number> = new Map();
  private readonly histograms: Map<string, number[]> = new Map();

  /**
   * Increment a counter
   */
  incrementCounter(name: string, labels?: Record<string, string>, value: number = 1) {
    const key = this.getMetricKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
  }

  /**
   * Record a histogram value
   */
  recordHistogram(name: string, value: number, labels?: Record<string, string>) {
    const key = this.getMetricKey(name, labels);
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);
  }

  /**
   * Record a gauge value
   */
  recordGauge(name: string, value: number, labels?: Record<string, string>) {
    const metric: Metric = {
      name,
      value,
      labels: labels || undefined,
      timestamp: new Date()
    };

    const key = this.getMetricKey(name, labels);
    const metrics = this.metrics.get(key) || [];
    metrics.push(metric);
    this.metrics.set(key, metrics);
  }

  /**
   * Get Prometheus-formatted metrics
   */
  getPrometheusMetrics(): string {
    const lines: string[] = [];

    // Counters
    for (const [key, value] of this.counters.entries()) {
      const { name, labels } = this.parseMetricKey(key);
      const labelStr = labels ? `{${Object.entries(labels).map(([k, v]) => `${k}="${v}"`).join(',')}}` : '';
      lines.push(`# TYPE ${name} counter`);
      lines.push(`${name}${labelStr} ${value}`);
    }

    // Histograms
    for (const [key, values] of this.histograms.entries()) {
      const { name, labels } = this.parseMetricKey(key);
      const labelStr = labels ? `{${Object.entries(labels).map(([k, v]) => `${k}="${v}"`).join(',')}}` : '';
      
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const count = values.length;
        const avg = sum / count;
        const min = Math.min(...values);
        const max = Math.max(...values);

        lines.push(`# TYPE ${name} histogram`);
        lines.push(`${name}_sum${labelStr} ${sum}`);
        lines.push(`${name}_count${labelStr} ${count}`);
        lines.push(`${name}_avg${labelStr} ${avg}`);
        lines.push(`${name}_min${labelStr} ${min}`);
        lines.push(`${name}_max${labelStr} ${max}`);
      }
    }

    // Gauges
    for (const [key, metrics] of this.metrics.entries()) {
      const { name, labels } = this.parseMetricKey(key);
      const labelStr = labels ? `{${Object.entries(labels).map(([k, v]) => `${k}="${v}"`).join(',')}}` : '';
      const latest = metrics[metrics.length - 1];
      
      if (latest) {
        lines.push(`# TYPE ${name} gauge`);
        lines.push(`${name}${labelStr} ${latest.value}`);
      }
    }

    return lines.join('\n') + '\n';
  }

  /**
   * Get metric key
   */
  private getMetricKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return `${name}{${labelStr}}`;
  }

  /**
   * Parse metric key
   */
  private parseMetricKey(key: string): { name: string; labels?: Record<string, string> } {
    const match = key.match(/^(.+?)(\{(.+)\})?$/);
    if (!match) {
      return { name: key };
    }

    const name = match[1] || key;
    const labelStr = match[3];

    if (!labelStr) {
      return { name };
    }

    const labels: Record<string, string> = {};
    labelStr.split(',').forEach(pair => {
      const [k, v] = pair.split('=');
      if (k && v) {
        labels[k] = v.replace(/"/g, '');
      }
    });

    if (Object.keys(labels).length > 0) {
      return { name, labels };
    }
    return { name };
  }

  /**
   * Reset metrics (for testing)
   */
  reset() {
    this.metrics.clear();
    this.counters.clear();
    this.histograms.clear();
  }
}

