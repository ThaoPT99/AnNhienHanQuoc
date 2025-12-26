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
  const [showDebugLogs, setShowDebugLogs] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const peerConnectionsRef = useRef(new Map()); // Map<userId, RTCPeerConnection>
  const remoteStreamsRef = useRef(new Map()); // Map<userId, MediaStream>
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const retryCountsRef = useRef(new Map()); // Map<userId, number> - track retry attempts per user
  const MAX_RETRY_ATTEMPTS = 2; // Maximum retry attempts per user

  // Helper function to add debug log
  const addDebugLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    const logEntry = { timestamp, message, type };
    setDebugLogs(prev => [...prev.slice(-49), logEntry]); // Keep last 50 logs
    console.log(message);
  };

  // WebRTC Configuration (using multiple STUN servers and free TURN servers)
  const rtcConfiguration = {
    iceServers: [
      // Google STUN servers
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      // Additional STUN servers
      { urls: 'stun:stun.stunprotocol.org:3478' },
      { urls: 'stun:stun.voiparound.com' },
      { urls: 'stun:stun.voipbuster.com' },
      { urls: 'stun:stun.voipstunt.com' },
      // Railway TURN Server - DISABLED (Railway doesn't support UDP via public domain)
      // Uncomment below if Railway adds UDP support in the future
      /*
      {
        urls: [
          'turn:turn-server-production-f957.up.railway.app:3478',
          'turn:turn-server-production-f957.up.railway.app:3478?transport=tcp'
        ],
        username: 'railway',
        credential: 'railway'
      },
      */
      // Free TURN servers (for NAT traversal when STUN fails)
      // Note: Free TURN servers are often unreliable or blocked
      // For production, consider using a dedicated TURN server
      
      // Metered.ca Open Relay (free, no auth required)
      { 
        urls: [
          'turn:openrelay.metered.ca:80',
          'turn:openrelay.metered.ca:443',
          'turn:openrelay.metered.ca:443?transport=tcp'
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      // Xirsys free TURN (public demo credentials - may have limits)
      {
        urls: 'turn:open.xirsys.com:80?transport=udp',
        username: 'open',
        credential: 'open'
      },
      {
        urls: 'turn:open.xirsys.com:3478?transport=udp',
        username: 'open',
        credential: 'open'
      },
      {
        urls: 'turn:open.xirsys.com:80?transport=tcp',
        username: 'open',
        credential: 'open'
      },
      {
        urls: 'turn:open.xirsys.com:3478?transport=tcp',
        username: 'open',
        credential: 'open'
      },
      // Twilio STUN (free tier available)
      {
        urls: 'stun:global.stun.twilio.com:3478'
      },
      // Additional public TURN servers (may not work)
      {
        urls: 'turn:relay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:relay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      }
    ],
    iceCandidatePoolSize: 10, // Pre-gather ICE candidates for faster connection
    iceTransportPolicy: 'all', // Try both relay and non-relay candidates
    bundlePolicy: 'max-bundle', // Bundle RTP and RTCP together
    rtcpMuxPolicy: 'require', // Require RTCP multiplexing
    // Optimize for peer-to-peer connection (reduce TURN dependency)
    iceCandidatePoolSize: 10,
    // Increase connection timeout for better NAT traversal
    iceConnectionReceivingTimeout: 30000, // 30 seconds
    iceBackupCandidatePairPingInterval: 25000 // 25 seconds
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
          addDebugLog('⚠️ Timeout waiting for camera/microphone permission', 'warn');
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
      addDebugLog('🎥 Requesting camera and microphone access...', 'info');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      addDebugLog('✅ Camera and microphone accessed successfully', 'success');
      addDebugLog(`📹 Stream tracks: ${stream.getTracks().map(t => `${t.kind} (${t.enabled ? 'enabled' : 'disabled'})`).join(', ')}`, 'info');
      
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
            addDebugLog(`❌ Error playing local video: ${err.message}`, 'error');
          });
        } else {
          console.error('❌ Local video ref is null!');
          addDebugLog('❌ Local video ref is null!', 'error');
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
        console.log('Connection state:', pc.connectionState);
        setConnectionStatus(pc.connectionState);
        if (pc.connectionState === 'connected') {
          setIsConnected(true);
          addDebugLog(`✅ Connection established: ${pc.connectionState}`, 'success');
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setIsConnected(false);
          addDebugLog(`⚠️ Connection ${pc.connectionState}`, 'warn');
        }
      };

      // Start WebSocket signaling
      startSignaling(pc);

    } catch (err) {
      console.error('Error accessing media devices:', err);
      addDebugLog(`❌ Error accessing media: ${err.message}`, 'error');
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
      
      addDebugLog(`🔌 Connecting to signaling server: ${wsUrl}`, 'info');
      
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;
      
      // Handle connection errors
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addDebugLog('❌ WebSocket connection error', 'error');
        setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
      };

      ws.onopen = () => {
        addDebugLog('✅ Connected to signaling server', 'success');
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
        addDebugLog(`📤 Sent join-room with userId: ${socketRef.current.userId}`, 'info');
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        addDebugLog(`📨 Received signaling message: ${data.type}`, 'info');

        switch (data.type) {
          case 'room-joined':
            addDebugLog(`✅ Joined room, existing users: ${data.usersInRoom?.length || 0}`, 'success');
            addDebugLog(`👤 My userId from server: ${data.userId}`, 'info');
            setConnectionStatus('connected');
            
            // Store our userId from server
            if (data.userId && socketRef.current) {
              socketRef.current.userId = data.userId;
            }
            
            // Update participants list: include existing users (not including myself)
            const allParticipants = data.usersInRoom 
              ? [...data.usersInRoom.map(uid => ({ userId: uid, joinedAt: new Date() }))]
              : [];
            addDebugLog(`👥 Setting participants: ${allParticipants.map(p => p.userId).join(', ')}`, 'info');
            setParticipants(allParticipants);
            
            // Only create offer if there are other users in room
            // Create separate peer connection and offer for each existing user
            if (data.usersInRoom && data.usersInRoom.length > 0) {
              addDebugLog(`👥 Other users in room, creating offers for each...`, 'info');
              
              // Wait for local stream to be ready before creating offers
              const waitForStreamAndCreateOffers = async () => {
                // Wait up to 5 seconds for local stream
                for (let i = 0; i < 50; i++) {
                  if (localStreamRef.current && localStreamRef.current.getTracks().length > 0) {
                    addDebugLog('✅ Local stream ready, creating offers...', 'success');
                    break;
                  }
                  await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                if (!localStreamRef.current || localStreamRef.current.getTracks().length === 0) {
                  addDebugLog('❌ Local stream not ready after waiting, cannot create offers', 'error');
                  setError('Không thể truy cập camera/microphone. Vui lòng cho phép và tải lại trang.');
                  return;
                }
                
                for (const userId of data.usersInRoom) {
                  try {
                    // Create peer connection for this user
                    const userPc = new RTCPeerConnection(rtcConfiguration);
                    peerConnectionsRef.current.set(userId, userPc);
                    
                    // Add local stream tracks
                    localStreamRef.current.getTracks().forEach(track => {
                      userPc.addTrack(track, localStreamRef.current);
                      addDebugLog(`➕ Added ${track.kind} track to peer connection for ${userId}`, 'info');
                    });
                    
                    // Handle connection state changes
                    userPc.onconnectionstatechange = () => {
                      addDebugLog(`🔌 Connection state with ${userId}: ${userPc.connectionState}`, 'info');
                      if (userPc.connectionState === 'connected') {
                        setIsConnected(true);
                        setConnectionStatus('connected');
                      } else if (userPc.connectionState === 'disconnected' || userPc.connectionState === 'failed') {
                        setConnectionStatus(userPc.connectionState);
                        addDebugLog(`⚠️ Connection ${userPc.connectionState} with ${userId}`, 'warn');
                      }
                    };
                    
                    // Handle remote stream from this user
                    userPc.ontrack = (event) => {
                      addDebugLog(`📹 Received remote track from ${userId}: ${event.track.kind}`, 'success');
                      const remoteStream = event.streams[0];
                      if (remoteStream) {
                        addDebugLog(`📹 Remote stream tracks from ${userId}: ${remoteStream.getTracks().map(t => `${t.kind} (${t.enabled ? 'enabled' : 'disabled'})`).join(', ')}`, 'info');
                        remoteStreamsRef.current.set(userId, remoteStream);
                        setRemoteStreams(new Map(remoteStreamsRef.current));
                        setRemoteStream(remoteStream); // For backward compatibility
                        setIsCallActive(true);
                      }
                    };
                    
                    // Handle ICE candidates with detailed logging
                    userPc.onicecandidate = (event) => {
                      if (event.candidate) {
                        const candidateType = event.candidate.type || 'unknown';
                        const candidateProtocol = event.candidate.protocol || 'unknown';
                        const candidateAddress = event.candidate.address || 'unknown';
                        addDebugLog(`🧊 ICE candidate (${candidateType}/${candidateProtocol}) for ${userId}: ${candidateAddress}`, 'info');
                        
                        // Log if it's a relay candidate (TURN server)
                        if (candidateType === 'relay') {
                          addDebugLog(`✅ Using TURN server (relay) for ${userId}`, 'success');
                        }
                        
                        ws.send(JSON.stringify({
                          type: 'ice-candidate',
                          roomId: roomId,
                          candidate: event.candidate,
                          to: userId
                        }));
                      } else {
                        addDebugLog(`✅ ICE gathering complete for ${userId}`, 'success');
                        
                        // Log ICE gathering stats
                        userPc.getStats().then(stats => {
                          let hostCandidates = 0, srflxCandidates = 0, relayCandidates = 0;
                          stats.forEach(report => {
                            if (report.type === 'local-candidate' || report.type === 'remote-candidate') {
                              if (report.candidateType === 'host') hostCandidates++;
                              else if (report.candidateType === 'srflx') srflxCandidates++;
                              else if (report.candidateType === 'relay') relayCandidates++;
                            }
                          });
                          addDebugLog(`📊 ICE stats for ${userId}: host=${hostCandidates}, srflx=${srflxCandidates}, relay=${relayCandidates}`, 'info');
                          
                          // Warn if no relay candidates (TURN servers not working)
                          if (relayCandidates === 0) {
                            addDebugLog(`⚠️ WARNING: No TURN (relay) candidates found! Connection may fail behind strict NAT/firewall.`, 'warn');
                            addDebugLog(`💡 TURN servers may be blocked or unavailable. Consider using a dedicated TURN server.`, 'info');
                          } else {
                            addDebugLog(`✅ TURN servers working! Found ${relayCandidates} relay candidates.`, 'success');
                          }
                        }).catch(err => {
                          console.error('Error getting ICE stats:', err);
                        });
                      }
                    };
                    
                    // Handle ICE connection state with retry logic
                    userPc.oniceconnectionstatechange = async () => {
                      const state = userPc.iceConnectionState;
                      addDebugLog(`🧊 ICE connection state with ${userId}: ${state}`, 'info');
                      
                      if (state === 'connected' || state === 'completed') {
                        setIsConnected(true);
                        setConnectionStatus('connected');
                        addDebugLog(`✅ ICE connection established with ${userId}`, 'success');
                        // Reset retry count on success
                        retryCountsRef.current.set(userId, 0);
                      } else if (state === 'failed') {
                        const retryCount = retryCountsRef.current.get(userId) || 0;
                        addDebugLog(`⚠️ ICE connection failed with ${userId} (retry: ${retryCount}/${MAX_RETRY_ATTEMPTS})`, 'warn');
                        setConnectionStatus('failed');
                        
                        // Log connection failure reason
                        userPc.getStats().then(stats => {
                          stats.forEach(report => {
                            if (report.type === 'transport' && report.state === 'failed') {
                              addDebugLog(`📊 Transport failed: ${JSON.stringify(report)}`, 'error');
                            }
                          });
                        }).catch(err => {
                          console.error('Error getting failure stats:', err);
                        });
                        
                        // Retry connection if under limit
                        if (retryCount < MAX_RETRY_ATTEMPTS) {
                          retryCountsRef.current.set(userId, retryCount + 1);
                          addDebugLog(`🔄 Retrying connection with ${userId} (attempt ${retryCount + 1})...`, 'info');
                          
                          // Close old connection
                          try {
                            userPc.close();
                            peerConnectionsRef.current.delete(userId);
                          } catch (e) {
                            console.error('Error closing old connection:', e);
                          }
                          
                          // Wait a bit before retry
                          await new Promise(resolve => setTimeout(resolve, 3000));
                          
                          // Create new connection and retry
                          try {
                            const newPc = new RTCPeerConnection(rtcConfiguration);
                            peerConnectionsRef.current.set(userId, newPc);
                            
                            // Add local tracks
                            if (localStreamRef.current) {
                              localStreamRef.current.getTracks().forEach(track => {
                                newPc.addTrack(track, localStreamRef.current);
                              });
                            }
                            
                            // Set up handlers (same as before)
                            newPc.ontrack = (event) => {
                              addDebugLog(`📹 Received remote track from ${userId}: ${event.track.kind}`, 'success');
                              const remoteStream = event.streams[0];
                              if (remoteStream) {
                                remoteStreamsRef.current.set(userId, remoteStream);
                                setRemoteStreams(new Map(remoteStreamsRef.current));
                                setRemoteStream(remoteStream);
                                setIsCallActive(true);
                              }
                            };
                            
                            newPc.onicecandidate = (event) => {
                              if (event.candidate && socketRef.current) {
                                socketRef.current.send(JSON.stringify({
                                  type: 'ice-candidate',
                                  roomId: roomId,
                                  candidate: event.candidate,
                                  to: userId
                                }));
                              }
                            };
                            
                            newPc.oniceconnectionstatechange = () => {
                              if (newPc.iceConnectionState === 'connected' || newPc.iceConnectionState === 'completed') {
                                setIsConnected(true);
                                setConnectionStatus('connected');
                                addDebugLog(`✅ ICE connection established (retry) with ${userId}`, 'success');
                              } else if (newPc.iceConnectionState === 'failed') {
                                addDebugLog(`⚠️ ICE connection failed (retry) with ${userId}`, 'warn');
                              }
                            };
                            
                            // Create and send new offer
                            const offer = await newPc.createOffer({
                              offerToReceiveAudio: true,
                              offerToReceiveVideo: true
                            });
                            await newPc.setLocalDescription(offer);
                            
                            if (socketRef.current) {
                              socketRef.current.send(JSON.stringify({
                                type: 'offer',
                                roomId: roomId,
                                offer: offer,
                                to: userId
                              }));
                              addDebugLog(`📤 Sent retry offer to ${userId}`, 'info');
                            }
                          } catch (error) {
                            addDebugLog(`❌ Error retrying connection with ${userId}: ${error.message}`, 'error');
                          }
                        } else {
                          addDebugLog(`❌ Max retry attempts reached for ${userId}`, 'error');
                          addDebugLog(`💡 Nguyên nhân: Không có TURN (relay) candidates - TURN servers không hoạt động`, 'warn');
                          addDebugLog(`💡 Giải pháp:`, 'info');
                          addDebugLog(`   1. Kiểm tra firewall/network có block TURN traffic không`, 'info');
                          addDebugLog(`   2. Thử kết nối từ network khác (mobile data, VPN)`, 'info');
                          addDebugLog(`   3. Setup TURN server riêng (xem TURN-SERVER-SOLUTION.md)`, 'info');
                          addDebugLog(`   4. Sử dụng dịch vụ TURN có phí (Twilio, Metered.ca)`, 'info');
                          setError(`Không thể kết nối với ${userId}. Nguyên nhân: TURN servers không hoạt động (relay=0). Vui lòng xem TURN-SERVER-SOLUTION.md để setup TURN server riêng.`);
                        }
                      } else if (state === 'disconnected') {
                        addDebugLog(`⚠️ ICE connection disconnected with ${userId}`, 'warn');
                        setConnectionStatus('disconnected');
                        
                        // Try to reconnect after a delay if disconnected
                        setTimeout(async () => {
                          if (userPc && userPc.iceConnectionState === 'disconnected') {
                            addDebugLog(`🔄 Attempting to reconnect with ${userId}...`, 'info');
                            // Create new offer to reconnect
                            try {
                              const offer = await userPc.createOffer({
                                offerToReceiveAudio: true,
                                offerToReceiveVideo: true
                              });
                              await userPc.setLocalDescription(offer);
                              if (socketRef.current) {
                                socketRef.current.send(JSON.stringify({
                                  type: 'offer',
                                  roomId: roomId,
                                  offer: offer,
                                  to: userId
                                }));
                                addDebugLog(`📤 Sent reconnect offer to ${userId}`, 'info');
                              }
                            } catch (err) {
                              console.error('Error creating reconnect offer:', err);
                            }
                          }
                        }, 5000);
                      }
                    };
                    
                    // Create and send offer
                    const offer = await userPc.createOffer({
                      offerToReceiveAudio: true,
                      offerToReceiveVideo: true
                    });
                    await userPc.setLocalDescription(offer);
                    addDebugLog(`✅ Local description set (offer) for ${userId}`, 'success');
                    ws.send(JSON.stringify({
                      type: 'offer',
                      roomId: roomId,
                      offer: offer,
                      to: userId
                    }));
                    addDebugLog(`📤 Sent offer to ${userId}`, 'info');
                  } catch (error) {
                    addDebugLog(`❌ Error creating offer for ${userId}: ${error.message}`, 'error');
                    console.error('❌ Error creating offer for', userId, ':', error);
                  }
                }
              };
              
              waitForStreamAndCreateOffers();
            } else {
              addDebugLog('👤 First user in room, waiting for others...', 'info');
            }
            break;

          case 'offer':
            // Received offer from another peer - create separate peer connection for this user
            addDebugLog(`📥 Received offer from: ${data.from}`, 'info');
            try {
              // Check if we already have a peer connection for this user
              let userPc = peerConnectionsRef.current.get(data.from);
              if (!userPc) {
                addDebugLog(`🔗 Creating new peer connection for: ${data.from}`, 'info');
                userPc = new RTCPeerConnection(rtcConfiguration);
                peerConnectionsRef.current.set(data.from, userPc);
                
                // Add local stream tracks to this peer connection
                if (localStreamRef.current && localStreamRef.current.getTracks().length > 0) {
                  localStreamRef.current.getTracks().forEach(track => {
                    userPc.addTrack(track, localStreamRef.current);
                    addDebugLog(`➕ Added ${track.kind} track to peer connection`, 'info');
                  });
                } else {
                  addDebugLog(`⚠️ Local stream not ready when receiving offer from ${data.from}`, 'warn');
                  // Wait a bit and try again
                  setTimeout(async () => {
                    if (localStreamRef.current && localStreamRef.current.getTracks().length > 0) {
                      localStreamRef.current.getTracks().forEach(track => {
                        if (!userPc.getSenders().some(s => s.track === track)) {
                          userPc.addTrack(track, localStreamRef.current);
                          addDebugLog(`➕ Added ${track.kind} track (delayed)`, 'info');
                        }
                      });
                    }
                  }, 500);
                }
                
                // Handle connection state changes
                userPc.onconnectionstatechange = () => {
                  addDebugLog(`🔌 Connection state with ${data.from}: ${userPc.connectionState}`, 'info');
                  if (userPc.connectionState === 'connected') {
                    setIsConnected(true);
                    setConnectionStatus('connected');
                  } else if (userPc.connectionState === 'disconnected' || userPc.connectionState === 'failed') {
                    setConnectionStatus(userPc.connectionState);
                    addDebugLog(`⚠️ Connection ${userPc.connectionState} with ${data.from}`, 'warn');
                  }
                };
                
                // Handle remote stream from this user
                userPc.ontrack = (event) => {
                  addDebugLog(`📹 Received remote track from ${data.from}: ${event.track.kind}`, 'success');
                  const remoteStream = event.streams[0];
                  if (remoteStream) {
                    addDebugLog(`📹 Remote stream tracks from ${data.from}: ${remoteStream.getTracks().map(t => `${t.kind} (${t.enabled ? 'enabled' : 'disabled'})`).join(', ')}`, 'info');
                    // Store in Map
                    remoteStreamsRef.current.set(data.from, remoteStream);
                    // Update state
                    setRemoteStreams(new Map(remoteStreamsRef.current));
                    // Also set as main remote stream for backward compatibility
                    setRemoteStream(remoteStream);
                    setIsCallActive(true);
                  }
                };
                
                // Handle ICE candidates with detailed logging
                userPc.onicecandidate = (event) => {
                  if (event.candidate) {
                    const candidateType = event.candidate.type || 'unknown';
                    const candidateProtocol = event.candidate.protocol || 'unknown';
                    const candidateAddress = event.candidate.address || 'unknown';
                    addDebugLog(`🧊 ICE candidate (${candidateType}/${candidateProtocol}) for ${data.from}: ${candidateAddress}`, 'info');
                    
                    // Log if it's a relay candidate (TURN server)
                    if (candidateType === 'relay') {
                      addDebugLog(`✅ Using TURN server (relay) for ${data.from}`, 'success');
                    }
                    
                    ws.send(JSON.stringify({
                      type: 'ice-candidate',
                      roomId: roomId,
                      candidate: event.candidate,
                      to: data.from
                    }));
                  } else {
                    addDebugLog(`✅ ICE gathering complete for ${data.from}`, 'success');
                    
                        // Log ICE gathering stats
                        userPc.getStats().then(stats => {
                          let hostCandidates = 0, srflxCandidates = 0, relayCandidates = 0;
                          stats.forEach(report => {
                            if (report.type === 'local-candidate' || report.type === 'remote-candidate') {
                              if (report.candidateType === 'host') hostCandidates++;
                              else if (report.candidateType === 'srflx') srflxCandidates++;
                              else if (report.candidateType === 'relay') relayCandidates++;
                            }
                          });
                          addDebugLog(`📊 ICE stats for ${data.from}: host=${hostCandidates}, srflx=${srflxCandidates}, relay=${relayCandidates}`, 'info');
                          
                          // Warn if no relay candidates (TURN servers not working)
                          if (relayCandidates === 0) {
                            addDebugLog(`⚠️ WARNING: No TURN (relay) candidates found! Connection may fail behind strict NAT/firewall.`, 'warn');
                            addDebugLog(`💡 TURN servers may be blocked or unavailable. Consider using a dedicated TURN server.`, 'info');
                          } else {
                            addDebugLog(`✅ TURN servers working! Found ${relayCandidates} relay candidates.`, 'success');
                          }
                        }).catch(err => {
                          console.error('Error getting ICE stats:', err);
                        });
                  }
                };
                
                // Handle ICE connection state with retry logic
                userPc.oniceconnectionstatechange = async () => {
                  const state = userPc.iceConnectionState;
                  addDebugLog(`🧊 ICE connection state with ${data.from}: ${state}`, 'info');
                  
                  if (state === 'connected' || state === 'completed') {
                    setIsConnected(true);
                    setConnectionStatus('connected');
                    addDebugLog(`✅ ICE connection established with ${data.from}`, 'success');
                    // Reset retry count on success
                    retryCountsRef.current.set(data.from, 0);
                  } else if (state === 'failed') {
                    const retryCount = retryCountsRef.current.get(data.from) || 0;
                    addDebugLog(`⚠️ ICE connection failed with ${data.from} (retry: ${retryCount}/${MAX_RETRY_ATTEMPTS})`, 'warn');
                    setConnectionStatus('failed');
                    
                    // Log connection failure reason
                    userPc.getStats().then(stats => {
                      stats.forEach(report => {
                        if (report.type === 'transport' && report.state === 'failed') {
                          addDebugLog(`📊 Transport failed: ${JSON.stringify(report)}`, 'error');
                        }
                      });
                    }).catch(err => {
                      console.error('Error getting failure stats:', err);
                    });
                    
                    // Retry connection if under limit
                    if (retryCount < MAX_RETRY_ATTEMPTS) {
                      retryCountsRef.current.set(data.from, retryCount + 1);
                      addDebugLog(`🔄 Retrying connection with ${data.from} (attempt ${retryCount + 1})...`, 'info');
                      
                      // Close old connection
                      try {
                        userPc.close();
                        peerConnectionsRef.current.delete(data.from);
                      } catch (e) {
                        console.error('Error closing old connection:', e);
                      }
                      
                      // Wait a bit before retry
                      await new Promise(resolve => setTimeout(resolve, 3000));
                      
                      // Request new offer by sending a signal (or wait for new offer)
                      // For now, we'll wait for the other peer to send a new offer
                      addDebugLog(`⏳ Waiting for new offer from ${data.from}...`, 'info');
                    } else {
                      addDebugLog(`❌ Max retry attempts reached for ${data.from}`, 'error');
                      addDebugLog(`💡 Nguyên nhân: Không có TURN (relay) candidates - TURN servers không hoạt động`, 'warn');
                      addDebugLog(`💡 Giải pháp:`, 'info');
                      addDebugLog(`   1. Kiểm tra firewall/network có block TURN traffic không`, 'info');
                      addDebugLog(`   2. Thử kết nối từ network khác (mobile data, VPN)`, 'info');
                      addDebugLog(`   3. Setup TURN server riêng (xem TURN-SERVER-SOLUTION.md)`, 'info');
                      addDebugLog(`   4. Sử dụng dịch vụ TURN có phí (Twilio, Metered.ca)`, 'info');
                      setError(`Không thể kết nối với ${data.from}. Nguyên nhân: TURN servers không hoạt động (relay=0). Vui lòng xem TURN-SERVER-SOLUTION.md để setup TURN server riêng.`);
                    }
                  } else if (state === 'disconnected') {
                    addDebugLog(`⚠️ ICE connection disconnected with ${data.from}`, 'warn');
                    setConnectionStatus('disconnected');
                    
                    // Try to reconnect after a delay if disconnected
                    setTimeout(async () => {
                      if (userPc && userPc.iceConnectionState === 'disconnected') {
                        addDebugLog(`🔄 Attempting to reconnect with ${data.from}...`, 'info');
                        // The other peer should send a new offer, or we can request one
                      }
                    }, 5000);
                  }
                };
              }
              
              await userPc.setRemoteDescription(new RTCSessionDescription(data.offer));
              addDebugLog(`✅ Remote description set (offer) for ${data.from}`, 'success');
              
              const answer = await userPc.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
              });
              await userPc.setLocalDescription(answer);
              addDebugLog(`✅ Local description set (answer) for ${data.from}`, 'success');
              
              ws.send(JSON.stringify({
                type: 'answer',
                roomId: roomId,
                answer: answer,
                to: data.from
              }));
              addDebugLog(`📤 Sent answer to: ${data.from}`, 'info');
            } catch (error) {
              addDebugLog(`❌ Error handling offer: ${error.message}`, 'error');
              console.error('❌ Error handling offer:', error);
              setError(`Lỗi khi xử lý offer từ ${data.from}: ${error.message}`);
            }
            break;

          case 'answer':
            // Received answer from another peer - use the peer connection for this user
            addDebugLog(`📥 Received answer from: ${data.from}`, 'info');
            try {
              const userPc = peerConnectionsRef.current.get(data.from) || peerConnectionRef.current;
              if (!userPc) {
                addDebugLog(`❌ No peer connection found for ${data.from}`, 'error');
                return;
              }
              
              addDebugLog(`📊 Current signaling state for ${data.from}: ${userPc.signalingState}`, 'info');
              addDebugLog(`📊 Current connection state for ${data.from}: ${userPc.connectionState}`, 'info');
              addDebugLog(`📊 Current ICE connection state for ${data.from}: ${userPc.iceConnectionState}`, 'info');
              
              if (userPc.signalingState === 'have-local-offer') {
                await userPc.setRemoteDescription(new RTCSessionDescription(data.answer));
                addDebugLog(`✅ Remote description set (answer) for ${data.from}`, 'success');
                setIsCallActive(true);
                
                // Check connection state after setting answer
                setTimeout(() => {
                  addDebugLog(`📊 Connection state after answer: ${userPc.connectionState}`, 'info');
                  addDebugLog(`📊 ICE connection state after answer: ${userPc.iceConnectionState}`, 'info');
                  if (userPc.connectionState === 'connected' || userPc.iceConnectionState === 'connected') {
                    setIsConnected(true);
                    setConnectionStatus('connected');
                    addDebugLog(`✅ Connection established with ${data.from}`, 'success');
                  }
                }, 500);
              } else if (userPc.signalingState === 'stable') {
                addDebugLog(`⚠️ Signaling state is stable for ${data.from}, answer may be duplicate or late`, 'warn');
                // Try to set anyway in case it's a renegotiation
                try {
                  await userPc.setRemoteDescription(new RTCSessionDescription(data.answer));
                  addDebugLog(`✅ Remote description set (answer) for ${data.from} despite stable state`, 'success');
                  setIsCallActive(true);
                } catch (err) {
                  addDebugLog(`⚠️ Could not set remote description (stable state): ${err.message}`, 'warn');
                }
              } else {
                addDebugLog(`⚠️ Unexpected signaling state for ${data.from}: ${userPc.signalingState}`, 'warn');
                // Try to set anyway
                try {
                  await userPc.setRemoteDescription(new RTCSessionDescription(data.answer));
                  addDebugLog(`✅ Remote description set (answer) for ${data.from}`, 'success');
                  setIsCallActive(true);
                } catch (err) {
                  addDebugLog(`❌ Error setting remote description: ${err.message}`, 'error');
                }
              }
            } catch (error) {
              addDebugLog(`❌ Error handling answer: ${error.message}`, 'error');
              console.error('❌ Error handling answer:', error);
              setError(`Lỗi khi xử lý answer từ ${data.from}: ${error.message}`);
            }
            break;

          case 'ice-candidate':
            // Received ICE candidate - add to the peer connection for this user
            if (data.candidate) {
              try {
                const userPc = peerConnectionsRef.current.get(data.from) || peerConnectionRef.current;
                // Wait for remote description if not set yet
                if (!userPc.remoteDescription) {
                  addDebugLog(`⏳ Waiting for remote description before adding ICE candidate for ${data.from}`, 'info');
                  // Store candidate and add later
                  setTimeout(async () => {
                    try {
                      await userPc.addIceCandidate(new RTCIceCandidate(data.candidate));
                      addDebugLog(`✅ ICE candidate added (delayed) for ${data.from}`, 'success');
                    } catch (err) {
                      addDebugLog(`❌ Error adding delayed ICE candidate for ${data.from}: ${err.message}`, 'error');
                    }
                  }, 500);
                } else {
                  await userPc.addIceCandidate(new RTCIceCandidate(data.candidate));
                  addDebugLog(`✅ ICE candidate added for ${data.from}`, 'success');
                }
              } catch (error) {
                addDebugLog(`❌ Error adding ICE candidate for ${data.from}: ${error.message}`, 'error');
                console.error('❌ Error adding ICE candidate for', data.from, ':', error);
                const userPc = peerConnectionsRef.current.get(data.from) || peerConnectionRef.current;
                if (userPc.remoteDescription) {
                  addDebugLog(`⚠️ Remote description exists but failed to add candidate for ${data.from}`, 'warn');
                }
              }
            }
            break;

          case 'user-joined':
            addDebugLog(`👤 User joined: ${data.userId}`, 'info');
            setParticipants(prev => {
              // Check if user already exists
              const exists = prev.find(p => p.userId === data.userId);
              if (exists) {
                addDebugLog(`⚠️ User already in participants list: ${data.userId}`, 'warn');
                return prev;
              }
              const updated = [...prev, { userId: data.userId, joinedAt: new Date() }];
              addDebugLog(`✅ Updated participants list: ${updated.map(p => p.userId).join(', ')}`, 'success');
              return updated;
            });
            
            // NOTE: When a new user joins, they will create offer themselves (in room-joined handler)
            // We (existing user) should NOT create offer here, just wait for their offer and respond with answer
            addDebugLog('👤 New user joined, waiting for their offer...', 'info');
            break;

          case 'participants-updated':
            // Server sent updated participants list - sync with server
            addDebugLog(`🔄 Participants updated from server: ${data.participants?.length || 0}`, 'info');
            const currentUserId = socketRef.current?.userId || userEmail || `user_${Date.now()}`;
            const otherParticipants = data.participants
              .filter(uid => uid !== currentUserId)
              .map(uid => ({ userId: uid, joinedAt: new Date() }));
            addDebugLog(`👥 Setting participants from server (excluding myself): ${otherParticipants.map(p => p.userId).join(', ')}`, 'info');
            setParticipants(otherParticipants);
            break;

          case 'user-left':
            addDebugLog(`👋 User left: ${data.userId}`, 'info');
            setParticipants(prev => {
              const updated = prev.filter(p => p.userId !== data.userId);
              addDebugLog(`✅ Updated participants after user left: ${updated.map(p => p.userId).join(', ')}`, 'info');
              return updated;
            });
            // Clean up peer connection and remote stream for this user
            const leftUserPc = peerConnectionsRef.current.get(data.userId);
            if (leftUserPc) {
              leftUserPc.close();
              peerConnectionsRef.current.delete(data.userId);
              addDebugLog(`🔌 Closed peer connection for ${data.userId}`, 'info');
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
        addDebugLog('❌ WebSocket error occurred', 'error');
        setError('Lỗi kết nối signaling server. Đang thử lại...');
        // Retry connection after 3 seconds
        setTimeout(() => {
          if (socketRef.current?.readyState === WebSocket.CLOSED) {
            startSignaling(pc);
          }
        }, 3000);
      };

      ws.onclose = () => {
        addDebugLog('🔌 WebSocket connection closed', 'warn');
        setConnectionStatus('disconnected');
        setIsConnected(false);
      };

    } catch (err) {
      console.error('Error starting signaling:', err);
      addDebugLog(`❌ Error starting signaling: ${err.message}`, 'error');
      setError('Không thể kết nối đến signaling server.');
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
            <button 
              className="info-toggle-btn debug-btn"
              onClick={() => setShowDebugLogs(!showDebugLogs)}
              title="Debug Logs - Click để xem logs"
              style={{ 
                marginLeft: '10px', 
                background: showDebugLogs ? '#667eea' : 'rgba(255, 152, 0, 0.3)',
                fontSize: '1.2rem',
                minWidth: '45px',
                minHeight: '35px',
                border: showDebugLogs ? '2px solid #667eea' : '2px solid rgba(255, 152, 0, 0.5)',
                fontWeight: 'bold'
              }}
            >
              🐛
            </button>
          </div>
          <button className="close-btn" onClick={endCall}>×</button>
        </div>

        {showRoomInfo && (
          <div className={`room-info-panel ${showRoomInfo ? 'show' : ''}`}>
            <div className="room-info-section">
              <h4>Chia sẻ phòng với người khác</h4>
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
                    alert('Đã copy link!');
                  }}
                >
                  Copy
                </button>
              </div>
              <p className="room-id">Room ID: {roomId}</p>
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

        {/* Debug Logs Panel */}
        {showDebugLogs && (
          <div className="debug-logs-panel">
            <div className="debug-logs-header">
              <h4>🐛 Debug Logs ({debugLogs.length})</h4>
              <button 
                onClick={() => setDebugLogs([])}
                style={{ 
                  padding: '5px 10px', 
                  background: '#ff4444', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Xóa
              </button>
            </div>
            <div className="debug-logs-content">
              {debugLogs.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Chưa có logs. Các logs sẽ hiển thị ở đây...
                </div>
              ) : (
                debugLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`debug-log-item ${log.type}`}
                    style={{
                      padding: '8px 12px',
                      marginBottom: '4px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      background: log.type === 'error' ? 'rgba(255, 68, 68, 0.1)' :
                                  log.type === 'success' ? 'rgba(76, 175, 80, 0.1)' :
                                  log.type === 'warn' ? 'rgba(255, 152, 0, 0.1)' :
                                  'rgba(255, 255, 255, 0.05)',
                      color: log.type === 'error' ? '#ff4444' :
                             log.type === 'success' ? '#4caf50' :
                             log.type === 'warn' ? '#ff9800' :
                             '#fff',
                      borderLeft: `3px solid ${
                        log.type === 'error' ? '#ff4444' :
                        log.type === 'success' ? '#4caf50' :
                        log.type === 'warn' ? '#ff9800' :
                        '#667eea'
                      }`
                    }}
                  >
                    <span style={{ color: '#999', marginRight: '8px' }}>{log.timestamp}</span>
                    {log.message}
                  </div>
                ))
              )}
            </div>
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
          {/* Debug button for mobile - always visible */}
          <button
            onClick={() => setShowDebugLogs(!showDebugLogs)}
            style={{
              marginTop: '10px',
              padding: '8px 15px',
              background: showDebugLogs ? '#667eea' : 'rgba(255, 152, 0, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            🐛 {showDebugLogs ? 'Ẩn Logs' : 'Xem Logs'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCall;
