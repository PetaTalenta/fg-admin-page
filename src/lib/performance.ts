/**
 * Performance Monitoring Utilities
 * Track and monitor application performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics: number = 100;

  /**
   * Record a performance metric
   */
  record(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    });

    // Keep only last maxMetrics entries
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /**
   * Get metrics by name
   */
  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  /**
   * Get average value for a metric
   */
  getAverage(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Measure function execution time
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.record(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(`${name}_error`, duration);
      throw error;
    }
  }

  /**
   * Get Core Web Vitals
   */
  getCoreWebVitals(): {
    LCP?: number;
    FID?: number;
    CLS?: number;
  } {
    if (typeof window === 'undefined') return {};

    const vitals: { LCP?: number; FID?: number; CLS?: number } = {};

    // Get LCP (Largest Contentful Paint)
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      const lcp = lcpEntries[lcpEntries.length - 1] as PerformanceEntry & {
        renderTime: number;
        loadTime: number;
      };
      vitals.LCP = lcp.renderTime || lcp.loadTime;
    }

    // Get FID (First Input Delay)
    const fidEntries = performance.getEntriesByType('first-input');
    if (fidEntries.length > 0) {
      const fid = fidEntries[0] as PerformanceEntry & {
        processingStart: number;
        startTime: number;
      };
      vitals.FID = fid.processingStart - fid.startTime;
    }

    // CLS (Cumulative Layout Shift) requires PerformanceObserver
    // which is handled separately

    return vitals;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Track page load performance
 */
export const trackPageLoad = (): void => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      performanceMonitor.record('page_load', navigation.loadEventEnd);
      performanceMonitor.record(
        'dom_content_loaded',
        navigation.domContentLoadedEventEnd
      );
      performanceMonitor.record('dns_lookup', navigation.domainLookupEnd - navigation.domainLookupStart);
      performanceMonitor.record('tcp_connection', navigation.connectEnd - navigation.connectStart);
      performanceMonitor.record('ttfb', navigation.responseStart - navigation.requestStart);
    }
  });
};

/**
 * Track API call performance
 */
export const trackAPICall = (endpoint: string, duration: number): void => {
  performanceMonitor.record(`api_${endpoint}`, duration);
};

/**
 * Log performance summary
 */
export const logPerformanceSummary = (): void => {
  const metrics = performanceMonitor.getAllMetrics();
  const summary: Record<string, { count: number; avg: number; min: number; max: number }> = {};

  metrics.forEach((metric) => {
    if (!summary[metric.name]) {
      summary[metric.name] = {
        count: 0,
        avg: 0,
        min: Infinity,
        max: -Infinity,
      };
    }

    const s = summary[metric.name];
    s.count++;
    s.avg = (s.avg * (s.count - 1) + metric.value) / s.count;
    s.min = Math.min(s.min, metric.value);
    s.max = Math.max(s.max, metric.value);
  });

  console.table(summary);
};

