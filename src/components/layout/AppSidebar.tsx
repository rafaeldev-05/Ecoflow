import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/ui/Logo';
import { NAV_ITEMS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Truck,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  Truck,
  BarChart3,
  Users,
  Settings
};

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { profile, role, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = role ? NAV_ITEMS[role] || NAV_ITEMS.operacional : NAV_ITEMS.operacional;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-sidebar-border',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <Logo 
          showText={!isCollapsed} 
          variant="light" 
          size={isCollapsed ? 'sm' : 'md'} 
        />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'text-sidebar-foreground/70 hover:text-sidebar-foreground',
                'hover:bg-sidebar-accent',
                isActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90',
                isCollapsed && 'justify-center px-2'
              )}
            >
              {Icon && <Icon size={20} />}
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={cn(
        'p-4 border-t border-sidebar-border',
        isCollapsed && 'px-2'
      )}>
        <div className={cn(
          'flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50',
          isCollapsed && 'justify-center'
        )}>
          <div className="w-9 h-9 rounded-full bg-sidebar-primary/30 flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-sidebar-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-sidebar-foreground">
                {profile?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {role || 'operacional'}
              </p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            'w-full mt-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
            isCollapsed && 'px-2'
          )}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-md"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] z-50 sidebar-gradient flex flex-col"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col sidebar-gradient border-r border-sidebar-border transition-all duration-300',
          isCollapsed ? 'w-[72px]' : 'w-[260px]',
          className
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
