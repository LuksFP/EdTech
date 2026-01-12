import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  GraduationCap
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: BookOpen, label: 'Cursos', path: '/admin/courses' },
  { icon: Users, label: 'Alunos', path: '/admin/students' },
  { icon: BarChart3, label: 'Relatórios', path: '/admin/reports' },
  { icon: Settings, label: 'Configurações', path: '/admin/settings' },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-sidebar-foreground">Admin</h2>
              <p className="text-xs text-sidebar-foreground/60">Painel de Controle</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/admin' && location.pathname.startsWith(item.path));
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="p-4 rounded-lg bg-sidebar-accent">
            <h3 className="font-medium text-sm text-sidebar-accent-foreground">Precisa de ajuda?</h3>
            <p className="text-xs text-sidebar-foreground/60 mt-1">
              Acesse nossa central de suporte
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
