import React, { useState, useEffect } from 'react';
import { Download, Upload, Database, Clock, AlertCircle, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface BackupData {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'manual' | 'automatic';
  status: 'completed' | 'processing' | 'failed';
  includes: string[];
}

export const BackupManager: React.FC = () => {
  const { orders, services, updateServices, updateOrders } = useData();
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [backupName, setBackupName] = useState('');
  const [includeSettings, setIncludeSettings] = useState({
    services: true,
    orders: true,
    settings: true,
    customizations: true
  });

  const createAutomaticBackup = React.useCallback(async () => {
    try {
      const backupData = {
        services,
        orders,
        settings: {
          theme: localStorage.getItem('theme'),
          language: localStorage.getItem('language'),
          customization: localStorage.getItem('kyc-customization')
        },
        timestamp: new Date().toISOString()
      };

      const autoBackup: BackupData = {
        id: `auto-${Date.now()}`,
        name: `نسخة تلقائية - ${new Date().toLocaleDateString('ar-SA')}`,
        date: new Date().toISOString(),
        size: `${(JSON.stringify(backupData).length / 1024).toFixed(1)} KB`,
        type: 'automatic',
        status: 'completed',
        includes: ['services', 'orders', 'settings']
      };

      localStorage.setItem(`kyc-backup-${autoBackup.id}`, JSON.stringify(backupData));

      // Keep only last 10 automatic backups
      const updatedBackups = [autoBackup, ...backups];
      const filteredBackups = updatedBackups.filter((backup, index) => {
        if (backup.type === 'automatic' && index > 9) {
          localStorage.removeItem(`kyc-backup-${backup.id}`);
          return false;
        }
        return true;
      });

      setBackups(filteredBackups);
      localStorage.setItem('kyc-backups', JSON.stringify(filteredBackups));
    } catch (error) {
      console.error('خطأ في إنشاء النسخة التلقائية:', error);
    }
  }, [backups, orders, services]);

  useEffect(() => {
    loadBackups();
    // Set up automatic backup reminder
    const interval = setInterval(() => {
      createAutomaticBackup();
    }, 24 * 60 * 60 * 1000); // Daily

    return () => clearInterval(interval);
  }, [createAutomaticBackup]);

  const loadBackups = () => {
    const savedBackups = localStorage.getItem('kyc-backups');
    if (savedBackups) {
      setBackups(JSON.parse(savedBackups));
    } else {
      // Create initial sample backups
      const sampleBackups: BackupData[] = [
        {
          id: '1',
          name: 'نسخة يومية تلقائية',
          date: new Date().toISOString(),
          size: '2.4 MB',
          type: 'automatic',
          status: 'completed',
          includes: ['services', 'orders', 'settings']
        },
        {
          id: '2',
          name: 'نسخة قبل التحديث',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          size: '2.1 MB',
          type: 'manual',
          status: 'completed',
          includes: ['services', 'orders', 'settings', 'customizations']
        }
      ];
      setBackups(sampleBackups);
      localStorage.setItem('kyc-backups', JSON.stringify(sampleBackups));
    }
  };

  const createBackup = async () => {
    if (!backupName.trim()) {
      alert('يرجى إدخال اسم للنسخة الاحتياطية');
      return;
    }

    setIsCreatingBackup(true);

    try {
      const backupData: Record<string, unknown> = {};
      const includes: string[] = [];

      if (includeSettings.services && services) {
        backupData.services = services;
        includes.push('services');
      }

      if (includeSettings.orders && orders) {
        backupData.orders = orders;
        includes.push('orders');
      }

      if (includeSettings.settings) {
        backupData.settings = {
          theme: localStorage.getItem('theme'),
          language: localStorage.getItem('language'),
          customization: localStorage.getItem('kyc-customization')
        };
        includes.push('settings');
      }

      if (includeSettings.customizations) {
        backupData.customizations = localStorage.getItem('kyc-customization');
        includes.push('customizations');
      }

      const newBackup: BackupData = {
        id: Date.now().toString(),
        name: backupName,
        date: new Date().toISOString(),
        size: `${(JSON.stringify(backupData).length / 1024).toFixed(1)} KB`,
        type: 'manual',
        status: 'completed',
        includes
      };

      // Save backup data
      localStorage.setItem(`kyc-backup-${newBackup.id}`, JSON.stringify(backupData));

      // Update backups list
      const updatedBackups = [newBackup, ...backups];
      setBackups(updatedBackups);
      localStorage.setItem('kyc-backups', JSON.stringify(updatedBackups));

      setBackupName('');
      alert('تم إنشاء النسخة الاحتياطية بنجاح');
    } catch (error) {
      console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
      alert('حدث خطأ أثناء إنشاء النسخة الاحتياطية');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const createAutomaticBackup = async () => {
    try {
      const backupData = {
        services,
        orders,
        settings: {
          theme: localStorage.getItem('theme'),
          language: localStorage.getItem('language'),
          customization: localStorage.getItem('kyc-customization')
        },
        timestamp: new Date().toISOString()
      };

      const autoBackup: BackupData = {
        id: `auto-${Date.now()}`,
        name: `نسخة تلقائية - ${new Date().toLocaleDateString('ar-SA')}`,
        date: new Date().toISOString(),
        size: `${(JSON.stringify(backupData).length / 1024).toFixed(1)} KB`,
        type: 'automatic',
        status: 'completed',
        includes: ['services', 'orders', 'settings']
      };

      localStorage.setItem(`kyc-backup-${autoBackup.id}`, JSON.stringify(backupData));

      // Keep only last 10 automatic backups
      const updatedBackups = [autoBackup, ...backups];
      const filteredBackups = updatedBackups.filter((backup, index) => {
        if (backup.type === 'automatic' && index > 9) {
          localStorage.removeItem(`kyc-backup-${backup.id}`);
          return false;
        }
        return true;
      });

      setBackups(filteredBackups);
      localStorage.setItem('kyc-backups', JSON.stringify(filteredBackups));
    } catch (error) {
      console.error('خطأ في إنشاء النسخة التلقائية:', error);
    }
  };

  const restoreBackup = async (backupId: string) => {
    if (!confirm('هل أنت متأكد من استعادة هذه النسخة؟ سيتم استبدال البيانات الحالية.')) {
      return;
    }

    setIsRestoring(true);
    setSelectedBackup(backupId);

    try {
      const backupData = localStorage.getItem(`kyc-backup-${backupId}`);
      if (!backupData) {
        throw new Error('لم يتم العثور على بيانات النسخة الاحتياطية');
      }

      const data = JSON.parse(backupData);

      if (data.services && updateServices) {
        await updateServices(data.services);
      }

      if (data.orders && updateOrders) {
        updateOrders(data.orders);
      }

      if (data.settings) {
        if (data.settings.theme) {
          localStorage.setItem('theme', data.settings.theme);
        }
        if (data.settings.language) {
          localStorage.setItem('language', data.settings.language);
        }
        if (data.settings.customization) {
          localStorage.setItem('kyc-customization', data.settings.customization);
        }
      }

      if (data.customizations) {
        localStorage.setItem('kyc-customization', data.customizations);
      }

      alert('تم استعادة النسخة الاحتياطية بنجاح. قد تحتاج لإعادة تحميل الصفحة.');
      
      // Refresh page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('خطأ في استعادة النسخة:', error);
      alert('حدث خطأ أثناء استعادة النسخة الاحتياطية');
    } finally {
      setIsRestoring(false);
      setSelectedBackup(null);
    }
  };

  const deleteBackup = (backupId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟')) {
      return;
    }

    try {
      // Remove backup data
      localStorage.removeItem(`kyc-backup-${backupId}`);

      // Update backups list
      const updatedBackups = backups.filter(backup => backup.id !== backupId);
      setBackups(updatedBackups);
      localStorage.setItem('kyc-backups', JSON.stringify(updatedBackups));

      alert('تم حذف النسخة الاحتياطية بنجاح');
    } catch (error) {
      console.error('خطأ في حذف النسخة:', error);
      alert('حدث خطأ أثناء حذف النسخة الاحتياطية');
    }
  };

  const downloadBackup = (backupId: string, backupName: string) => {
    try {
      const backupData = localStorage.getItem(`kyc-backup-${backupId}`);
      if (!backupData) {
        alert('لم يتم العثور على بيانات النسخة الاحتياطية');
        return;
      }

      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${backupName}-${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('خطأ في تحميل النسخة:', error);
      alert('حدث خطأ أثناء تحميل النسخة الاحتياطية');
    }
  };

  const uploadBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        const newBackup: BackupData = {
          id: Date.now().toString(),
          name: `نسخة مرفوعة - ${file.name}`,
          date: new Date().toISOString(),
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: 'manual',
          status: 'completed',
          includes: Object.keys(backupData).filter(key => key !== 'timestamp')
        };

        localStorage.setItem(`kyc-backup-${newBackup.id}`, JSON.stringify(backupData));

        const updatedBackups = [newBackup, ...backups];
        setBackups(updatedBackups);
        localStorage.setItem('kyc-backups', JSON.stringify(updatedBackups));

        alert('تم رفع النسخة الاحتياطية بنجاح');
      } catch (error) {
        console.error('خطأ في رفع النسخة:', error);
        alert('ملف النسخة الاحتياطية غير صالح');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          إدارة النسخ الاحتياطية
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          إنشاء واستعادة النسخ الاحتياطية ��لبيانات
        </p>
      </div>

      {/* Create Backup */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          إنشاء نسخة احتياطية جديدة
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم النسخة الاحتياطية
            </label>
            <input
              type="text"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="مثال: نسخة قبل التحديث"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              البيانات المراد نسخها
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSettings.services}
                  onChange={(e) => setIncludeSettings(prev => ({ ...prev, services: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">الخدمات</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSettings.orders}
                  onChange={(e) => setIncludeSettings(prev => ({ ...prev, orders: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">الطلبات</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSettings.settings}
                  onChange={(e) => setIncludeSettings(prev => ({ ...prev, settings: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">الإعدادات</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSettings.customizations}
                  onChange={(e) => setIncludeSettings(prev => ({ ...prev, customizations: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">التخصيصات</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={createBackup}
              disabled={isCreatingBackup}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isCreatingBackup ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              {isCreatingBackup ? 'جاري الإنشاء...' : 'إنشاء نسخة'}
            </button>

            <label className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg
                           cursor-pointer flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              رفع نسخة
              <input
                type="file"
                accept=".json"
                onChange={uploadBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Backups List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            النسخ الاحتياطية المحفوظة
          </h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {backups.length === 0 ? (
            <div className="p-8 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                لا توجد نسخ احتياطية محفوظة
              </p>
            </div>
          ) : (
            backups.map((backup) => (
              <div key={backup.id} className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getStatusIcon(backup.status)}
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mr-2">
                        {backup.name}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        backup.type === 'automatic' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {backup.type === 'automatic' ? 'تلقائية' : 'يدوية'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>التاريخ: {formatDate(backup.date)}</p>
                      <p>الحجم: {backup.size}</p>
                      <p>يتضمن: {backup.includes.join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadBackup(backup.id, backup.name)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
                      title="تحميل"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => restoreBackup(backup.id)}
                      disabled={isRestoring && selectedBackup === backup.id}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg
                               disabled:opacity-50 disabled:cursor-not-allowed"
                      title="استعادة"
                    >
                      {isRestoring && selectedBackup === backup.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => deleteBackup(backup.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">معلومات مهمة:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>يتم إنشاء نسخ احتياطية تلقائية يومياً</li>
              <li>النسخ الاحتياطية محفوظة محلياً في المتصفح</li>
              <li>يُنصح بتحميل النسخ المهمة وحفظها خارجياً</li>
              <li>استعادة النسخة ستستبدل جميع البيانات الحالية</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
