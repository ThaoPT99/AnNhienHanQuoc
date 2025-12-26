import React, { useEffect, useState } from 'react';
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
  const wsRef = React.useRef(null);
  const reconnectTimeoutRef = React.useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userEmail = getUserEmail();
    
    // Only connect if user is logged in
    if (!userEmail) {
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
              
              // Only show notification if we're not already in a call
              if (!incomingCall) {
                setIncomingCall({
                  roomLink: data.roomLink,
                  roomId: data.roomId,
                  callerName: data.callerName || data.callerEmail,
                  callerEmail: data.callerEmail,
                  from: data.from
                });
              }
            }
          } catch (error) {
            console.error('IncomingCallListener: Error parsing message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('IncomingCallListener: WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('🔌 IncomingCallListener: WebSocket closed, reconnecting...');
          setIsConnected(false);
          
          // Reconnect after 3 seconds
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            if (getUserEmail()) { // Only reconnect if still logged in
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

  const handleAccept = () => {
    if (incomingCall && incomingCall.roomLink) {
      setIncomingCall(null);
      window.location.href = incomingCall.roomLink;
    }
  };

  const handleDecline = () => {
    setIncomingCall(null);
  };

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
