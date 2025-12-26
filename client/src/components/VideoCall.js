import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './VideoCall.css';

const VideoCall = ({ roomId, onClose, userEmail, userName }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null); // Keep for backward compatibility
  const [remoteStreams, setRemoteStreams] = useState(new Map()); // Map<userId, MediaStream>
  const [localStream, setLocalStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showRoomInfo, setShowRoomInfo] = useState(false); // Hide by default on mobile
  const [roomLink, setRoomLink] = useState('');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const peerConnectionsRef = useRef(new Map()); // Map<userId, RTCPeerConnection>
  const remoteStreamsRef = useRef(new Map()); // Map<userId, MediaStream>
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  // WebRTC Configuration (using free STUN servers)
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10 // Pre-gather ICE candidates for faster connection
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

  // Update local video element when stream changes
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      console.log('📹 Updating local video element with stream');
      console.log('📹 Local stream tracks:', localStream.getTracks().map(t => `${t.kind} (${t.enabled ? 'enabled' : 'disabled'})`));
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.setAttribute('playsinline', 'true');
      localVideoRef.current.setAttribute('autoplay', 'true');
      localVideoRef.current.muted = true;
      
      // Force play
      const playPromise = localVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('✅ Local video playing (from useEffect)');
          console.log('📹 Local video element:', {
            videoWidth: localVideoRef.current.videoWidth,
            videoHeight: localVideoRef.current.videoHeight,
            readyState: localVideoRef.current.readyState,
            paused: localVideoRef.current.paused
          });
        }).catch(err => {
          console.error('❌ Error playing local video (from useEffect):', err);
        });
      }
    } else if (!localStream) {
      console.log('⚠️ No local stream available');
    } else if (!localVideoRef.current) {
      console.error('❌ Local video ref is null!');
    }
  }, [localStream]);

  // Update remote video element when stream changes
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      console.log('📹 Updating remote video element with stream');
      console.log('📹 Remote stream tracks:', remoteStream.getTracks().map(t => `${t.kind} (${t.enabled ? 'enabled' : 'disabled'})`));
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.setAttribute('playsinline', 'true');
      remoteVideoRef.current.setAttribute('autoplay', 'true');
      remoteVideoRef.current.muted = false;
      
      // Force play
      const playPromise = remoteVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('✅ Remote video playing (from useEffect)');
          console.log('📹 Remote video element:', {
            videoWidth: remoteVideoRef.current.videoWidth,
            videoHeight: remoteVideoRef.current.videoHeight,
            readyState: remoteVideoRef.current.readyState,
            paused: remoteVideoRef.current.paused
          });
        }).catch(err => {
          console.error('❌ Error playing remote video (from useEffect):', err);
        });
      }
    } else if (!remoteStream) {
      console.log('⚠️ No remote stream available');
    } else if (!remoteVideoRef.current) {
      console.error('❌ Remote video ref is null!');
    }
  }, [remoteStream]);


  const initializeCall = async () => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // Set a timeout for getting user media (10 seconds)
      const mediaTimeout = setTimeout(() => {
        if (!localStreamRef.current) {
          setError('Đang chờ quyền truy cập camera/microphone quá lâu. Vui lòng cho phép và tải lại trang.');
        }
      }, 10000);

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
      console.log('🎥 Requesting camera and microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('✅ Camera and microphone accessed successfully');
      console.log('📹 Stream tracks:', stream.getTracks().map(t => `${t.kind} (${t.enabled ? 'enabled' : 'disabled'})`));
      
      clearTimeout(mediaTimeout);
      localStreamRef.current = stream;
      setLocalStream(stream);
      
      // Wait a bit for video element to be ready
      setTimeout(() => {
        if (localVideoRef.current) {
          console.log('📹 Setting local video element srcObject...');
          localVideoRef.current.srcObject = stream;
          // Important for mobile: set playsInline and autoplay
          localVideoRef.current.setAttribute('playsinline', 'true');
          localVideoRef.current.setAttribute('autoplay', 'true');
          localVideoRef.current.setAttribute('muted', 'true');
          
          // Play the video
          localVideoRef.current.play().then(() => {
            console.log('✅ Local video playing');
          }).catch(err => {
            console.error('❌ Error playing local video:', err);
          });
        } else {
          console.error('❌ Local video ref is null!');
        }
      }, 100);

      // Create peer connection
      const pc = new RTCPeerConnection(rtcConfiguration);
      peerConnectionRef.current = pc;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle remote stream
      pc.ontrack = (event) => {
        console.log('📹 Received remote track:', event.track.kind, 'enabled:', event.track.enabled);
        const remoteStream = event.streams[0];
        if (remoteStream) {
          console.log('📹 Remote stream tracks:', remoteStream.getTracks().map(t => `${t.kind} (${t.enabled ? 'enabled' : 'disabled'})`));
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            // Important for mobile: set playsInline and autoplay
            remoteVideoRef.current.setAttribute('playsinline', 'true');
            remoteVideoRef.current.setAttribute('autoplay', 'true');
            remoteVideoRef.current.muted = false; // Enable audio
            console.log('✅ Remote video element updated with stream');
            
            // Play the video
            remoteVideoRef.current.play().then(() => {
              console.log('✅ Remote video playing');
            }).catch(err => {
              console.error('❌ Error playing remote video:', err);
            });
          }
          setIsCallActive(true);
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log('🔗 Peer connection state:', pc.connectionState);
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
        
        // Use consistent userId (prefer email, fallback to generated ID stored in ref)
        const currentUserId = userEmail || `user_${Date.now()}`;
        if (!socketRef.current.userId) {
          socketRef.current.userId = currentUserId;
        }
        
        // Join room
        ws.send(JSON.stringify({
          type: 'join-room',
          roomId: roomId,
          userId: socketRef.current.userId
        }));
        console.log('📤 Sent join-room with userId:', socketRef.current.userId);
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('📨 Received signaling message:', data.type);

        switch (data.type) {
          case 'room-joined':
            console.log('✅ Joined room, existing users:', data.usersInRoom);
            console.log('👤 My userId from server:', data.userId);
            setConnectionStatus('connected');
            
            // Store our userId from server
            if (data.userId && socketRef.current) {
              socketRef.current.userId = data.userId;
            }
            
            // Update participants list: include existing users (not including myself)
            const allParticipants = data.usersInRoom 
              ? [...data.usersInRoom.map(uid => ({ userId: uid, joinedAt: new Date() }))]
              : [];
            console.log('👥 Setting participants from room-joined:', allParticipants.map(p => p.userId));
            console.log('👥 Total participants count (including myself):', allParticipants.length + 1);
            setParticipants(allParticipants);
            
            // Only create offer if there are other users in room
            // Create separate peer connection and offer for each existing user
            if (data.usersInRoom && data.usersInRoom.length > 0) {
              console.log('👥 Other users in room, creating offers for each...');
              for (const userId of data.usersInRoom) {
                try {
                  // Create peer connection for this user
                  const userPc = new RTCPeerConnection(rtcConfiguration);
                  peerConnectionsRef.current.set(userId, userPc);
                  
                  // Add local stream tracks
                  if (localStreamRef.current) {
                    localStreamRef.current.getTracks().forEach(track => {
                      userPc.addTrack(track, localStreamRef.current);
                    });
                  }
                  
                  // Handle remote stream from this user
                  userPc.ontrack = (event) => {
                    console.log('📹 Received remote track from', userId, ':', event.track.kind);
                    const remoteStream = event.streams[0];
                    if (remoteStream) {
                      console.log('📹 Remote stream tracks from', userId, ':', remoteStream.getTracks().map(t => `${t.kind} (${t.enabled ? 'enabled' : 'disabled'})`));
                      remoteStreamsRef.current.set(userId, remoteStream);
                      setRemoteStreams(new Map(remoteStreamsRef.current));
                      setRemoteStream(remoteStream); // For backward compatibility
                    }
                  };
                  
                  // Handle ICE candidates
                  userPc.onicecandidate = (event) => {
                    if (event.candidate) {
                      ws.send(JSON.stringify({
                        type: 'ice-candidate',
                        roomId: roomId,
                        candidate: event.candidate,
                        to: userId
                      }));
                    }
                  };
                  
                  // Create and send offer
                  const offer = await userPc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                  });
                  await userPc.setLocalDescription(offer);
                  console.log('✅ Local description set (offer) for', userId);
                  ws.send(JSON.stringify({
                    type: 'offer',
                    roomId: roomId,
                    offer: offer,
                    to: userId
                  }));
                  console.log('📤 Sent offer to', userId);
                } catch (error) {
                  console.error('❌ Error creating offer for', userId, ':', error);
                }
              }
            } else {
              console.log('👤 First user in room, waiting for others...');
            }
            break;

          case 'offer':
            // Received offer from another peer - create separate peer connection for this user
            console.log('📥 Received offer from:', data.from);
            try {
              // Check if we already have a peer connection for this user
              let userPc = peerConnectionsRef.current.get(data.from);
              if (!userPc) {
                console.log('🔗 Creating new peer connection for:', data.from);
                userPc = new RTCPeerConnection(rtcConfiguration);
                peerConnectionsRef.current.set(data.from, userPc);
                
                // Add local stream tracks to this peer connection
                if (localStreamRef.current) {
                  localStreamRef.current.getTracks().forEach(track => {
                    userPc.addTrack(track, localStreamRef.current);
                  });
                }
                
                // Handle remote stream from this user
                userPc.ontrack = (event) => {
                  console.log('📹 Received remote track from', data.from, ':', event.track.kind);
                  const remoteStream = event.streams[0];
                  if (remoteStream) {
                    console.log('📹 Remote stream tracks from', data.from, ':', remoteStream.getTracks().map(t => `${t.kind} (${t.enabled ? 'enabled' : 'disabled'})`));
                    // Store in Map
                    remoteStreamsRef.current.set(data.from, remoteStream);
                    // Update state
                    setRemoteStreams(new Map(remoteStreamsRef.current));
                    // Also set as main remote stream for backward compatibility
                    setRemoteStream(remoteStream);
                  }
                };
                
                // Handle ICE candidates
                userPc.onicecandidate = (event) => {
                  if (event.candidate) {
                    ws.send(JSON.stringify({
                      type: 'ice-candidate',
                      roomId: roomId,
                      candidate: event.candidate,
                      to: data.from
                    }));
                  }
                };
              }
              
              await userPc.setRemoteDescription(new RTCSessionDescription(data.offer));
              console.log('✅ Remote description set (offer) for', data.from);
              
              const answer = await userPc.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
              });
              await userPc.setLocalDescription(answer);
              console.log('✅ Local description set (answer) for', data.from);
              
              ws.send(JSON.stringify({
                type: 'answer',
                roomId: roomId,
                answer: answer,
                to: data.from
              }));
              console.log('📤 Sent answer to:', data.from);
            } catch (error) {
              console.error('❌ Error handling offer:', error);
            }
            break;

          case 'answer':
            // Received answer from another peer - use the peer connection for this user
            console.log('📥 Received answer from:', data.from);
            try {
              const userPc = peerConnectionsRef.current.get(data.from) || peerConnectionRef.current;
              if (userPc.signalingState !== 'stable') {
                await userPc.setRemoteDescription(new RTCSessionDescription(data.answer));
                console.log('✅ Remote description set (answer) for', data.from);
              } else {
                console.log('⚠️ Signaling state is stable for', data.from, ', answer may be duplicate');
              }
            } catch (error) {
              console.error('❌ Error handling answer:', error);
            }
            break;

          case 'ice-candidate':
            // Received ICE candidate - add to the peer connection for this user
            if (data.candidate) {
              try {
                const userPc = peerConnectionsRef.current.get(data.from) || peerConnectionRef.current;
                // Wait for remote description if not set yet
                if (!userPc.remoteDescription) {
                  console.log('⏳ Waiting for remote description before adding ICE candidate for', data.from);
                  // Store candidate and add later
                  setTimeout(async () => {
                    try {
                      await userPc.addIceCandidate(new RTCIceCandidate(data.candidate));
                      console.log('✅ ICE candidate added (delayed) for', data.from);
                    } catch (err) {
                      console.error('❌ Error adding delayed ICE candidate for', data.from, ':', err);
                    }
                  }, 500);
                } else {
                  await userPc.addIceCandidate(new RTCIceCandidate(data.candidate));
                  console.log('✅ ICE candidate added for', data.from);
                }
              } catch (error) {
                console.error('❌ Error adding ICE candidate for', data.from, ':', error);
                const userPc = peerConnectionsRef.current.get(data.from) || peerConnectionRef.current;
                if (userPc.remoteDescription) {
                  console.warn('⚠️ Remote description exists but failed to add candidate for', data.from);
                }
              }
            }
            break;

          case 'user-joined':
            console.log('👤 User joined:', data.userId);
            setParticipants(prev => {
              // Check if user already exists
              const exists = prev.find(p => p.userId === data.userId);
              if (exists) {
                console.log('⚠️ User already in participants list:', data.userId);
                console.log('👥 Current participants:', prev.map(p => p.userId));
                return prev;
              }
              const updated = [...prev, { userId: data.userId, joinedAt: new Date() }];
              console.log('✅ Updated participants list after user-joined:', updated.map(p => p.userId));
              console.log('👥 Total participants count (including myself):', updated.length + 1);
              return updated;
            });
            
            // NOTE: When a new user joins, they will create offer themselves (in room-joined handler)
            // We (existing user) should NOT create offer here, just wait for their offer and respond with answer
            console.log('👤 New user joined, waiting for their offer...');
            break;

          case 'participants-updated':
            // Server sent updated participants list - sync with server
            console.log('🔄 Participants updated from server:', data.participants);
            const currentUserId = socketRef.current?.userId || userEmail || `user_${Date.now()}`;
            const otherParticipants = data.participants
              .filter(uid => uid !== currentUserId)
              .map(uid => ({ userId: uid, joinedAt: new Date() }));
            console.log('👥 Setting participants from server (excluding myself):', otherParticipants.map(p => p.userId));
            console.log('👥 Total participants count (including myself):', otherParticipants.length + 1);
            setParticipants(otherParticipants);
            break;

          case 'user-left':
            console.log('👋 User left:', data.userId);
            setParticipants(prev => {
              const updated = prev.filter(p => p.userId !== data.userId);
              console.log('✅ Updated participants after user left:', updated.map(p => p.userId));
              return updated;
            });
            // Clean up peer connection and remote stream for this user
            const leftUserPc = peerConnectionsRef.current.get(data.userId);
            if (leftUserPc) {
              leftUserPc.close();
              peerConnectionsRef.current.delete(data.userId);
              console.log('🔌 Closed peer connection for', data.userId);
            }
            remoteStreamsRef.current.delete(data.userId);
            setRemoteStreams(new Map(remoteStreamsRef.current));
            // If this was the main remote stream, clear it
            if (remoteStream && remoteStreamsRef.current.size === 0) {
              setRemoteStream(null);
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

    // Close all peer connections
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    // Close all peer connections in Map
    peerConnectionsRef.current.forEach((pc, userId) => {
      pc.close();
      console.log('🔌 Closed peer connection for', userId);
    });
    peerConnectionsRef.current.clear();
    remoteStreamsRef.current.clear();
    setRemoteStreams(new Map());

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
          {/* Remote videos (other people) - Grid layout */}
          <div className="remote-video-container">
            {remoteStreams.size > 0 ? (
              <div className="remote-videos-grid">
                {Array.from(remoteStreams.entries()).map(([userId, stream]) => (
                  <div key={userId} className="remote-video-item">
                    <video
                      autoPlay
                      playsInline
                      webkit-playsinline="true"
                      className="remote-video"
                      ref={(el) => {
                        if (el && stream) {
                          el.srcObject = stream;
                          el.play().catch(err => console.error('Error playing video for', userId, ':', err));
                        }
                      }}
                    />
                    <div className="remote-video-label">{userId}</div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Keep single video for backward compatibility */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  webkit-playsinline="true"
                  className="remote-video"
                  style={{ display: remoteStream ? 'block' : 'none' }}
                />
                {!remoteStream && (
                  <div className="waiting-for-peer">
                    <div className="waiting-spinner"></div>
                    <p>Đang chờ người tham gia...</p>
                    <p className="connection-status">Trạng thái: {connectionStatus}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Local video (self) */}
          <div className="local-video-container">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              webkit-playsinline="true"
              muted
              className="local-video"
              style={{ display: localStream ? 'block' : 'none' }}
            />
            {!localStream && (
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

