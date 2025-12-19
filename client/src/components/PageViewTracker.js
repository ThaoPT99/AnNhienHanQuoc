import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PageViewTracker = () => {
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  useEffect(() => {
    // Skip tracking for admin routes
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-login')) {
      return;
    }

    // Get user agent and other info
    const userAgent = navigator.userAgent || 'Unknown';
    const referrer = document.referrer || null;
    const pagePath = location.pathname;

    // Parse user agent
    const parseUserAgent = (ua) => {
      if (!ua) return { deviceType: 'Unknown', browser: 'Unknown', os: 'Unknown' };
      
      const uaLower = ua.toLowerCase();
      let deviceType = 'Desktop';
      let browser = 'Unknown';
      let os = 'Unknown';
      
      // Detect device type
      if (uaLower.includes('mobile') || uaLower.includes('android') || uaLower.includes('iphone') || uaLower.includes('ipad')) {
        deviceType = 'Mobile';
      } else if (uaLower.includes('tablet') || uaLower.includes('ipad')) {
        deviceType = 'Tablet';
      }
      
      // Detect browser
      if (uaLower.includes('chrome') && !uaLower.includes('edg')) {
        browser = 'Chrome';
      } else if (uaLower.includes('firefox')) {
        browser = 'Firefox';
      } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
        browser = 'Safari';
      } else if (uaLower.includes('edg')) {
        browser = 'Edge';
      } else if (uaLower.includes('opera') || uaLower.includes('opr')) {
        browser = 'Opera';
      }
      
      // Detect OS
      if (uaLower.includes('windows')) {
        os = 'Windows';
      } else if (uaLower.includes('mac')) {
        os = 'macOS';
      } else if (uaLower.includes('linux')) {
        os = 'Linux';
      } else if (uaLower.includes('android')) {
        os = 'Android';
      } else if (uaLower.includes('ios') || uaLower.includes('iphone') || uaLower.includes('ipad')) {
        os = 'iOS';
      }
      
      return { deviceType, browser, os };
    };

    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // Log visit to backend
    const logVisit = async () => {
      try {
        await axios.post(`${API_URL}/api/visits/log`, {
          pagePath,
          referrer,
          userAgent,
          deviceType,
          browser,
          os
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Error logging visit:', error);
      }
    };

    // Small delay to ensure page is loaded
    const timeoutId = setTimeout(logVisit, 500);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, API_URL]);

  return null; // This component doesn't render anything
};

export default PageViewTracker;


