import React, { useState, useEffect } from 'react';
import { X, Send, User, CreditCard, Shield, Clock, MessageCircle, Copy, CheckCircle, ArrowRight, ArrowLeft, Smartphone, DollarSign } from 'lucide-react';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  servicePrice: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, serviceName, servicePrice }) => {
  const { addOrder, paymentMethods, siteSettings, services } = useData();
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const activePaymentMethods = paymentMethods.filter(method => method.active);
  const service = services.find(s => s.name === serviceName);

  // Auto-select first payment method
  useEffect(() => {
    if (activePaymentMethods.length > 0 && !selectedPayment) {
      setSelectedPayment(activePaymentMethods[0].id);
    }
  }, [activePaymentMethods, selectedPayment]);

  // Copy payment details to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('تم نسخ تفاصيل الدفع!', {
        icon: '📋',
        duration: 2000,
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast.error('يرجى إدخال اسم العميل');
      return;
    }

    if (!agreedToTerms) {
      toast.error('يرجى الموافقة على الشروط والأحكام');
      return;
    }

    setIsSubmitting(true);

    try {
      await addOrder({
        customerName: customerName.trim(),
        serviceName,
        notes: notes.trim(),
        archived: false
      });

      setStep(3); // Success step
      
      // Reset form
      setTimeout(() => {
        setCustomerName('');
        setNotes('');
        setStep(1);
        setAgreedToTerms(false);
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error submitting order:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        customerName,
        selectedService: selectedService?.name
      });
      toast.error('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && customerName.trim()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                طلب خدمة {serviceName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                يرجى ملء البيانات المطلوبة لإتمام الطلب
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">السعر:</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{servicePrice}</span>
              </div>
            </div>

            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="inline h-4 w-4 ml-2" />
                اسم العميل *
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="أدخ�� اسمك الكامل"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MessageCircle className="inline h-4 w-4 ml-2" />
                ملاحظات إضافية (اختياري)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all duration-200"
                placeholder="أي ملاحظات أو متطلبات خاصة..."
              />
            </div>
          </div>
        );

      case 2: {
        const selectedPaymentMethod = activePaymentMethods.find(method => method.id === selectedPayment);
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                تفاصيل الدفع
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                اختر طريقة الدفع المناسبة لك
              </p>
            </div>

            <div className="space-y-4">
              {activePaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedPayment === method.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPayment === method.id && (
                          <div className="w-full h-full rounded-full bg-white transform scale-50" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{method.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{method.details}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(method.details);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedPaymentMethod && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">��علومات مهمة</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {siteSettings.orderNotice}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 space-x-reverse">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                أوافق على الشروط والأحكام وسياسة الخصوصية
              </label>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl">
              <div className="flex items-start space-x-3 space-x-reverse">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">ضمان الأمان</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    جميع بياناتك محمية ومشفرة. نحن نحترم خصوصيتك ولا نشارك معلوماتك مع أطراف ثالثة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                تم إرسال الطلب بنجاح! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                شكراً لك {customerName}، تم استلام طلبك بنجاح
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  سيتم التواصل معك قريباً عبر واتساب لإتمام الخدمة
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  const whatsappNumber = siteSettings.whatsappNumber || '+201062453344';
                  const message = `السلام عليكم، أريد متابعة طلب خدمة ${serviceName} للعميل ${customerName}`;
                  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="flex items-center space-x-2 space-x-reverse bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Smartphone className="h-5 w-5" />
                <span>تواصل عبر واتساب</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 text-right align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              طلب خدمة جديدة
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                }`}>
                  {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {getStepContent()}

            {/* Action Buttons */}
            {step < 3 && (
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl font-medium transition-colors ${
                    step === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>السابق</span>
                </button>

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!customerName.trim()}
                    className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      customerName.trim()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>التالي</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreedToTerms}
                    className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      !isSubmitting && agreedToTerms
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <span>إرسال الطلب</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
