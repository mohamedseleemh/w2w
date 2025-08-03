import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { getErrorMessage, getUserFriendlyError } from '../utils/errorMessages';
import { databaseService } from '../services/database';

export interface Service {
  id: string;
  name: string;
  price: string;
  order: number;
  active: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  details: string;
  active: boolean;
}

export interface SiteSettings {
  title: string;
  description: string;
  orderNotice: string;
  whatsappNumber?: string;
}

export interface Order {
  id: string;
  customerName: string;
  serviceName: string;
  notes: string;
  timestamp: Date;
  archived: boolean;
}

interface DataContextType {
  services: Service[];
  paymentMethods: PaymentMethod[];
  siteSettings: SiteSettings;
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
  refreshData: () => void;
  // Services management
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  // Orders management
  archiveOrder: (id: string) => void;
  deleteOrder: (id: string) => void;
  // Payment methods management
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  // Site settings management
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
}

// Default data
const defaultServices: Service[] = [
  { id: '1', name: 'Payoneer', price: '30$', order: 1, active: true },
  { id: '2', name: 'Wise', price: '30$', order: 2, active: true },
  { id: '3', name: 'Skrill', price: '20$', order: 3, active: true },
  { id: '4', name: 'Neteller', price: '20$', order: 4, active: true },
  { id: '5', name: 'Kast', price: '20$', order: 5, active: true },
  { id: '6', name: 'Redotpay', price: '20$', order: 6, active: true },
  { id: '7', name: 'OKX', price: '20$', order: 7, active: true },
  { id: '8', name: 'World First', price: '20$', order: 8, active: true },
  { id: '9', name: 'Bybit', price: '20$', order: 9, active: true },
  { id: '10', name: 'Bitget', price: '20$', order: 10, active: true },
  { id: '11', name: 'KuCoin', price: '20$', order: 11, active: true },
  { id: '12', name: 'PayPal', price: '15$', order: 12, active: true },
  { id: '13', name: 'Mexc', price: '20$', order: 13, active: true },
  { id: '14', name: 'Exness', price: '20$', order: 14, active: true },
  { id: '15', name: 'شحن رصيد فودافون', price: '100 جنيه = 120 جنيه (متاح أي مبلغ)', order: 15, active: true },
  { id: '16', name: 'سحب من TikTok', price: 'حسب الاتفاق', order: 16, active: true },
  { id: '17', name: 'سحب من PayPal', price: 'حسب الاتفاق', order: 17, active: true },
];

const defaultPaymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Vodafone Cash', details: '+201062453344', active: true },
  { id: '2', name: 'USDT (TRC20)', details: 'TFUt8GRpk2R8Wv3FvoCiSUghRBQo4HrmQK', active: true },
];

const defaultSiteSettings: SiteSettings = {
  title: 'KYCtrust - خدمات مالية رقمية موثوقة',
  description: 'نقدم خدمات ��الية رقمية احترافية وآمنة لجميع المنصات العالمية مع ضمان الجودة والموثوقية',
  orderNotice: 'سيتم التواصل معك يدوياً عبر واتساب بعد إرسال الطلب.',
  whatsappNumber: '+201062453344'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with default data immediately
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data from database
      const [servicesData, paymentMethodsData, siteSettingsData, ordersData] = await Promise.all([
        databaseService.getServices().catch(() => defaultServices),
        databaseService.getPaymentMethods().catch(() => defaultPaymentMethods),
        databaseService.getSiteSettings().catch(() => defaultSiteSettings),
        databaseService.getOrders().catch(() => [])
      ]);

      // Ensure we always have services data
      const finalServices = servicesData && servicesData.length > 0 ? servicesData : defaultServices;
      setServices(finalServices);
      setPaymentMethods(paymentMethodsData && paymentMethodsData.length > 0 ? paymentMethodsData : defaultPaymentMethods);
      setSiteSettings(siteSettingsData || defaultSiteSettings);
      setOrders(ordersData || []);

    } catch (error) {
      console.error('Error refreshing data:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(getErrorMessage('database', 'connection_failed', 'ar'));
      // Always fallback to default data
      setServices(defaultServices);
      setPaymentMethods(defaultPaymentMethods);
      setSiteSettings(defaultSiteSettings);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount (optional, fallback to defaults if fails)
  useEffect(() => {
    // Try to load from database but don't block UI if it fails
    refreshData().catch(() => {
      // Silently use default data if database fails
      console.log('Using default services data');
    });
  }, []);

  const addOrder = async (order: Omit<Order, 'id' | 'timestamp'>) => {
    try {
      const newOrder = await databaseService.createOrder(order);
      setOrders(prev => [newOrder, ...prev]);
      toast.success(getErrorMessage('success', 'order_created', 'ar'));

      // Track analytics
      await databaseService.trackEvent('order_created', {
        serviceName: order.serviceName,
        customerName: order.customerName
      });
    } catch (error) {
      console.error('Error creating order:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        orderData: order
      });
      toast.error(getErrorMessage('order', 'order_creation_failed', 'ar'));
    }
  };

  // Services management functions
  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const newService = await databaseService.createService(service);
      setServices(prev => [...prev, newService]);
      toast.success('تم إضافة الخدمة بنجاح!');
    } catch (error) {
      console.error('Error creating service:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        serviceData: service
      });
      toast.error('فشل في إضافة الخدمة');
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const updatedService = await databaseService.updateService(id, updates);
      setServices(prev => prev.map(service =>
        service.id === id ? updatedService : service
      ));
      toast.success('تم تحديث الخدمة بنجاح!');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('فشل في تحديث الخدمة');
    }
  };

  const deleteService = async (id: string) => {
    try {
      await databaseService.deleteService(id);
      setServices(prev => prev.filter(service => service.id !== id));
      toast.success('تم حذف الخدمة بنجاح!');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('فشل في حذف الخدمة');
    }
  };

  // Orders management functions
  const archiveOrder = async (id: string) => {
    try {
      const archivedOrder = await databaseService.archiveOrder(id);
      setOrders(prev => prev.map(order =>
        order.id === id ? archivedOrder : order
      ));
      toast.success('تم أرشفة الطلب بنجاح!');
    } catch (error) {
      console.error('Error archiving order:', error);
      toast.error('فشل في أرشفة الطلب');
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await databaseService.deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
      toast.success('تم حذف الطلب بنجاح!');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('فشل في حذف الطلب');
    }
  };

  // Payment methods management functions
  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>) => {
    try {
      const newMethod = await databaseService.createPaymentMethod(method);
      setPaymentMethods(prev => [...prev, newMethod]);
      toast.success('تم إضافة طريقة الدفع بنجاح!');
    } catch (error) {
      console.error('Error creating payment method:', error);
      toast.error('فشل في إضافة طريقة الدفع');
    }
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    try {
      const updatedMethod = await databaseService.updatePaymentMethod(id, updates);
      setPaymentMethods(prev => prev.map(method =>
        method.id === id ? updatedMethod : method
      ));
      toast.success('تم تحديث طريقة الدفع بنجاح!');
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('فشل في تحديث طريقة الدفع');
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      await databaseService.deletePaymentMethod(id);
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      toast.success('تم حذف طريقة الدفع بنجاح!');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('فشل في حذف طريقة الدفع');
    }
  };

  // Site settings management
  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    try {
      const updatedSettings = await databaseService.updateSiteSettings(updates);
      setSiteSettings(updatedSettings);
      toast.success('تم تحديث إعدادات الموقع بنجاح!');
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast.error('فشل في تحديث إعدادات الموقع');
    }
  };

  const value: DataContextType = {
    services,
    paymentMethods,
    siteSettings,
    orders,
    loading,
    error,
    addOrder,
    refreshData,
    addService,
    updateService,
    deleteService,
    archiveOrder,
    deleteOrder,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    updateSiteSettings
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
