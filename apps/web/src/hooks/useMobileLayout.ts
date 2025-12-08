import { useState, useEffect, useCallback } from 'react';

export interface MobileLayoutConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
}

interface UseMobileLayoutOptions {
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
}

interface UseMobileLayoutReturn {
  config: MobileLayoutConfig;
  shouldStackVertically: boolean;
  shouldHideRegion: (isHiddenMobile: boolean) => boolean;
}

export function useMobileLayout({
  mobileBreakpoint = 768,
  tabletBreakpoint = 1024
}: UseMobileLayoutOptions = {}): UseMobileLayoutReturn {
  const [config, setConfig] = useState<MobileLayoutConfig>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  const updateConfig = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    setConfig({
      isMobile: width < mobileBreakpoint,
      isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
      isDesktop: width >= tabletBreakpoint,
      screenWidth: width,
      screenHeight: height
    });
  }, [mobileBreakpoint, tabletBreakpoint]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateConfig();

    const handleResize = () => {
      updateConfig();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateConfig]);

  const shouldStackVertically = config.isMobile || config.isTablet;

  const shouldHideRegion = useCallback((isHiddenMobile: boolean): boolean => {
    return isHiddenMobile && config.isMobile;
  }, [config.isMobile]);

  return {
    config,
    shouldStackVertically,
    shouldHideRegion
  };
}





