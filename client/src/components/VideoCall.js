import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './VideoCall.css';

const VideoCall = ({ roomId, onClose, userEmail, userName }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showRoomInfo, setShowRoomInfo] = useState(false); // Hide by default on mobile
  const [roomLink, setRoomLink] = useState('');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  // WebRTC Configuration (using free STUN servers)
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    // Generate room link
    const link = `${window.location.origin}/video-call?room=${roomId}`;
    setRoomLink(link);
    
    // Show room info on desktop, hide on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setShowRoomInfo(!isMobile);
    
    initializeCall();
    return () => {
      cleanup();
    };
  }, [roomId]);

  const initializeCall = async () => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // Mobile-optimized constraints
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const videoConstraints = isMobile ? {
        facingMode: 'user', // Front camera on mobile
        width: { ideal: 640 },
        height: { ideal: 480 }
      } : {
        width: { ideal: 1280 },
        height: { ideal: 720 }
      };

      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        // Important for mobile: set playsInline and autoplay
        localVideoRef.current.setAttribute('playsinline', 'true');
        localVideoRef.current.setAttribute('autoplay', 'true');
        localVideoRef.current.setAttribute('muted', 'true');
      }

      // Create peer connection
      const pc = new RTCPeerConnection(rtcConfiguration);
      peerConnectionRef.current = pc;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle remote stream
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          // Important for mobile: set playsInline and autoplay
          remoteVideoRef.current.setAttribute('playsinline', 'true');
          remoteVideoRef.current.setAttribute('autoplay', 'true');
        }
        setIsCallActive(true);
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        setConnectionStatus(pc.connectionState);
        if (pc.connectionState === 'connected') {
          setIsConnected(true);
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setIsConnected(false);
        }
      };

      // Start WebSocket signaling
      startSignaling(pc);

    } catch (err) {
      console.error('Error accessing media devices:', err);
      let errorMessage = 'Không thể truy cập camera/microphone.';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Vui lòng cho phép truy cập camera và microphone trong cài đặt trình duyệt.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'Không tìm thấy camera hoặc microphone. Vui lòng kiểm tra thiết bị.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera hoặc microphone đang được sử dụng bởi ứng dụng khác.';
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        errorMessage = 'Thiết bị không hỗ trợ yêu cầu video/audio.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Trình duyệt không hỗ trợ video call. Vui lòng dùng Chrome, Firefox hoặc Safari.';
      }
      
      setError(errorMessage);
    }
  };

  const startSignaling = async (pc) => {
    try {
      // Connect to WebSocket signaling server
      const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
      
      // Always use WSS for secure connection (required for mobile)
      const wsProtocol = 'wss:';
      const wsHost = API_URL.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '');
      const wsUrl = `${wsProtocol}//${wsHost}/webrtc-signaling`;
      
      console.log('🔌 Connecting to signaling server:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;
      
      // Handle connection errors
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
      };

      ws.onopen = () => {
        console.log('✅ Connected to signaling server');
        setConnectionStatus('connecting');
        
        // Join room
        ws.send(JSON.stringify({
          type: 'join-room',
          roomId: roomId,
          userId: userEmail || `user_${Date.now()}`
        }));
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('📨 Received signaling message:', data.type);

        switch (data.type) {
          case 'room-joined':
            setConnectionStatus('connected');
            // Create offer after joining
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            ws.send(JSON.stringify({
              type: 'offer',
              roomId: roomId,
              offer: offer
            }));
            break;

          case 'offer':
            // Received offer from another peer
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws.send(JSON.stringify({
              type: 'answer',
              roomId: roomId,
              answer: answer
            }));
            break;

          case 'answer':
            // Received answer from another peer
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            break;

          case 'ice-candidate':
            // Received ICE candidate
            if (data.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
            break;

          case 'user-joined':
            console.log('👤 User joined:', data.userId);
            setParticipants(prev => {
              if (!prev.find(p => p.userId === data.userId)) {
                return [...prev, { userId: data.userId, joinedAt: new Date() }];
              }
              return prev;
            });
            break;

          case 'user-left':
            console.log('👋 User left:', data.userId);
            setParticipants(prev => prev.filter(p => p.userId !== data.userId));
            break;

          case 'room-joined':
            if (data.usersInRoom) {
              setParticipants(data.usersInRoom.map(uid => ({ userId: uid, joinedAt: new Date() })));
            }
            break;
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Lỗi kết nối signaling server. Đang thử lại...');
        // Retry connection after 3 seconds
        setTimeout(() => {
          if (socketRef.current?.readyState === WebSocket.CLOSED) {
            startSignaling(pc);
          }
        }, 3000);
      };

      ws.onclose = () => {
        console.log('🔌 Signaling connection closed');
        setConnectionStatus('disconnected');
        setIsConnected(false);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'ice-candidate',
            roomId: roomId,
            candidate: event.candidate
          }));
        }
      };

    } catch (err) {
      console.error('Error setting up signaling:', err);
      setError('Lỗi khi thiết lập kết nối. Vui lòng thử lại.');
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    cleanup();
    if (onClose) {
      onClose();
    }
  };

  const cleanup = () => {
    // Leave room before closing
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'leave-room',
        roomId: roomId
      }));
    }

    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Close socket if exists
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setIsConnected(false);
    setIsCallActive(false);
    setRemoteStream(null);
    setLocalStream(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="video-call-container"
      >
        <div className="video-call-header">
          <div className="header-left">
            <h3>📹 Video Call</h3>
            <button 
              className="info-toggle-btn"
              onClick={() => setShowRoomInfo(!showRoomInfo)}
              title="Thông tin phòng"
            >
              {showRoomInfo ? '📋' : 'ℹ️'}
            </button>
          </div>
          <button className="close-btn" onClick={endCall}>×</button>
        </div>

        {showRoomInfo && (
          <div className={`room-info-panel ${showRoomInfo ? 'show' : ''}`}>
            <div className="room-info-section">
              <h4>🔗 Chia sẻ phòng với người khác</h4>
              <div className="room-link-container">
                <input 
                  type="text" 
                  value={roomLink} 
                  readOnly 
                  className="room-link-input"
                />
                <button 
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(roomLink);
                    alert('✅ Đã copy link! Gửi link này cho người bạn muốn gọi.');
                  }}
                >
                  📋 Copy
                </button>
              </div>
              <p className="room-id">Room ID: <code>{roomId}</code></p>
            </div>
            
            <div className="participants-section">
              <h4>👥 Người tham gia ({participants.length + 1})</h4>
              <div className="participants-list">
                <div className="participant-item you">
                  <span className="participant-avatar">👤</span>
                  <div className="participant-info">
                    <span className="participant-name">{userName || userEmail || 'Bạn'}</span>
                    <span className="participant-status you-badge">Bạn</span>
                  </div>
                </div>
                {participants.map((p, idx) => (
                  <div key={idx} className="participant-item">
                    <span className="participant-avatar">👤</span>
                    <div className="participant-info">
                      <span className="participant-name">{p.userId}</span>
                      <span className="participant-status">Đã tham gia</span>
                    </div>
                  </div>
                ))}
                {participants.length === 0 && (
                  <p className="waiting-participant">Đang chờ người tham gia...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="video-call-content">
          {/* Remote video (other person) */}
          <div className="remote-video-container">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                webkit-playsinline="true"
                className="remote-video"
              />
            ) : (
              <div className="waiting-for-peer">
                <div className="waiting-spinner"></div>
                <p>Đang chờ người tham gia...</p>
                <p className="connection-status">Trạng thái: {connectionStatus}</p>
              </div>
            )}
          </div>

          {/* Local video (self) */}
          <div className="local-video-container">
            {localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                webkit-playsinline="true"
                muted
                className="local-video"
              />
            ) : (
              <div className="no-video">
                <span>📷</span>
                <p>Đang tải camera...</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="video-call-controls">
          <button
            className={`control-btn ${isMuted ? 'muted' : ''}`}
            onClick={toggleMute}
            title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
          >
            {isMuted ? '🔇' : '🎤'}
          </button>
          <button
            className={`control-btn ${isVideoOff ? 'video-off' : ''}`}
            onClick={toggleVideo}
            title={isVideoOff ? 'Bật camera' : 'Tắt camera'}
          >
            {isVideoOff ? '📷❌' : '📹'}
          </button>
          <button
            className="control-btn end-call"
            onClick={endCall}
            title="Kết thúc cuộc gọi"
          >
            📞
          </button>
        </div>

        <div className="call-info">
          <p>👤 {userName || userEmail}</p>
          <p className="status-indicator">
            {isConnected ? '🟢 Đã kết nối' : '🟡 Đang kết nối...'}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCall;

