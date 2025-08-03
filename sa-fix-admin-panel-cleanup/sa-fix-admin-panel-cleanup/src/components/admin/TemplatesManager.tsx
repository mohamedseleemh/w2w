import React, { useState, useEffect } from 'react';
import { BookOpen, Trash2, CheckCircle, Eye, Save } from 'lucide-react';
import { landingPageService, type PageTemplate } from '../../services/landingPageService';
import toast from 'react-hot-toast';
import { useCustomization } from '../../context/CustomizationContext';

export const TemplatesManager: React.FC = () => {
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTemplateName, setNewTemplateName] = useState('');
  const { customization } = useCustomization();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const fetchedTemplates = await landingPageService.getPageTemplates('landing');
      setTemplates(fetchedTemplates);
    } catch (error) {
      toast.error('فشل في تحميل القوالب');
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadTemplate = async (templateId: string) => {
    if (!confirm('هل أنت متأكد من تحميل هذا القالب؟ سيتم استبدال التصميم الحالي.')) return;

    try {
      await landingPageService.setActiveTemplate(templateId);
      toast.success('تم تحميل القالب بنجاح. سيتم تحديث الصفحة.');
      // Reload the page to apply the new default template via CustomizationContext
      window.location.reload();
    } catch (error) {
      toast.error('فشل في تحميل القالب');
      console.error('Error loading template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const templateToDelete = templates.find(t => t.id === templateId);
    if (!templateToDelete) return;
    if (templateToDelete.is_default) {
      toast.error('لا يمكن حذف القالب الافتراضي.');
      return;
    }
    if (!confirm(`هل أنت متأكد من حذف القالب "${templateToDelete.name}"؟`)) return;

    try {
      await landingPageService.deletePageTemplate(templateId);
      toast.success('تم حذف القالب بنجاح');
      loadTemplates(); // Refresh the list
    } catch (error) {
      toast.error('فشل في حذف القالب');
      console.error('Error deleting template:', error);
    }
  };

  const handleSaveNewTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast.error('يرجى إدخال اسم للقالب الجديد.');
      return;
    }

    try {
      const pageData = {
        hero: customization.hero,
        elements: customization.pageElements,
        styles: customization.globalSettings,
        settings: customization.pageLayout,
      };

      await landingPageService.savePageTemplate({
        name: newTemplateName.trim(),
        page_type: 'landing',
        template_data: [pageData],
        theme_config: customization.globalSettings,
        active: true,
      }, false); // Not default

      toast.success('تم حفظ القالب الجديد بنجاح');
      setNewTemplateName('');
      loadTemplates();
    } catch (error) {
      toast.error('فشل في حفظ القالب الجديد');
      console.error('Error saving new template:', error);
    }
  };

  if (isLoading) {
    return <div>جاري تحميل القوالب...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            مكتبة القوالب
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة قوالب صفحة الهبوط المحفوظة
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border">
        <h3 className="text-lg font-medium mb-4">حفظ التصميم الحالي كقالب جديد</h3>
        <div className="flex space-x-4 space-x-reverse">
          <input
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="اسم القالب الجديد..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            onClick={handleSaveNewTemplate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center"
          >
            <Save className="h-4 w-4 ml-2" />
            حفظ
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border flex items-center justify-between">
            <div className="flex items-center">
              {template.is_default ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              ) : (
                <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
              )}
              <div>
                <p className="font-semibold">{template.name}</p>
                <p className="text-sm text-gray-500">
                  آخر تحديث: {new Date(template.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => handleLoadTemplate(template.id)}
                disabled={template.is_default}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 flex items-center"
              >
                <Eye className="h-4 w-4 ml-2" />
                تحميل
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                disabled={template.is_default}
                className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-400 flex items-center"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesManager;
