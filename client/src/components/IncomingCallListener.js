import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserEmail } from '../utils/auth';
import IncomingCall from './IncomingCall';

/**
 * Global WebSocket listener for incoming call notifications
 * This component maintains a WebSocket connection to receive incoming call notifications
 * even when the user is not in a video call
 */
const IncomingCallListener = () => {
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const userEmailRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userEmail = getUserEmail();
    userEmailRef.current = userEmail;
    
    // Only connect if user is logged in
    if (!userEmail) {
      return;
    }
    
    // Don't reconnect if already connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('✅ IncomingCallListener: WebSocket already connected, skipping');
      return;
    }

    const connectWebSocket = () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = API_URL.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '');
        const wsUrl = `${wsProtocol}//${wsHost}/webrtc-signaling`;

        console.log('🔌 IncomingCallListener: Connecting to WebSocket...', wsUrl);
        
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('✅ IncomingCallListener: WebSocket connected');
          setIsConnected(true);
          
          // Register user with a special "notification-only" room
          // This allows the server to know this user is online and can receive notifications
          ws.send(JSON.stringify({
            type: 'join-room',
            roomId: `notifications_${userEmail}`,
            userId: userEmail
          }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Only handle incoming-call messages
            if (data.type === 'incoming-call') {
              console.log('📞 IncomingCallListener: Received incoming call notification', data);
              
              // Use functional update to check current state
              setIncomingCall(prevCall => {
                // Only show notification if we're not already in a call
                if (!prevCall) {
                  console.log('✅ IncomingCallListener: Setting incoming call state');
                  return {
                    roomLink: data.roomLink,
                    roomId: data.roomId,
                    callerName: data.callerName || data.callerEmail,
                    callerEmail: data.callerEmail,
                    from: data.from
                  };
                } else {
                  console.log('⚠️ IncomingCallListener: Already have incoming call, ignoring');
                  return prevCall;
                }
              });
            }
          } catch (error) {
            console.error('IncomingCallListener: Error parsing message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('IncomingCallListener: WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          console.log('🔌 IncomingCallListener: WebSocket closed', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          setIsConnected(false);
          
          // Don't reconnect if it was an intentional close
          if (event.code === 1000) {
            console.log('✅ IncomingCallListener: WebSocket closed intentionally, not reconnecting');
            return;
          }
          
          // Reconnect after 3 seconds
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            if (userEmailRef.current) { // Only reconnect if still logged in
              console.log('🔄 IncomingCallListener: Attempting to reconnect...');
              connectWebSocket();
            }
          }, 3000);
        };
      } catch (error) {
        console.error('IncomingCallListener: Error connecting WebSocket:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []); // Empty deps - only run on mount/unmount

  const handleAccept = React.useCallback(() => {
    console.log('✅ IncomingCallListener: Accept button clicked');
    setIncomingCall(prevCall => {
      if (prevCall && prevCall.roomLink) {
        console.log('✅ IncomingCallListener: Redirecting to', prevCall.roomLink);
        setTimeout(() => {
          window.location.href = prevCall.roomLink;
        }, 100);
        return null;
      }
      return prevCall;
    });
  }, []);

  const handleDecline = React.useCallback(() => {
    console.log('❌ IncomingCallListener: Decline button clicked');
    setIncomingCall(null);
  }, []);

  if (!incomingCall) {
    return null;
  }

  return (
    <IncomingCall
      callerName={incomingCall.callerName}
      callerEmail={incomingCall.callerEmail}
      roomId={incomingCall.roomId}
      roomLink={incomingCall.roomLink}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
};

export default IncomingCallListener;
