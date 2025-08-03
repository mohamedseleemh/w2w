import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  hashPassword, 
  verifyPassword, 
  validatePasswordStrength, 
  createSecureSession,
  loginRateLimiter,
  getClientIdentifier,
  generateSecurePassword
} from '../../utils/auth';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; issues: string[]; isValid: boolean; } | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ allowed: boolean; remainingAttempts: number; resetTime: number | null; } | null>(null);

  useEffect(() => {
    // Check if this is first time setup
    const hashedPassword = localStorage.getItem('kyctrust_admin_password_hash');
    if (!hashedPassword) {
      setIsFirstTime(true);
    }
  }, []);

  useEffect(() => {
    // Validate password strength when typing new password
    if (newPassword) {
      const strength = validatePasswordStrength(newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [newPassword]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientId = getClientIdentifier();
    const rateLimit = loginRateLimiter.checkRateLimit(clientId);
    
    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime || 0).toLocaleTimeString('ar-SA');
      setRateLimitInfo(rateLimit);
      setIsRateLimited(true);
      toast.error(`تم تجاوز حد المحاولات. حاول مرة أخرى في ${resetTime}`);
      return;
    }

    const hashedPassword = localStorage.getItem('kyctrust_admin_password_hash');
    
    if (!hashedPassword) {
      toast.error('لم يتم إعداد كلمة المرور بعد');
      return;
    }

    if (verifyPassword(password, hashedPassword)) {
      // Successful login
      loginRateLimiter.reset(clientId);
      
      // Create secure session
      const sessionToken = createSecureSession('admin');
      localStorage.setItem('kyctrust_session', sessionToken);
      
      onLogin();
      toast.success('تم تسجيل الدخول بنجاح');
    } else {
      toast.error(`كلمة المرور غير صحيحة. المحاولات المتبقية: ${rateLimit.remainingAttempts}`);
      
      if (rateLimit.remainingAttempts <= 1) {
        setIsRateLimited(true);
        setRateLimitInfo(rateLimit);
      }
    }
  };

  const handleFirstTimeSetup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordStrength?.isValid) {
      toast.error('كلمة المرور لا تلبي متطلبات الأمان');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    // Hash and save password
    const hashedPassword = hashPassword(newPassword);
    localStorage.setItem('kyctrust_admin_password_hash', hashedPassword);
    
    // Create session
    const sessionToken = createSecureSession('admin');
    localStorage.setItem('kyctrust_session', sessionToken);
    
    setIsFirstTime(false);
    onLogin();
    toast.success('تم إعداد كلمة المرور وتسجيل الدخول بنجاح');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordStrength?.isValid) {
      toast.error('كلمة المرور الجديدة لا تلبي متطلبات الأمان');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    // Verify current password first
    const currentHashedPassword = localStorage.getItem('kyctrust_admin_password_hash');
    if (!currentHashedPassword || !verifyPassword(password, currentHashedPassword)) {
      toast.error('كلمة المرور الحالية غير صحيحة');
      return;
    }

    // Hash and save new password
    const hashedPassword = hashPassword(newPassword);
    localStorage.setItem('kyctrust_admin_password_hash', hashedPassword);
    
    setIsChangingPassword(false);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('تم تغيير كلمة المرور بنجاح');
  };

  const generateRandomPassword = () => {
    const generated = generateSecurePassword(16);
    setNewPassword(generated);
    setConfirmPassword(generated);
    toast.success('تم إنشاء كلمة مرور قوية');
  };

  if (isFirstTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-2xl inline-block mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                إعداد كلمة المرور الأولي
              </h1>
              <p className="text-gray-600">
                يرجى إنشاء كلمة مرور قوية للمدير
              </p>
            </div>

            {/* First Time Setup Form */}
            <form onSubmit={handleFirstTimeSetup} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-12"
                    placeholder="أدخل كلمة مرور قوية"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                
                {/* Generate Random Password Button */}
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  إنشاء كلمة مرور قوية تلقائياً
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="أعد كتابة كلمة المرور"
                />
              </div>

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className={`h-2 w-full rounded-full ${
                      passwordStrength.score >= 80 ? 'bg-green-500' :
                      passwordStrength.score >= 60 ? 'bg-yellow-500' :
                      passwordStrength.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                      <div 
                        className="h-full bg-current rounded-full transition-all duration-300"
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {passwordStrength.score >= 80 ? 'قوية' :
                       passwordStrength.score >= 60 ? 'متوسطة' :
                       passwordStrength.score >= 40 ? 'ضعيفة' : 'ضعيفة جداً'}
                    </span>
                  </div>
                  
                  {passwordStrength.issues.length > 0 && (
                    <div className="text-sm text-red-600 space-y-1">
                  {passwordStrength.issues.map((issue: string, index: number) => (
                        <div key={index} className="flex items-center space-x-reverse space-x-2">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!passwordStrength?.isValid || newPassword !== confirmPassword}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إعداد كلمة المرور والدخول
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (isChangingPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-3 rounded-2xl inline-block mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                تغيير ��لمة المرور
              </h1>
              <p className="text-gray-600">
                أدخل كلمة المرور الحالية والجديدة
              </p>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="أدخل كلمة المرور الحالية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-12"
                    placeholder="أدخل كلمة مرور جديدة"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  إنشاء كلمة مرور قوية تلقائياً
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="أعد كتابة كلمة المرور الجديدة"
                />
              </div>

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className={`h-2 w-full rounded-full ${
                      passwordStrength.score >= 80 ? 'bg-green-500' :
                      passwordStrength.score >= 60 ? 'bg-yellow-500' :
                      passwordStrength.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                      <div 
                        className="h-full bg-current rounded-full transition-all duration-300"
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {passwordStrength.score >= 80 ? 'قوية' :
                       passwordStrength.score >= 60 ? 'متوسطة' :
                       passwordStrength.score >= 40 ? 'ضعيفة' : 'ضعيفة جداً'}
                    </span>
                  </div>
                  
                  {passwordStrength.issues.length > 0 && (
                    <div className="text-sm text-red-600 space-y-1">
                  {passwordStrength.issues.map((issue: string, index: number) => (
                        <div key={index} className="flex items-center space-x-reverse space-x-2">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-reverse space-x-4">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!passwordStrength?.isValid || newPassword !== confirmPassword}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl inline-block mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              لوحة تحكم KYCtrust
            </h1>
            <p className="text-gray-600">
              يرجى إدخال كلمة المرور للدخول
            </p>
          </div>

          {/* Rate Limit Warning */}
          {isRateLimited && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-reverse space-x-2 text-red-600">
                <Clock className="h-5 w-5" />
                <span className="font-medium">تم تجاوز حد المحاولات</span>
              </div>
              <p className="text-sm text-red-600 mt-2">
                يرجى الانتظار {rateLimitInfo?.resetTime ? 
                  new Date(rateLimitInfo.resetTime).toLocaleTimeString('ar-SA') : 
                  '15 دقيقة'} قبل المحاولة مرة أخرى
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-reverse space-x-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span>كلمة المرور</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isRateLimited}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isRateLimited}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isRateLimited}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              تسجيل الدخول
            </button>
          </form>

          {/* Change Password */}
          {!isRateLimited && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                تغيير كلمة المرور
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-reverse space-x-2 text-green-600 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">تم تحسين الأمان</span>
            </div>
            <p className="text-xs text-green-700">
              تم تطبيق تشفير متقدم لكلمات المرور وحماية من محاولات الاختراق
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
