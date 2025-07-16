
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import FloatingMockDataButton from "@/components/FloatingMockDataButton";

const MainLayout: React.FC = () => {
  // Ativa sincronização em tempo real para toda a aplicação
  useRealTimeSync();

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-background transition-colors duration-300">
      <FloatingMockDataButton />
      <Navbar />
      <main className="flex-grow overflow-y-auto bg-slate-50 dark:bg-background">
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 lg:py-6">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;
