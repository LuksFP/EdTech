import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdminSidebar />
      <main className="ml-64 pt-4 pb-8 px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
