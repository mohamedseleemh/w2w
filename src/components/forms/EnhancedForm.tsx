import React, { useState, useRef } from 'react';
import { 
  Eye, EyeOff, Check, X, AlertCircle, Search, 
  Calendar, Clock, Upload, Link, Hash, AtSign
} from 'lucide-react';
import { SuperButton } from '../ui';

export type InputVariant = 'default' | 'outlined' | 'filled' | 'glass' | 'neon';
export type InputSize = 'sm' | 'md' | 'lg';

interface BaseInputProps {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  placeholder?: string;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

interface EnhancedInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
}

interface EnhancedTextareaProps extends BaseInputProps {
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  maxLength?: number;
  resize?: boolean;
}

interface EnhancedSelectProps extends BaseInputProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  multiple?: boolean;
  searchable?: boolean;
}

interface EnhancedFileInputProps extends BaseInputProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onChange?: (files: FileList | null) => void;
}

const getInputVariantClasses = (variant: InputVariant): string => {
  const variants = {
    default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    outlined: 'border-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500 dark:focus:border-blue-400',
    filled: 'border-0 bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500',
    glass: 'border border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-md focus:bg-white/20 dark:focus:bg-black/20 focus:ring-2 focus:ring-blue-500',
    neon: 'border-2 border-cyan-400 bg-black text-cyan-400 focus:border-cyan-300 focus:shadow-neon'
  };
  return variants[variant];
};

const getSizeClasses = (size: InputSize): string => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };
  return sizes[size];
};

const getIconForType = (type: string): React.ReactNode => {
  const icons = {
    email: <AtSign className="h-4 w-4" />,
    search: <Search className="h-4 w-4" />,
    url: <Link className="h-4 w-4" />,
    tel: <Hash className="h-4 w-4" />,
    password: <Eye className="h-4 w-4" />
  };
  return icons[type as keyof typeof icons];
};

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  variant = 'default',
  size = 'md',
  type = 'text',
  label,
  placeholder,
  error,
  success,
  disabled,
  required,
  icon,
  iconPosition = 'left',
  className = '',
  value,
  onChange,
  onBlur,
  onFocus,
  maxLength,
  pattern,
  autoComplete,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const autoIcon = icon || getIconForType(type);

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {autoIcon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {autoIcon}
          </div>
        )}

        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          pattern={pattern}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`
            w-full rounded-lg transition-all duration-200 
            ${getInputVariantClasses(variant)}
            ${getSizeClasses(size)}
            ${autoIcon && iconPosition === 'left' ? 'pl-10' : ''}
            ${(autoIcon && iconPosition === 'right') || type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${focused ? 'shadow-md' : ''}
            text-gray-900 dark:text-white
          `.replace(/\s+/g, ' ').trim()}
          {...props}
        />

        {/* Right Icon or Password Toggle */}
        {type === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : autoIcon && iconPosition === 'right' ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {autoIcon}
          </div>
        ) : null}

        {/* Status Icons */}
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
        {success && !error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}

      {/* Character Count */}
      {maxLength && value && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export const EnhancedTextarea: React.FC<EnhancedTextareaProps> = ({
  variant = 'default',
  size = 'md',
  label,
  placeholder,
  error,
  success,
  disabled,
  required,
  className = '',
  value,
  onChange,
  rows = 4,
  maxLength,
  resize = true,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={rows}
          className={`
            w-full rounded-lg transition-all duration-200 
            ${getInputVariantClasses(variant)}
            ${getSizeClasses(size)}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${focused ? 'shadow-md' : ''}
            ${resize ? 'resize-y' : 'resize-none'}
            text-gray-900 dark:text-white
          `.replace(/\s+/g, ' ').trim()}
          {...props}
        />

        {/* Status Icons */}
        {error && (
          <div className="absolute right-3 top-3">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
        {success && !error && (
          <div className="absolute right-3 top-3">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}

      {/* Character Count */}
      {maxLength && value && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export const EnhancedFileInput: React.FC<EnhancedFileInputProps> = ({
  variant = 'default',
  size = 'md',
  label,
  error,
  disabled,
  required,
  className = '',
  accept,
  multiple,
  maxSize,
  onChange,
  ...props
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
      onChange?.(selectedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      const fileArray = Array.from(droppedFiles);
      setFiles(fileArray);
      onChange?.(droppedFiles);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
          ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          {...props}
        />

        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          اسحب الملفات هنا أو اضغط للاختيار
        </p>
        {accept && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            الملفات المدعومة: {accept}
          </p>
        )}
        {maxSize && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            الحد الأقصى: {formatFileSize(maxSize)}
          </p>
        )}
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newFiles = files.filter((_, i) => i !== index);
                  setFiles(newFiles);
                  
                  // Create new FileList
                  const dt = new DataTransfer();
                  newFiles.forEach(f => dt.items.add(f));
                  onChange?.(dt.files);
                }}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default { EnhancedInput, EnhancedTextarea, EnhancedFileInput };
