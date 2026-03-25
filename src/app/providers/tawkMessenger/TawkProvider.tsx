'use client';

import { useEffect } from 'react';

interface TawkAPI {
  hideWidget: () => void;
  showWidget: () => void;
  setAttributes?: (attributes: Record<string, unknown>, callback?: () => void) => void;
  onLoad?: () => void;
  [key: string]: unknown;
}

declare global {
  interface Window {
    Tawk_API?: TawkAPI;
  }
}

const TawkProvider = () => {

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/6889c86a76f67519325e55f3/1j1d3dogh';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default TawkProvider;