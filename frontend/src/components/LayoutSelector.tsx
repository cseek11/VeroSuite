import React from 'react';
import { useLocation } from 'react-router-dom';
import LayoutWrapper from './LayoutWrapper';
import V4Layout from './layout/V4Layout';

interface LayoutSelectorProps {
  children: React.ReactNode;
}

export default function LayoutSelector({ children }: LayoutSelectorProps) {
  const location = useLocation();
  
  // Define which routes should use V4 layout
  const v4Routes = ['/settings', '/dashboard', '/resizable-dashboard', '/v4-dashboard', '/v4-test'];
  
  // Check user preference from localStorage
  const userPrefersV4 = localStorage.getItem('preferred-layout') === 'v4';
  
  // Use V4 layout if route is in v4Routes OR user prefers V4
  const shouldUseV4Layout = v4Routes.includes(location.pathname) || userPrefersV4;
  
  if (shouldUseV4Layout) {
    return <V4Layout>{children}</V4Layout>;
  }
  
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
