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
              
              if (!this.rooms.has(roomId)) {
                this.rooms.set(roomId, new Set());
              }
              
              this.rooms.get(roomId).add(ws);
              ws.roomId = roomId;
              ws.userId = userId;
              
              // Notify others in room about new user
              this.broadcastToRoom(roomId, ws, {
                type: 'user-joined',
                userId,
                roomId
              });
              
              // Send list of existing users
              const usersInRoom = Array.from(this.rooms.get(roomId))
                .filter(client => client !== ws && client.readyState === WebSocket.OPEN)
                .map(client => client.userId);
              
              ws.send(JSON.stringify({
                type: 'room-joined',
                roomId,
                userId,
                usersInRoom
              }));
              
              console.log(`✅ User ${userId} joined room ${roomId}`);
              break;
              
          case 'incoming-call':
              // Notify specific user about incoming call
              const targetUserId = data.targetUserId;
              const callerName = data.callerName;
              const callerEmail = data.callerEmail;
              
              // Find target user's connection
              const targetRoom = this.rooms.get(roomId);
              if (targetRoom) {
                targetRoom.forEach(client => {
                  if (client.userId === targetUserId && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                      type: 'incoming-call',
                      roomId: data.roomId,
                      roomLink: data.roomLink,
                      callerName,
                      callerEmail,
                      from: userId
                    }));
                    console.log(`📞 Incoming call notification sent to ${targetUserId} from ${userId}`);
                  }
                });
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

