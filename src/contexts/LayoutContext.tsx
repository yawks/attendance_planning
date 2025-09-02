import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  isDesktopCollapsed: boolean;
  toggleDesktopSidebar: () => void;
  isMobileOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileOpen: (isOpen: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isDesktopCollapsed, setDesktopCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const toggleDesktopSidebar = () => {
    setDesktopCollapsed(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(prev => !prev);
  };

  const value = {
    isDesktopCollapsed,
    toggleDesktopSidebar,
    isMobileOpen,
    toggleMobileMenu,
    setMobileOpen,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
