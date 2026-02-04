import React, { useState } from 'react';
import { Menu } from './ui/Icons';
import Sidebar from './Sidebar';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  userProfile: UserProfile;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout, userProfile }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      <Sidebar 
        onLogout={onLogout} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userProfile={userProfile}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-900">CareerFlow AI</span>
          <div className="w-8" /> {/* Spacer */}
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;