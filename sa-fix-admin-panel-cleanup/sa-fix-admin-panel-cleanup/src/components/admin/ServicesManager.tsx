import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useData, Service } from '../../context/DataContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

const ServicesManager: React.FC = () => {
  const { services, updateService, addService, deleteService, loading, error, refreshData } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    order: 1,
    active: true
  });

  const sortedServices = [...services].sort((a, b) => a.order - b.order);

  const openAddModal = () => {
    setFormData({
      name: '',
      price: '',
      order: services.length + 1,
      active: true
    });
    setEditingService(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setFormData({
      name: service.name,
      price: service.price,
      order: service.order,
      active: service.active
    });
    setEditingService(service);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingService(null);
    setFormData({ name: '', price: '', order: 1, active: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }
    closeModal();
  };

  const handleToggleActive = (service: Service) => {
    updateService(service.id, { active: !service.active });
  };

  const handleDelete = (service: Service) => {
    if (window.confirm(`هل أنت متأكد من حذف خدمة "${service.name}"؟`)) {
      deleteService(service.id);
    }
  };

  const moveService = (serviceId: string, direction: 'up' | 'down') => {
    const currentService = services.find(s => s.id === serviceId);
    if (!currentService) return;

    const newOrder = direction === 'up' ? currentService.order - 1 : currentService.order + 1;
    const conflictingService = services.find(s => s.order === newOrder);

    if (conflictingService) {
      updateService(conflictingService.id, { order: currentService.order });
    }
    updateService(serviceId, { order: newOrder });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="جاري تحميل الخدمات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الخدمات</h1>
          <p className="text-gray-600 mt-1">إضافة وتعديل وحذف الخدمات المتاحة</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-reverse space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>إضافة خدمة جديدة</span>
        </button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="space-y-4">
            {sortedServices.map((service) => (
              <div
                key={service.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  service.active
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-reverse space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {service.price}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        ترتيب: {service.order}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-reverse space-x-2">
                    {/* Move buttons */}
                    <button
                      onClick={() => moveService(service.id, 'up')}
                      disabled={service.order === 1}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveService(service.id, 'down')}
                      disabled={service.order === services.length}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>

                    {/* Toggle active */}
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`p-2 rounded-lg transition-colors ${
                        service.active
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {service.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(service)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الخدمة
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مثل: PayPal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مثل: 15$ أو حسب الاتفاق"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ترتيب الظهور
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="mr-3 text-sm text-gray-700">
                    خدمة نشطة ومتاحة
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  {editingService ? 'تحديث الخدمة' : 'إضافة الخدمة'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
