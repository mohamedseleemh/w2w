/**
 * Advanced Analytics and Reporting Service
 * خدمة التحليلات والتقارير المتقدمة
 * 
 * Comprehensive analytics, reporting and dashboard metrics
 * تحليلات وتقارير ومقاييس لوحة المعلومات شاملة
 */

import { supabase } from '../lib/supabase';
import { apiService } from './apiService';
import { authService } from './authService';

// Types and Interfaces
export interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventCategory: string;
  userId?: string;
  sessionId?: string;
  pageUrl: string;
  referrerUrl?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo: DeviceInfo;
  locationInfo: LocationInfo;
  metadata: Record<string, any>;
  duration?: number;
  createdAt: Date;
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  screenResolution: string;
  viewport: { width: number; height: number };
}

export interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  coordinates?: { lat: number; lng: number };
}

export interface AnalyticsFilter {
  startDate?: Date;
  endDate?: Date;
  eventType?: string;
  eventCategory?: string;
  userId?: string;
  deviceType?: string;
  country?: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topServices: ServiceMetric[];
  recentActivity: AnalyticsEvent[];
  userGrowth: GrowthMetric[];
  orderTrends: TrendMetric[];
  deviceBreakdown: DeviceMetric[];
  locationBreakdown: LocationMetric[];
}

export interface ServiceMetric {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  percentage: number;
}

export interface GrowthMetric {
  date: string;
  users: number;
  orders: number;
  revenue: number;
}

export interface TrendMetric {
  period: string;
  value: number;
  change: number;
  changePercentage: number;
}

export interface DeviceMetric {
  type: string;
  count: number;
  percentage: number;
}

export interface LocationMetric {
  country: string;
  count: number;
  percentage: number;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  filters: AnalyticsFilter;
  data: any;
  generatedAt: Date;
  generatedBy?: string;
  format: ReportFormat;
  status: 'generating' | 'completed' | 'failed';
}

export type ReportType = 
  | 'user_activity' 
  | 'order_summary' 
  | 'revenue_analysis' 
  | 'service_performance'
  | 'conversion_funnel'
  | 'custom';

export type ReportFormat = 'json' | 'csv' | 'pdf' | 'excel';

export interface ConversionFunnel {
  steps: FunnelStep[];
  totalVisitors: number;
  conversionRate: number;
}

export interface FunnelStep {
  name: string;
  visitors: number;
  conversionRate: number;
  dropOffRate: number;
}

// Analytics Service Class
export class AnalyticsService {
  private static instance: AnalyticsService;
  private eventBuffer: AnalyticsEvent[] = [];
  private isTracking: boolean = true;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
    this.startEventBufferFlush();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize tracking system
   * تهيئة نظام التتبع
   */
  private initializeTracking(): void {
    // Track page views
    window.addEventListener('beforeunload', () => {
      this.trackEvent('page_exit', {
        duration: Date.now() - performance.timeOrigin
      });
    });

    // Track navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      AnalyticsService.getInstance().trackEvent('navigation', {
        to: window.location.href,
        method: 'pushState'
      });
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      AnalyticsService.getInstance().trackEvent('navigation', {
        to: window.location.href,
        method: 'replaceState'
      });
    };

    // Track initial page load
    this.trackEvent('page_load', {
      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
      url: window.location.href
    });
  }

  /**
   * Track analytics event
   * تتبع حدث التحليلات
   */
  async trackEvent(
    eventType: string, 
    metadata: Record<string, any> = {},
    category: string = 'general'
  ): Promise<void> {
    if (!this.isTracking) return;

    try {
      const event: AnalyticsEvent = {
        id: this.generateEventId(),
        eventType,
        eventCategory: category,
        userId: authService.getCurrentUser()?.id,
        sessionId: this.sessionId,
        pageUrl: window.location.href,
        referrerUrl: document.referrer,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        deviceInfo: this.getDeviceInfo(),
        locationInfo: await this.getLocationInfo(),
        metadata,
        createdAt: new Date()
      };

      // Add to buffer for batch processing
      this.eventBuffer.push(event);

      // If buffer is full, flush immediately
      if (this.eventBuffer.length >= 10) {
        await this.flushEventBuffer();
      }

    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  /**
   * Track page view
   * تتبع عرض الصفحة
   */
  async trackPageView(pageTitle?: string, additionalData: Record<string, any> = {}): Promise<void> {
    await this.trackEvent('page_view', {
      title: pageTitle || document.title,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      ...additionalData
    }, 'navigation');
  }

  /**
   * Track user action
   * تتبع إجراء المستخدم
   */
  async trackUserAction(
    action: string, 
    target: string, 
    value?: string | number,
    additionalData: Record<string, any> = {}
  ): Promise<void> {
    await this.trackEvent('user_action', {
      action,
      target,
      value,
      timestamp: Date.now(),
      ...additionalData
    }, 'interaction');
  }

  /**
   * Track conversion
   * تتبع التحويل
   */
  async trackConversion(
    conversionType: string,
    value: number,
    currency: string = 'USD',
    additionalData: Record<string, any> = {}
  ): Promise<void> {
    await this.trackEvent('conversion', {
      conversionType,
      value,
      currency,
      ...additionalData
    }, 'conversion');
  }

  /**
   * Track error
   * تتبع الأخطاء
   */
  async trackError(
    errorType: string,
    errorMessage: string,
    stackTrace?: string,
    additionalData: Record<string, any> = {}
  ): Promise<void> {
    await this.trackEvent('error', {
      errorType,
      errorMessage,
      stackTrace,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...additionalData
    }, 'error');
  }

  /**
   * Track performance
   * تتبع الأداء
   */
  async trackPerformance(
    metricName: string,
    value: number,
    unit: string = 'ms',
    additionalData: Record<string, any> = {}
  ): Promise<void> {
    await this.trackEvent('performance', {
      metricName,
      value,
      unit,
      ...additionalData
    }, 'performance');
  }

  /**
   * Get dashboard metrics
   * الحصول على مقاييس لوحة المعلومات
   */
  async getDashboardMetrics(dateRange?: { from: Date; to: Date }): Promise<DashboardMetrics> {
    try {
      const endDate = dateRange?.to || new Date();
      const startDate = dateRange?.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

      // Get parallel data
      const [
        userStats,
        orderStats,
        serviceStats,
        activityData,
        deviceData,
        locationData
      ] = await Promise.all([
        this.getUserStatistics(startDate, endDate),
        this.getOrderStatistics(startDate, endDate),
        this.getServiceStatistics(startDate, endDate),
        this.getRecentActivity(20),
        this.getDeviceBreakdown(startDate, endDate),
        this.getLocationBreakdown(startDate, endDate)
      ]);

      const metrics: DashboardMetrics = {
        totalUsers: userStats.total,
        activeUsers: userStats.active,
        totalOrders: orderStats.total,
        totalRevenue: orderStats.revenue,
        conversionRate: this.calculateConversionRate(userStats.total, orderStats.total),
        averageOrderValue: orderStats.total > 0 ? orderStats.revenue / orderStats.total : 0,
        topServices: serviceStats,
        recentActivity: activityData,
        userGrowth: await this.getUserGrowthData(startDate, endDate),
        orderTrends: await this.getOrderTrends(startDate, endDate),
        deviceBreakdown: deviceData,
        locationBreakdown: locationData
      };

      return metrics;

    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  /**
   * Generate custom report
   * إنشاء تقرير مخصص
   */
  async generateReport(
    reportType: ReportType,
    filters: AnalyticsFilter,
    format: ReportFormat = 'json'
  ): Promise<Report> {
    try {
      const reportId = this.generateReportId();
      const currentUser = authService.getCurrentUser();

      const report: Report = {
        id: reportId,
        name: this.getReportName(reportType),
        type: reportType,
        description: this.getReportDescription(reportType),
        filters,
        data: {},
        generatedAt: new Date(),
        generatedBy: currentUser?.id,
        format,
        status: 'generating'
      };

      // Generate report data based on type
      let reportData;
      switch (reportType) {
        case 'user_activity':
          reportData = await this.generateUserActivityReport(filters);
          break;
        case 'order_summary':
          reportData = await this.generateOrderSummaryReport(filters);
          break;
        case 'revenue_analysis':
          reportData = await this.generateRevenueAnalysisReport(filters);
          break;
        case 'service_performance':
          reportData = await this.generateServicePerformanceReport(filters);
          break;
        case 'conversion_funnel':
          reportData = await this.generateConversionFunnelReport(filters);
          break;
        default:
          throw new Error('نوع تقرير غير مدعوم');
      }

      report.data = reportData;
      report.status = 'completed';

      // Save report
      await this.saveReport(report);

      return report;

    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Export report to different formats
   * تصدير التقرير إلى تنسيقات مختلفة
   */
  async exportReport(reportId: string, format: ReportFormat): Promise<Blob> {
    try {
      const report = await this.getReportById(reportId);
      if (!report) {
        throw new Error('التقرير غير موجود');
      }

      switch (format) {
        case 'json':
          return new Blob([JSON.stringify(report.data, null, 2)], { 
            type: 'application/json' 
          });
        case 'csv':
          return this.exportToCSV(report.data);
        case 'pdf':
          return await this.exportToPDF(report);
        case 'excel':
          return await this.exportToExcel(report.data);
        default:
          throw new Error('تنسيق التصدير غير مدعوم');
      }

    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  /**
   * Get conversion funnel
   * الحصول على قمع التحويل
   */
  async getConversionFunnel(filters: AnalyticsFilter = {}): Promise<ConversionFunnel> {
    try {
      const steps = [
        { name: 'زيارة الموقع', event: 'page_view' },
        { name: 'عرض الخدمات', event: 'service_view' },
        { name: 'بدء الطلب', event: 'order_start' },
        { name: 'إتمام الطلب', event: 'order_complete' }
      ];

      const funnelSteps: FunnelStep[] = [];
      let previousVisitors = 0;

      for (let i = 0; i < steps.length; i++) {
        const stepVisitors = await this.getEventCount(steps[i].event, filters);
        
        const conversionRate = i === 0 ? 100 : (stepVisitors / previousVisitors) * 100;
        const dropOffRate = i === 0 ? 0 : 100 - conversionRate;

        funnelSteps.push({
          name: steps[i].name,
          visitors: stepVisitors,
          conversionRate,
          dropOffRate
        });

        if (i === 0) {
          previousVisitors = stepVisitors;
        } else {
          previousVisitors = stepVisitors;
        }
      }

      const totalVisitors = funnelSteps[0]?.visitors || 0;
      const finalConversions = funnelSteps[funnelSteps.length - 1]?.visitors || 0;
      const overallConversionRate = totalVisitors > 0 ? (finalConversions / totalVisitors) * 100 : 0;

      return {
        steps: funnelSteps,
        totalVisitors,
        conversionRate: overallConversionRate
      };

    } catch (error) {
      console.error('Error getting conversion funnel:', error);
      throw error;
    }
  }

  /**
   * Get events with filters
   * الحصول على الأحداث مع المرشحات
   */
  async getEvents(filters: AnalyticsFilter = {}, limit: number = 100): Promise<AnalyticsEvent[]> {
    try {
      if (supabase) {
        let query = supabase
          .from('analytics_events')
          .select('*')
          .order('created_at', { ascending: false });

        // Apply filters
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate.toISOString());
        }
        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate.toISOString());
        }
        if (filters.eventType) {
          query = query.eq('event_type', filters.eventType);
        }
        if (filters.eventCategory) {
          query = query.eq('event_category', filters.eventCategory);
        }
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }

        query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;

        return data.map(this.mapEventFromDB);
      } else {
        // Fallback to localStorage
        const events = this.getStoredEvents();
        return this.applyEventFilters(events, filters).slice(0, limit);
      }

    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  /**
   * Enable/disable tracking
   * تفعيل/إلغاء تفعيل التتبع
   */
  setTrackingEnabled(enabled: boolean): void {
    this.isTracking = enabled;
    
    if (enabled) {
      this.trackEvent('tracking_enabled');
    } else {
      this.trackEvent('tracking_disabled');
      // Flush any remaining events
      this.flushEventBuffer();
    }
  }

  /**
   * Get tracking status
   * الحصول على حالة التتبع
   */
  isTrackingEnabled(): boolean {
    return this.isTracking;
  }

  /**
   * Clear all analytics data
   * مسح جميع بيانات التحليلات
   */
  async clearAnalyticsData(confirm: boolean = false): Promise<void> {
    if (!confirm) {
      throw new Error('يجب تأكيد مسح البيانات');
    }

    try {
      if (supabase) {
        const { error } = await supabase
          .from('analytics_events')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) throw error;
      } else {
        localStorage.removeItem('kyctrust_analytics_events');
      }

      // Clear buffer
      this.eventBuffer = [];

      await this.trackEvent('analytics_data_cleared', { timestamp: Date.now() });

    } catch (error) {
      console.error('Error clearing analytics data:', error);
      throw error;
    }
  }

  // Private helper methods
  private generateEventId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  private generateSessionId(): string {
    return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  private generateReportId(): string {
    return 'report_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/tablet|ipad/i.test(userAgent)) {
      deviceType = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      deviceType = 'mobile';
    }

    return {
      type: deviceType,
      os: this.getOS(userAgent),
      browser: this.getBrowser(userAgent),
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private async getLocationInfo(): Promise<LocationInfo> {
    // In a real implementation, you would use a geolocation service
    return {
      country: 'Unknown',
      region: 'Unknown',
      city: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  private async getClientIP(): Promise<string> {
    // In a real implementation, you would get the actual client IP
    return '127.0.0.1';
  }

  private startEventBufferFlush(): void {
    // Flush events every 30 seconds
    setInterval(() => {
      if (this.eventBuffer.length > 0) {
        this.flushEventBuffer();
      }
    }, 30000);
  }

  private async flushEventBuffer(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const eventsToFlush = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      if (supabase) {
        const dbEvents = eventsToFlush.map(event => ({
          id: event.id,
          event_type: event.eventType,
          event_category: event.eventCategory,
          user_id: event.userId,
          session_id: event.sessionId,
          page_url: event.pageUrl,
          referrer_url: event.referrerUrl,
          ip_address: event.ipAddress,
          user_agent: event.userAgent,
          device_info: event.deviceInfo,
          location_info: event.locationInfo,
          metadata: event.metadata,
          duration: event.duration,
          created_at: event.createdAt.toISOString()
        }));

        const { error } = await supabase
          .from('analytics_events')
          .insert(dbEvents);

        if (error) throw error;
      } else {
        // Store in localStorage
        const existingEvents = this.getStoredEvents();
        existingEvents.push(...eventsToFlush);
        localStorage.setItem('kyctrust_analytics_events', JSON.stringify(existingEvents));
      }

    } catch (error) {
      console.error('Error flushing event buffer:', error);
      // Put events back in buffer to retry later
      this.eventBuffer.unshift(...eventsToFlush);
    }
  }

  private async getUserStatistics(startDate: Date, endDate: Date): Promise<{ total: number; active: number }> {
    try {
      const response = await apiService.get('admin_users', {
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString()
      });

      const users = response.data || [];
      const activeUsers = users.filter((user: any) => 
        user.last_login && new Date(user.last_login) >= startDate
      );

      return {
        total: users.length,
        active: activeUsers.length
      };
    } catch (error) {
      return { total: 0, active: 0 };
    }
  }

  private async getOrderStatistics(startDate: Date, endDate: Date): Promise<{ total: number; revenue: number }> {
    try {
      const response = await apiService.get('orders', {
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString()
      });

      const orders = response.data || [];
      const completedOrders = orders.filter((order: any) => order.status === 'completed');
      const revenue = completedOrders.reduce((sum: number, order: any) => sum + (order.service_price || 0), 0);

      return {
        total: orders.length,
        revenue
      };
    } catch (error) {
      return { total: 0, revenue: 0 };
    }
  }

  private async getServiceStatistics(startDate: Date, endDate: Date): Promise<ServiceMetric[]> {
    try {
      const ordersResponse = await apiService.get('orders', {
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString()
      });

      const orders = ordersResponse.data || [];
      const serviceStats: Record<string, { orders: number; revenue: number; name: string }> = {};

      orders.forEach((order: any) => {
        if (!serviceStats[order.service_id]) {
          serviceStats[order.service_id] = {
            orders: 0,
            revenue: 0,
            name: order.service_name || 'خدمة غير معروفة'
          };
        }
        serviceStats[order.service_id].orders++;
        serviceStats[order.service_id].revenue += order.service_price || 0;
      });

      const totalOrders = orders.length;
      return Object.entries(serviceStats)
        .map(([id, stats]) => ({
          id,
          name: stats.name,
          orders: stats.orders,
          revenue: stats.revenue,
          percentage: totalOrders > 0 ? (stats.orders / totalOrders) * 100 : 0
        }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 10);

    } catch (error) {
      return [];
    }
  }

  private async getRecentActivity(limit: number): Promise<AnalyticsEvent[]> {
    return this.getEvents({}, limit);
  }

  private async getUserGrowthData(startDate: Date, endDate: Date): Promise<GrowthMetric[]> {
    // Generate daily growth data
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const growthData: GrowthMetric[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      // Simulate growth data
      growthData.push({
        date: dateStr,
        users: Math.floor(Math.random() * 10) + 1,
        orders: Math.floor(Math.random() * 5),
        revenue: Math.floor(Math.random() * 1000) + 100
      });
    }

    return growthData;
  }

  private async getOrderTrends(startDate: Date, endDate: Date): Promise<TrendMetric[]> {
    // Generate trend data for different periods
    return [
      {
        period: 'اليوم',
        value: 5,
        change: 2,
        changePercentage: 40
      },
      {
        period: 'هذا الأسبوع',
        value: 25,
        change: -3,
        changePercentage: -10.7
      },
      {
        period: 'هذا الشهر',
        value: 120,
        change: 15,
        changePercentage: 14.3
      }
    ];
  }

  private async getDeviceBreakdown(startDate: Date, endDate: Date): Promise<DeviceMetric[]> {
    const events = await this.getEvents({ startDate, endDate, eventType: 'page_view' });
    const deviceCounts: Record<string, number> = {};
    
    events.forEach(event => {
      const deviceType = event.deviceInfo.type;
      deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
    });

    const total = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(deviceCounts).map(([type, count]) => ({
      type,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  }

  private async getLocationBreakdown(startDate: Date, endDate: Date): Promise<LocationMetric[]> {
    const events = await this.getEvents({ startDate, endDate, eventType: 'page_view' });
    const locationCounts: Record<string, number> = {};
    
    events.forEach(event => {
      const country = event.locationInfo.country || 'Unknown';
      locationCounts[country] = (locationCounts[country] || 0) + 1;
    });

    const total = Object.values(locationCounts).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(locationCounts)
      .map(([country, count]) => ({
        country,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateConversionRate(visitors: number, conversions: number): number {
    return visitors > 0 ? (conversions / visitors) * 100 : 0;
  }

  private async getEventCount(eventType: string, filters: AnalyticsFilter): Promise<number> {
    const events = await this.getEvents({ ...filters, eventType });
    return events.length;
  }

  private getReportName(type: ReportType): string {
    const names: Record<ReportType, string> = {
      'user_activity': 'تقرير نشاط المستخدمين',
      'order_summary': 'ملخص الطلبات',
      'revenue_analysis': 'تحليل الإيرادات',
      'service_performance': 'أداء الخدمات',
      'conversion_funnel': 'قمع التحويل',
      'custom': 'تقرير مخصص'
    };
    return names[type];
  }

  private getReportDescription(type: ReportType): string {
    const descriptions: Record<ReportType, string> = {
      'user_activity': 'تقرير مفصل عن نشاط المستخدمين والتفاعل مع الموقع',
      'order_summary': 'ملخص شامل للطلبات والمبيعات',
      'revenue_analysis': 'تحليل مفصل للإيرادات والاتجاهات المالية',
      'service_performance': 'تقرير أداء الخدمات والشعبية',
      'conversion_funnel': 'تحليل قمع التحويل ومعدلات النجاح',
      'custom': 'تقرير مخصص حسب المعايير المحددة'
    };
    return descriptions[type];
  }

  // Report generation methods
  private async generateUserActivityReport(filters: AnalyticsFilter): Promise<any> {
    const events = await this.getEvents(filters);
    const users = [...new Set(events.map(e => e.userId).filter(Boolean))];
    
    return {
      summary: {
        totalEvents: events.length,
        uniqueUsers: users.length,
        avgEventsPerUser: users.length > 0 ? events.length / users.length : 0
      },
      topEvents: this.getTopEventTypes(events),
      activityByDay: this.groupEventsByDay(events),
      userEngagement: this.calculateUserEngagement(events)
    };
  }

  private async generateOrderSummaryReport(filters: AnalyticsFilter): Promise<any> {
    const ordersResponse = await apiService.get('orders', {
      dateFrom: filters.startDate?.toISOString(),
      dateTo: filters.endDate?.toISOString()
    });

    const orders = ordersResponse.data || [];
    
    return {
      summary: {
        totalOrders: orders.length,
        completedOrders: orders.filter((o: any) => o.status === 'completed').length,
        totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.service_price || 0), 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum: number, o: any) => sum + (o.service_price || 0), 0) / orders.length : 0
      },
      ordersByStatus: this.groupOrdersByStatus(orders),
      revenueByService: this.groupRevenueByService(orders),
      orderTrends: this.analyzeOrderTrends(orders)
    };
  }

  private async generateRevenueAnalysisReport(filters: AnalyticsFilter): Promise<any> {
    const ordersResponse = await apiService.get('orders', {
      dateFrom: filters.startDate?.toISOString(),
      dateTo: filters.endDate?.toISOString()
    });

    const orders = ordersResponse.data || [];
    const completedOrders = orders.filter((o: any) => o.status === 'completed');
    
    return {
      totalRevenue: completedOrders.reduce((sum: number, o: any) => sum + (o.service_price || 0), 0),
      revenueByMonth: this.groupRevenueByMonth(completedOrders),
      revenueByService: this.groupRevenueByService(completedOrders),
      profitMargins: this.calculateProfitMargins(completedOrders),
      forecasting: this.generateRevenueForecast(completedOrders)
    };
  }

  private async generateServicePerformanceReport(filters: AnalyticsFilter): Promise<any> {
    const servicesResponse = await apiService.get('services');
    const ordersResponse = await apiService.get('orders', {
      dateFrom: filters.startDate?.toISOString(),
      dateTo: filters.endDate?.toISOString()
    });

    const services = servicesResponse.data || [];
    const orders = ordersResponse.data || [];
    
    return {
      serviceMetrics: this.calculateServiceMetrics(services, orders),
      popularityRanking: this.rankServicesByPopularity(services, orders),
      conversionRates: this.calculateServiceConversionRates(services, orders),
      recommendations: this.generateServiceRecommendations(services, orders)
    };
  }

  private async generateConversionFunnelReport(filters: AnalyticsFilter): Promise<any> {
    const funnel = await this.getConversionFunnel(filters);
    
    return {
      funnel,
      optimization: this.generateFunnelOptimizations(funnel),
      comparisons: this.generateFunnelComparisons(funnel)
    };
  }

  // Export methods
  private exportToCSV(data: any): Blob {
    const csvContent = this.convertToCSV(data);
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  private async exportToPDF(report: Report): Promise<Blob> {
    // In a real implementation, use a PDF library like jsPDF
    const content = `
      التقرير: ${report.name}
      التاريخ: ${report.generatedAt.toLocaleDateString('ar-SA')}
      البيانات: ${JSON.stringify(report.data, null, 2)}
    `;
    
    return new Blob([content], { type: 'application/pdf' });
  }

  private async exportToExcel(data: any): Promise<Blob> {
    // In a real implementation, use a library like SheetJS
    const csvContent = this.convertToCSV(data);
    return new Blob([csvContent], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  private convertToCSV(data: any): string {
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => 
        Object.values(item).map(value => 
          typeof value === 'string' ? `"${value}"` : value
        ).join(',')
      );
      
      return [headers, ...rows].join('\n');
    }
    
    // Convert object to CSV
    const rows = Object.entries(data).map(([key, value]) => 
      `"${key}","${value}"`
    );
    
    return ['Key,Value', ...rows].join('\n');
  }

  // Helper methods for calculations
  private getTopEventTypes(events: AnalyticsEvent[]): Array<{ type: string; count: number }> {
    const eventCounts: Record<string, number> = {};
    events.forEach(event => {
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1;
    });
    
    return Object.entries(eventCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private groupEventsByDay(events: AnalyticsEvent[]): Record<string, number> {
    const dayGroups: Record<string, number> = {};
    events.forEach(event => {
      const day = event.createdAt.toISOString().split('T')[0];
      dayGroups[day] = (dayGroups[day] || 0) + 1;
    });
    return dayGroups;
  }

  private calculateUserEngagement(events: AnalyticsEvent[]): any {
    const userSessions: Record<string, AnalyticsEvent[]> = {};
    events.forEach(event => {
      if (event.userId) {
        if (!userSessions[event.userId]) {
          userSessions[event.userId] = [];
        }
        userSessions[event.userId].push(event);
      }
    });

    const sessionDurations = Object.values(userSessions).map(userEvents => {
      if (userEvents.length < 2) return 0;
      const sortedEvents = userEvents.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return sortedEvents[sortedEvents.length - 1].createdAt.getTime() - sortedEvents[0].createdAt.getTime();
    });

    return {
      averageSessionDuration: sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length,
      totalUsers: Object.keys(userSessions).length,
      averageEventsPerSession: events.length / Object.keys(userSessions).length
    };
  }

  private groupOrdersByStatus(orders: any[]): Record<string, number> {
    const statusGroups: Record<string, number> = {};
    orders.forEach(order => {
      statusGroups[order.status] = (statusGroups[order.status] || 0) + 1;
    });
    return statusGroups;
  }

  private groupRevenueByService(orders: any[]): Array<{ serviceName: string; revenue: number }> {
    const serviceRevenue: Record<string, number> = {};
    orders.forEach(order => {
      if (order.status === 'completed') {
        const serviceName = order.service_name || 'خدمة غير معروفة';
        serviceRevenue[serviceName] = (serviceRevenue[serviceName] || 0) + (order.service_price || 0);
      }
    });
    
    return Object.entries(serviceRevenue)
      .map(([serviceName, revenue]) => ({ serviceName, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private groupRevenueByMonth(orders: any[]): Record<string, number> {
    const monthlyRevenue: Record<string, number> = {};
    orders.forEach(order => {
      const month = new Date(order.created_at).toISOString().substring(0, 7); // YYYY-MM
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (order.service_price || 0);
    });
    return monthlyRevenue;
  }

  private analyzeOrderTrends(orders: any[]): any {
    // Simple trend analysis
    const dailyOrders = this.groupOrdersByDay(orders);
    const dates = Object.keys(dailyOrders).sort();
    
    if (dates.length < 2) {
      return { trend: 'insufficient_data', change: 0 };
    }
    
    const recent = dailyOrders[dates[dates.length - 1]];
    const previous = dailyOrders[dates[dates.length - 2]];
    const change = recent - previous;
    
    return {
      trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
      change,
      changePercentage: previous > 0 ? (change / previous) * 100 : 0
    };
  }

  private groupOrdersByDay(orders: any[]): Record<string, number> {
    const dayGroups: Record<string, number> = {};
    orders.forEach(order => {
      const day = new Date(order.created_at).toISOString().split('T')[0];
      dayGroups[day] = (dayGroups[day] || 0) + 1;
    });
    return dayGroups;
  }

  private calculateProfitMargins(orders: any[]): any {
    // Simplified profit calculation
    const totalRevenue = orders.reduce((sum, order) => sum + (order.service_price || 0), 0);
    const estimatedCosts = totalRevenue * 0.3; // Assume 30% costs
    const profit = totalRevenue - estimatedCosts;
    
    return {
      totalRevenue,
      estimatedCosts,
      profit,
      profitMargin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0
    };
  }

  private generateRevenueForecast(orders: any[]): any {
    // Simple linear forecast based on recent trend
    const monthlyRevenue = this.groupRevenueByMonth(orders);
    const months = Object.keys(monthlyRevenue).sort();
    
    if (months.length < 2) {
      return { forecast: 'insufficient_data' };
    }
    
    const recent = monthlyRevenue[months[months.length - 1]];
    const previous = monthlyRevenue[months[months.length - 2]];
    const trend = recent - previous;
    
    return {
      nextMonthForecast: recent + trend,
      trend: trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral',
      confidence: 'medium'
    };
  }

  private calculateServiceMetrics(services: any[], orders: any[]): any[] {
    return services.map(service => {
      const serviceOrders = orders.filter(order => order.service_id === service.id);
      const completedOrders = serviceOrders.filter(order => order.status === 'completed');
      const revenue = completedOrders.reduce((sum, order) => sum + (order.service_price || 0), 0);
      
      return {
        id: service.id,
        name: service.name,
        totalOrders: serviceOrders.length,
        completedOrders: completedOrders.length,
        revenue,
        conversionRate: serviceOrders.length > 0 ? (completedOrders.length / serviceOrders.length) * 100 : 0,
        averageOrderValue: completedOrders.length > 0 ? revenue / completedOrders.length : 0
      };
    });
  }

  private rankServicesByPopularity(services: any[], orders: any[]): any[] {
    const serviceMetrics = this.calculateServiceMetrics(services, orders);
    return serviceMetrics
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .map((service, index) => ({ ...service, rank: index + 1 }));
  }

  private calculateServiceConversionRates(services: any[], orders: any[]): any[] {
    return this.calculateServiceMetrics(services, orders)
      .sort((a, b) => b.conversionRate - a.conversionRate);
  }

  private generateServiceRecommendations(services: any[], orders: any[]): string[] {
    const metrics = this.calculateServiceMetrics(services, orders);
    const recommendations: string[] = [];
    
    // Find low-performing services
    const lowPerformers = metrics.filter(m => m.conversionRate < 50);
    if (lowPerformers.length > 0) {
      recommendations.push(`تحسين معدل التحويل للخدمات: ${lowPerformers.map(s => s.name).join(', ')}`);
    }
    
    // Find high-revenue services
    const topRevenue = metrics.sort((a, b) => b.revenue - a.revenue)[0];
    if (topRevenue) {
      recommendations.push(`التركيز على تسويق الخدمة الأكثر ربحية: ${topRevenue.name}`);
    }
    
    return recommendations;
  }

  private generateFunnelOptimizations(funnel: ConversionFunnel): string[] {
    const optimizations: string[] = [];
    
    funnel.steps.forEach((step, index) => {
      if (step.dropOffRate > 50) {
        optimizations.push(`تحسين مرحلة "${step.name}" - معدل تسرب عالي: ${step.dropOffRate.toFixed(1)}%`);
      }
    });
    
    return optimizations;
  }

  private generateFunnelComparisons(funnel: ConversionFunnel): any {
    // Compare with industry benchmarks
    const industryBenchmarks = {
      'زيارة الموقع': 100,
      'عرض الخدمات': 40,
      'بدء الطلب': 15,
      'إتمام الطلب': 8
    };
    
    return funnel.steps.map(step => ({
      step: step.name,
      actual: step.conversionRate,
      benchmark: industryBenchmarks[step.name] || 0,
      performance: step.conversionRate > (industryBenchmarks[step.name] || 0) ? 'above' : 'below'
    }));
  }

  // Storage methods
  private async saveReport(report: Report): Promise<void> {
    // In a real implementation, save to database
    const reports = this.getStoredReports();
    reports.push(report);
    localStorage.setItem('kyctrust_reports', JSON.stringify(reports));
  }

  private async getReportById(reportId: string): Promise<Report | null> {
    const reports = this.getStoredReports();
    return reports.find(r => r.id === reportId) || null;
  }

  private getStoredReports(): Report[] {
    try {
      const reports = localStorage.getItem('kyctrust_reports');
      return reports ? JSON.parse(reports).map((report: any) => ({
        ...report,
        generatedAt: new Date(report.generatedAt)
      })) : [];
    } catch {
      return [];
    }
  }

  private getStoredEvents(): AnalyticsEvent[] {
    try {
      const events = localStorage.getItem('kyctrust_analytics_events');
      return events ? JSON.parse(events).map((event: any) => ({
        ...event,
        createdAt: new Date(event.createdAt)
      })) : [];
    } catch {
      return [];
    }
  }

  private applyEventFilters(events: AnalyticsEvent[], filters: AnalyticsFilter): AnalyticsEvent[] {
    return events.filter(event => {
      if (filters.startDate && event.createdAt < filters.startDate) return false;
      if (filters.endDate && event.createdAt > filters.endDate) return false;
      if (filters.eventType && event.eventType !== filters.eventType) return false;
      if (filters.eventCategory && event.eventCategory !== filters.eventCategory) return false;
      if (filters.userId && event.userId !== filters.userId) return false;
      if (filters.deviceType && event.deviceInfo.type !== filters.deviceType) return false;
      if (filters.country && event.locationInfo.country !== filters.country) return false;
      return true;
    });
  }

  private mapEventFromDB(data: any): AnalyticsEvent {
    return {
      id: data.id,
      eventType: data.event_type,
      eventCategory: data.event_category,
      userId: data.user_id,
      sessionId: data.session_id,
      pageUrl: data.page_url,
      referrerUrl: data.referrer_url,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      deviceInfo: data.device_info || {},
      locationInfo: data.location_info || {},
      metadata: data.metadata || {},
      duration: data.duration,
      createdAt: new Date(data.created_at)
    };
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
export default analyticsService;
