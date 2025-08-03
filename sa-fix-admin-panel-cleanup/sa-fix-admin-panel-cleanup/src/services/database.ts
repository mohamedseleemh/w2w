import { supabase } from '../lib/supabase';
import type { Service, PaymentMethod, SiteSettings, Order } from '../context/DataContext';

export interface DatabaseService {
  // Services
  getServices(): Promise<Service[]>;
  createService(service: Omit<Service, 'id'>): Promise<Service>;
  updateService(id: string, updates: Partial<Service>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  // Payment Methods
  getPaymentMethods(): Promise<PaymentMethod[]>;
  createPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod>;
  updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod>;
  deletePaymentMethod(id: string): Promise<void>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;

  // Orders
  getOrders(): Promise<Order[]>;
  createOrder(order: Omit<Order, 'id' | 'timestamp'>): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
  archiveOrder(id: string): Promise<Order>;

  // Analytics
  trackEvent(eventType: string, metadata?: any): Promise<void>;
  getAnalytics(startDate?: Date, endDate?: Date): Promise<any>;
}

// Supabase Database Service Implementation
export class SupabaseDatabaseService implements DatabaseService {
  // Services Methods
  async getServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index');

    if (error) throw new Error(`Failed to fetch services: ${error.message}`);
    
    return data.map(this.mapServiceFromDB);
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert({
        name: service.name,
        price: service.price,
        order_index: service.order,
        active: service.active,
        description: `${service.name} service`,
        category: 'general'
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create service: ${error.message}`);
    
    return this.mapServiceFromDB(data);
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.price) updateData.price = updates.price;
    if (updates.order !== undefined) updateData.order_index = updates.order;
    if (updates.active !== undefined) updateData.active = updates.active;

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update service: ${error.message}`);
    
    return this.mapServiceFromDB(data);
  }

  async deleteService(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete service: ${error.message}`);
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('sort_order');

    if (error) throw new Error(`Failed to fetch payment methods: ${error.message}`);
    
    return data.map(this.mapPaymentMethodFromDB);
  }

  async createPaymentMethod(method: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod> {
    const dbMethod = this.mapPaymentMethodToDB(method);
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(dbMethod)
      .select()
      .single();

    if (error) throw new Error(`Failed to create payment method: ${error.message}`);
    
    return this.mapPaymentMethodFromDB(data);
  }

  async updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const dbUpdates = this.mapPaymentMethodToDB(updates);
    const { data, error } = await supabase
      .from('payment_methods')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update payment method: ${error.message}`);
    
    return this.mapPaymentMethodFromDB(data);
  }

  async deletePaymentMethod(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete payment method: ${error.message}`);
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error) throw new Error(`Failed to fetch site settings: ${error.message}`);
    
    return {
      title: data.title,
      description: data.description,
      orderNotice: data.order_notice,
      whatsappNumber: data.whatsapp_number
    };
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const updateData: any = {};
    if (settings.title) updateData.title = settings.title;
    if (settings.description) updateData.description = settings.description;
    if (settings.orderNotice) updateData.order_notice = settings.orderNotice;
    if (settings.whatsappNumber) updateData.whatsapp_number = settings.whatsappNumber;

    const { data, error } = await supabase
      .from('site_settings')
      .update(updateData)
      .select()
      .single();

    if (error) throw new Error(`Failed to update site settings: ${error.message}`);
    
    return {
      title: data.title,
      description: data.description,
      orderNotice: data.order_notice,
      whatsappNumber: data.whatsapp_number
    };
  }

  // Orders
  async getAdminProfile(): Promise<any> {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .single();
    if (error) throw new Error(`Failed to fetch admin profile: ${error.message}`);
    return data;
  }

  async updateAdminProfile(userId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('admin_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(`Failed to update admin profile: ${error.message}`);
    return data;
  }

  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
    
    return data.map(this.mapOrderFromDB);
  }

  async createOrder(order: Omit<Order, 'id' | 'timestamp'>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: order.customerName,
        service_name: order.serviceName,
        notes: order.notes,
        archived: order.archived
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create order: ${error.message}`);
    
    return this.mapOrderFromDB(data);
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const updateData: any = {};
    if (updates.customerName) updateData.customer_name = updates.customerName;
    if (updates.serviceName) updateData.service_name = updates.serviceName;
    if (updates.notes) updateData.notes = updates.notes;
    if (updates.archived !== undefined) updateData.archived = updates.archived;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update order: ${error.message}`);
    
    return this.mapOrderFromDB(data);
  }

  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete order: ${error.message}`);
  }

  async archiveOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { archived: true });
  }

  // Analytics
  async trackEvent(eventType: string, metadata: any = {}): Promise<void> {
    if (!eventType || typeof eventType !== 'string') {
      return;
    }

    if (!supabase || !supabase.supabaseUrl || !supabase.supabaseKey) {
      return this.offlineTrackEvent(eventType, metadata);
    }

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: eventType,
          metadata: metadata || {},
          page_url: window.location.href,
          referrer_url: document.referrer
        });

      if (error) {
        this.offlineTrackEvent(eventType, metadata);
      }
    } catch (error) {
      this.offlineTrackEvent(eventType, metadata);
    }
  }

  // Offline trackEvent fallback
  private offlineTrackEvent(eventType: string, metadata: any): void {
    try {
      const events = JSON.parse(localStorage.getItem('pending_analytics') || '[]');
      events.push({
        id: Date.now().toString(),
        event_type: eventType,
        metadata: metadata || {},
        page_url: window.location.href,
        referrer_url: document.referrer,
        created_at: new Date().toISOString(),
        offline: true,
        retry_count: 0
      });

      // Keep only last 100 offline events to prevent storage bloat
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }

      localStorage.setItem('pending_analytics', JSON.stringify(events));
      console.log(`📱 Stored trackEvent offline: ${eventType}`);
    } catch (error) {
      console.warn('🔧 Failed to store analytics offline:', error);
    }
  }

  async getAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
    let query = supabase
      .from('analytics_events')
      .select('*');

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch analytics: ${error.message}`);
    
    return data;
  }

  // Helper mapping functions
  private mapServiceFromDB(data: any): Service {
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      order: data.order_index || 0,
      active: data.active ?? true
    };
  }

  private mapPaymentMethodFromDB(data: any): PaymentMethod {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      details: data.details,
      isActive: data.is_active,
      fees: data.fees,
      limits: data.limits,
      icon: data.icon,
      color: data.color,
      order: data.sort_order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      instructions: data.instructions,
    };
  }

  private mapPaymentMethodToDB(method: Partial<PaymentMethod>): any {
    const dbMethod: any = {};
    if (method.name !== undefined) dbMethod.name = method.name;
    if (method.type !== undefined) dbMethod.type = method.type;
    if (method.details !== undefined) dbMethod.details = method.details;
    if (method.isActive !== undefined) dbMethod.is_active = method.isActive;
    if (method.fees !== undefined) dbMethod.fees = method.fees;
    if (method.limits !== undefined) dbMethod.limits = method.limits;
    if (method.icon !== undefined) dbMethod.icon = method.icon;
    if (method.color !== undefined) dbMethod.color = method.color;
    if (method.order !== undefined) dbMethod.sort_order = method.order;
    if (method.instructions !== undefined) dbMethod.instructions = method.instructions;
    return dbMethod;
  }

  private mapOrderFromDB(data: any): Order {
    return {
      id: data.id,
      customerName: data.customer_name,
      serviceName: data.service_name,
      notes: data.notes || '',
      timestamp: new Date(data.created_at),
      archived: data.archived ?? false
    };
  }
}

// Fallback LocalStorage Service
export class LocalStorageDatabaseService implements DatabaseService {
  private getStorageKey(key: string): string {
    return `kyctrust_${key}`;
  }

  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.getStorageKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setToStorage<T>(key: string, value: T): void {
    localStorage.setItem(this.getStorageKey(key), JSON.stringify(value));
  }

  async getServices(): Promise<Service[]> {
    return this.getFromStorage('services', []);
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    const services = await this.getServices();
    const newService: Service = { ...service, id: Date.now().toString() };
    services.push(newService);
    this.setToStorage('services', services);
    return newService;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const services = await this.getServices();
    const index = services.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Service not found');
    
    services[index] = { ...services[index], ...updates };
    this.setToStorage('services', services);
    return services[index];
  }

  async deleteService(id: string): Promise<void> {
    const services = await this.getServices();
    const filtered = services.filter(s => s.id !== id);
    this.setToStorage('services', filtered);
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.getFromStorage('paymentMethods', []);
  }

  async createPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const methods = await this.getPaymentMethods();
    const newMethod: PaymentMethod = { ...method, id: Date.now().toString() };
    methods.push(newMethod);
    this.setToStorage('paymentMethods', methods);
    return newMethod;
  }

  async updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const methods = await this.getPaymentMethods();
    const index = methods.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Payment method not found');
    
    methods[index] = { ...methods[index], ...updates };
    this.setToStorage('paymentMethods', methods);
    return methods[index];
  }

  async deletePaymentMethod(id: string): Promise<void> {
    const methods = await this.getPaymentMethods();
    const filtered = methods.filter(m => m.id !== id);
    this.setToStorage('paymentMethods', filtered);
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return this.getFromStorage('siteSettings', {
      title: 'KYCtrust',
      description: 'Digital Financial Services',
      orderNotice: 'We will contact you via WhatsApp',
      whatsappNumber: '+201062453344'
    });
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated = { ...current, ...settings };
    this.setToStorage('siteSettings', updated);
    return updated;
  }

  async getOrders(): Promise<Order[]> {
    const orders = this.getFromStorage('orders', []);
    return orders.map((order: any) => ({
      ...order,
      timestamp: new Date(order.timestamp)
    }));
  }

  async createOrder(order: Omit<Order, 'id' | 'timestamp'>): Promise<Order> {
    const orders = await this.getOrders();
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    orders.push(newOrder);
    this.setToStorage('orders', orders);
    return newOrder;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    
    orders[index] = { ...orders[index], ...updates };
    this.setToStorage('orders', orders);
    return orders[index];
  }

  async deleteOrder(id: string): Promise<void> {
    const orders = await this.getOrders();
    const filtered = orders.filter(o => o.id !== id);
    this.setToStorage('orders', filtered);
  }

  async archiveOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { archived: true });
  }

  async trackEvent(eventType: string, metadata: any = {}): Promise<void> {
    try {
      // Validate inputs
      if (!eventType || typeof eventType !== 'string') {
        console.warn('🔧 Offline trackEvent: Invalid eventType provided:', eventType);
        return;
      }

      // Store events locally for potential sync later
      const events = this.getFromStorage('analytics_events', []);
      events.push({
        id: Date.now().toString(),
        event_type: eventType,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        offline: true
      });
      this.setToStorage('analytics_events', events);
    } catch (error) {
      // Use safe error logging for offline mode
      console.error('🔧 Offline trackEvent error:', {
        message: error instanceof Error ? error.message : String(error),
        eventType,
        timestamp: new Date().toISOString()
      });
    }
  }

  async getAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
    const events = this.getFromStorage('analytics_events', []);
    return events.filter((event: any) => {
      const eventDate = new Date(event.created_at);
      if (startDate && eventDate < startDate) return false;
      if (endDate && eventDate > endDate) return false;
      return true;
    });
  }
}

// Database Factory
export function createDatabaseService(): DatabaseService {
  // Check if Supabase is configured
  if (supabase && supabase.supabaseUrl && supabase.supabaseKey) {
    return new SupabaseDatabaseService();
  } else {
    console.warn('Supabase not configured, falling back to localStorage');
    return new LocalStorageDatabaseService();
  }
}

// Default export
export const databaseService = createDatabaseService();
