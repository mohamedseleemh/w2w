import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Menu, X, Bell, Search, Settings, User, LogOut,
  LayoutDashboard, Shield, Activity, HelpCircle
} from 'lucide-react';
import { SuperThemeToggle, SuperLanguageToggle, SuperButton } from '../ui';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);

  const sidebarItems = [
    { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard, href: '/admin' },
    { id: 'security', label: 'الأمان', icon: Shield, href: '/admin/security' },
    { id: 'activity', label: 'النشاط', icon: Activity, href: '/admin/activity' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, href: '/admin/settings' },
    { id: 'help', label: 'المساعدة', icon: HelpCircle, href: '/admin/help' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">KYC Admin</span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Menu className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center ${isSidebarOpen ? 'px-3 py-2' : 'px-2 py-2 justify-center'} rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white group`}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="mr-3 text-sm font-medium">{item.label}</span>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${isSidebarOpen ? 'space-x-3 space-x-reverse' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">مدير النظام</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@kyctrust.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                ل��حة الإدارة
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Theme Toggle */}
              <SuperThemeToggle />
              
              {/* Language Toggle */}
              <SuperLanguageToggle />

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
