import React from 'react';
import ReactDOM from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import logger from './utils/logger';
import './index.css';
import App from './App';

// Initialize vConsole for mobile debugging
// Only enable on mobile devices or when VCONSOLE env var is set
const enableVConsole = () => {
  // Check if we're on mobile or if VCONSOLE is enabled via URL param
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const urlParams = new URLSearchParams(window.location.search);
  const vconsoleParam = urlParams.get('vconsole');
  
  if (isMobile || vconsoleParam === '1' || process.env.REACT_APP_ENABLE_VCONSOLE === 'true') {
    import('vconsole').then((module) => {
      const VConsole = module.default;
      window.vConsole = new VConsole({
        theme: 'dark',
        defaultPlugins: ['system', 'network', 'element', 'storage'],
        onReady: function () {
          console.log('✅ vConsole ready - You can now see console logs on mobile!');
          console.log('📱 vConsole is active. All console.log, console.error, etc. will appear here.');
        },
        onClearLog: function () {
          console.log('🧹 vConsole log cleared');
        }
      });
      logger.info('vConsole enabled for mobile debugging');
    }).catch((err) => {
      console.error('Failed to load vConsole:', err);
    });
  }
};

// Enable vConsole
enableVConsole();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA (only for web, not native)
if (!Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        logger.info('Service Worker registered:', registration);
      })
      .catch((registrationError) => {
        logger.error('Service Worker registration failed:', registrationError);
      });
  });
}

