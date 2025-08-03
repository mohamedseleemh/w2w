import React, { useState, useRef } from 'react';
import {
  Upload, Image, Video, File, Trash2, Eye, Copy,
  Download, Search, Filter, Grid, List, FolderPlus,
  MoreVertical, Edit3, Info, Star, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  url: string;
  uploadDate: string;
  dimensions?: { width: number; height: number };
  isStarred: boolean;
}

export const MediaManager: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setIsUploading(true);
    
    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        
        // Create object URL for preview
        const url = URL.createObjectURL(file);
        
        const newFile: MediaFile = {
          id: `file-${Date.now()}-${i}`,
          name: file.name,
          type: getFileType(file.type),
          size: file.size,
          url,
          uploadDate: new Date().toISOString(),
          isStarred: false
        };

        // Get image dimensions if it's an image
        if (file.type.startsWith('image/')) {
          const dimensions = await getImageDimensions(file);
          newFile.dimensions = dimensions;
        }

        setFiles(prev => [...prev, newFile]);
      }
      
      toast.success(`تم رفع ${uploadedFiles.length} ملف بنجاح`);
    } catch (error) {
      toast.error('حدث خطأ أثناء رفع الملفات');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFileType = (mimeType: string): 'image' | 'video' | 'document' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => {
    const matchesType = filterType === 'all' || file.type === filterType;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const deleteFile = (fileId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      toast.success('تم حذف الملف');
    }
  };

  const toggleStar = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isStarred: !f.isStarred } : f
    ));
  };

  const copyUrl = (url: string, fileName: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`تم نسخ رابط ${fileName}`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      default: return File;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              إدارة الوسائط
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              ر��ع وإدارة الصور والفيديوهات والملفات
            </p>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'جاري الرفع...' : 'رفع ملفات'}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الملفات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">جميع الملفات</option>
            <option value="image">الصور</option>
            <option value="video">الفيديوهات</option>
            <option value="document">المستندات</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <File className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">إجمالي الملفات</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{files.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">الصور</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {files.filter(f => f.type === 'image').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <Video className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">الفيديوهات</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {files.filter(f => f.type === 'video').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">المفضلة</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {files.filter(f => f.isStarred).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Files Grid/List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {filteredFiles.length === 0 ? (
          <div className="p-12 text-center">
            <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              لا توجد ملفات
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'لا توجد ملفات تطابق معايير البحث'
                : 'ابدأ برفع الملفات لإدارتها هنا'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                رفع أول ملف
              </button>
            )}
          </div>
        ) : (
          <div className={`p-6 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
              : 'space-y-3'
          }`}>
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              
              return (
                <div
                  key={file.id}
                  className={`group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all ${
                    viewMode === 'grid' ? 'aspect-square' : 'flex items-center p-3'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Grid View */}
                      <div className="aspect-square w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileIcon className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => toggleStar(file.id)}
                            className="p-2 bg-white rounded-full text-gray-600 hover:text-yellow-500"
                          >
                            <Star className={`h-4 w-4 ${file.isStarred ? 'fill-current text-yellow-500' : ''}`} />
                          </button>
                          
                          <button
                            onClick={() => copyUrl(file.url, file.name)}
                            className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-500"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="p-2 bg-white rounded-full text-gray-600 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                        <p className="text-white text-xs truncate font-medium">
                          {file.name}
                        </p>
                        <p className="text-gray-300 text-xs">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="flex items-center flex-1">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          {file.type === 'image' ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <FileIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4 space-x-reverse">
                            <span>{formatFileSize(file.size)}</span>
                            {file.dimensions && (
                              <span>{file.dimensions.width} × {file.dimensions.height}</span>
                            )}
                            <span>{new Date(file.uploadDate).toLocaleDateString('ar-SA')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {file.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          
                          <button
                            onClick={() => toggleStar(file.id)}
                            className="p-1 text-gray-400 hover:text-yellow-500"
                          >
                            <Star className={`h-4 w-4 ${file.isStarred ? 'fill-current text-yellow-500' : ''}`} />
                          </button>
                          
                          <button
                            onClick={() => copyUrl(file.url, file.name)}
                            className="p-1 text-gray-400 hover:text-blue-500"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManager;
