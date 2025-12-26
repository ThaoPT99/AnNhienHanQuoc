/**
 * WebRTC Signaling Server
 * Handles WebSocket connections for peer-to-peer video calls
 */

const WebSocket = require('ws');

class WebRTCSignalingServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/webrtc-signaling'
    });
    this.rooms = new Map(); // roomId -> Set of WebSocket connections
    this.userConnections = new Map(); // userId -> WebSocket connection (for notifications)
    
    this.wss.on('connection', (ws, req) => {
      console.log('🔌 New WebRTC signaling connection');
      
      let roomId = null;
      let userId = null;
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          console.log('📨 Received message:', data.type);
          
          switch (data.type) {
            case 'join-room':
              roomId = data.roomId;
              userId = data.userId || `user_${Date.now()}`;
              
              // Store user connection for notifications (ALWAYS, even if in notification-only room)
              ws.userId = userId;
              this.userConnections.set(userId, ws);
              console.log(`👤 Registered user connection: ${userId} (room: ${data.roomId})`);
              console.log(`📊 Total registered users: ${this.userConnections.size}`);
              
              if (!this.rooms.has(roomId)) {
                this.rooms.set(roomId, new Set());
              }
              
              this.rooms.get(roomId).add(ws);
              ws.roomId = roomId;
              
              // Get list of existing users BEFORE adding new user
              const usersInRoom = Array.from(this.rooms.get(roomId))
                .filter(client => client !== ws && client.readyState === WebSocket.OPEN)
                .map(client => client.userId);
              
              // Add new user to room
              this.rooms.get(roomId).add(ws);
              ws.roomId = roomId;
              ws.userId = userId;
              
              // Notify others in room about new user
              this.broadcastToRoom(roomId, ws, {
                type: 'user-joined',
                userId,
                roomId
              });
              
              // Send list of existing users to new user
              ws.send(JSON.stringify({
                type: 'room-joined',
                roomId,
                userId,
                usersInRoom
              }));
              
              // Also broadcast updated participants list to all users in room
              const allUsersInRoom = Array.from(this.rooms.get(roomId))
                .filter(client => client.readyState === WebSocket.OPEN)
                .map(client => client.userId);
              
              this.broadcastToRoom(roomId, null, {
                type: 'participants-updated',
                roomId,
                participants: allUsersInRoom
              });
              
              console.log(`✅ User ${userId} joined room ${roomId}. Total users: ${allUsersInRoom.length}`);
              break;
              
          case 'incoming-call':
              // Notify specific user about incoming call
              const targetUserId = data.targetUserId;
              const callerName = data.callerName;
              const callerEmail = data.callerEmail || userId || data.from;
              const callerId = userId || data.from || callerEmail;
              
              console.log(`📞 Incoming call request: target=${targetUserId}, caller=${callerId}, roomId=${data.roomId}`);
              console.log(`📊 Available users in userConnections: ${Array.from(this.userConnections.keys()).join(', ')}`);
              
              // Try to find target user's connection (whether in room or not)
              const targetConnection = this.userConnections.get(targetUserId);
              
              if (targetConnection && targetConnection.readyState === WebSocket.OPEN) {
                // User is online, send notification
                targetConnection.send(JSON.stringify({
                  type: 'incoming-call',
                  roomId: data.roomId,
                  roomLink: data.roomLink,
                  callerName,
                  callerEmail,
                  from: callerId
                }));
                console.log(`✅ Incoming call notification sent to ${targetUserId} from ${callerId}`);
              } else {
                // User not online, try to send via room (if they're in the room)
                const targetRoom = this.rooms.get(data.roomId);
                let sent = false;
                if (targetRoom) {
                  targetRoom.forEach(client => {
                    if (client.userId === targetUserId && client.readyState === WebSocket.OPEN) {
                      client.send(JSON.stringify({
                        type: 'incoming-call',
                        roomId: data.roomId,
                        roomLink: data.roomLink,
                        callerName,
                        callerEmail,
                        from: callerId
                      }));
                      sent = true;
                      console.log(`✅ Incoming call notification sent to ${targetUserId} via room from ${callerId}`);
                    }
                  });
                }
                
                if (!sent) {
                  console.log(`⚠️ User ${targetUserId} is not online (connection not found in userConnections map)`);
                }
              }
              break;
              
            case 'offer':
            case 'answer':
            case 'ice-candidate':
              // Forward signaling messages to other peers in room
              if (roomId) {
                this.broadcastToRoom(roomId, ws, {
                  type: data.type,
                  from: userId,
                  ...data
                });
              }
              break;
              
            case 'leave-room':
              this.leaveRoom(ws, roomId);
              break;
          }
        } catch (error) {
          console.error('Error handling message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });
      
      ws.on('close', () => {
        console.log('🔌 WebRTC signaling connection closed');
        if (roomId) {
          this.leaveRoom(ws, roomId);
        }
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }
  
  broadcastToRoom(roomId, sender, message) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    room.forEach(client => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  leaveRoom(ws, roomId) {
    if (!roomId) return;
    
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(ws);
      
      // Notify others
      this.broadcastToRoom(roomId, ws, {
        type: 'user-left',
        userId: ws.userId,
        roomId
      });
      
      // Clean up empty rooms
      if (room.size === 0) {
        this.rooms.delete(roomId);
        console.log(`🗑️ Room ${roomId} cleaned up`);
      }
    }
    
    // Clean up user connection when WebSocket closes
    if (ws.userId) {
      const userConn = this.userConnections.get(ws.userId);
      if (userConn === ws) {
        this.userConnections.delete(ws.userId);
        console.log(`🗑️ User connection cleaned up for ${ws.userId}`);
      }
    }
  }
  
  getRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    
    return {
      roomId,
      userCount: room.size,
      users: Array.from(room)
        .filter(client => client.readyState === WebSocket.OPEN)
        .map(client => client.userId)
    };
  }
}

module.exports = WebRTCSignalingServer;

