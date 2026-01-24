import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
}

export function DashboardLayout({ children, title, subtitle, description, actions }: DashboardLayoutProps) {
  const displayDescription = subtitle || description;
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Page Header */}
        {(title || actions) && (
          <header className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 lg:pl-6 pl-16">
              <div>
                {title && (
                  <h1 className="text-2xl font-display font-bold tracking-tight">
                    {title}
                  </h1>
                )}
                {displayDescription && (
                  <p className="text-muted-foreground mt-1">
                    {displayDescription}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          </header>
        )}
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 lg:pl-6 pl-16">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
