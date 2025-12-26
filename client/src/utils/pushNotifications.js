/**
 * Push Notifications Utility
 * Handles browser push notifications for incoming video calls
 */

// Request notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

// Register service worker for push notifications
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
      
      // Request notification permission
      await requestNotificationPermission();
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

// Show browser notification
export function showNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.warn('Notifications not available or permission denied');
    return;
  }
  
  const notification = new Notification(title, {
    icon: '/logo192.png',
    badge: '/logo192.png',
    ...options
  });
  
  notification.onclick = (event) => {
    event.preventDefault();
    if (options.url) {
      window.open(options.url, '_blank');
    }
    notification.close();
  };
  
  return notification;
}

// Show incoming call notification
export function showIncomingCallNotification(callerName, callerEmail, roomLink, roomId) {
  const title = `📹 Cuộc gọi đến từ ${callerName || callerEmail}`;
  const body = `${callerName || callerEmail} muốn gọi video với bạn`;
  
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: `call-${roomId}`,
      requireInteraction: true,
      data: {
        type: 'video-call',
        roomLink,
        roomId,
        callerName,
        callerEmail
      },
      actions: [
        { action: 'accept', title: '✅ Chấp nhận' },
        { action: 'decline', title: '❌ Từ chối' }
      ]
    });
    
    notification.onclick = (event) => {
      event.preventDefault();
      window.location.href = roomLink;
      notification.close();
    };
    
    return notification;
  }
  
  // Fallback: Use browser alert if notifications not available
  if (window.confirm(`${title}\n\n${body}\n\nBạn có muốn tham gia cuộc gọi không?`)) {
    window.location.href = roomLink;
  }
}



