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
    initializeCall();
    return () => {
      cleanup();
    };
  }, [roomId]);

  const initializeCall = async () => {
    try {
      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
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
        }
        setIsCallActive(true);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('ice-candidate', {
            roomId,
            candidate: event.candidate
          });
        }
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

      // For now, we'll use a simple signaling mechanism
      // In production, you'd use WebSocket or Socket.io
      startSignaling(pc);

    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Không thể truy cập camera/microphone. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  const startSignaling = async (pc) => {
    // Simple peer-to-peer connection without signaling server
    // This works for same-page testing, but in production you need a signaling server
    
    // For demo: Create offer and set local description
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      // In production, send offer via WebSocket to other peer
      // For now, we'll simulate by creating answer on same page
      // This is just for demonstration
      
      console.log('Offer created:', offer);
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Lỗi khi thiết lập kết nối');
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
          <h3>📹 Video Call - Room: {roomId}</h3>
          <button className="close-btn" onClick={endCall}>×</button>
        </div>

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

