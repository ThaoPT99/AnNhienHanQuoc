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
          const rawMessage = message.toString();
          console.log('📨 [DEBUG] Server: Raw message received:', rawMessage);
          
          const data = JSON.parse(rawMessage);
          console.log('📨 [DEBUG] Server: Parsed message type:', data.type);
          console.log('📨 [DEBUG] Server: Full message data:', JSON.stringify(data, null, 2));
          
          switch (data.type) {
            case 'register-messaging':
              // Register user for messaging (without joining a room)
              userId = data.userId || `user_${Date.now()}`;
              ws.userId = userId;
              this.userConnections.set(userId, ws);
              console.log(`💬 Registered user for messaging: ${userId}`);
              ws.send(JSON.stringify({
                type: 'messaging-registered',
                userId: userId
              }));
              break;
              
            case 'chat-message':
              // Forward chat message to recipient
              const { from: msgFrom, to: msgTo, message: msgText, timestamp: msgTimestamp } = data;
              
              // Ensure sender is registered (use from field if userId not set)
              if (!userId || !ws.userId) {
                userId = msgFrom || userId || `user_${Date.now()}`;
                ws.userId = userId;
                this.userConnections.set(userId, ws);
                console.log(`💬 Server: Auto-registered sender ${userId} for messaging`);
              }
              
              console.log(`💬 Server: Received chat message from ${msgFrom} to ${msgTo}`);
              console.log(`💬 Server: Sender userId: ${userId}, ws.userId: ${ws.userId}`);
              console.log(`💬 Server: Total registered users: ${this.userConnections.size}`);
              console.log(`💬 Server: Looking for recipient: ${msgTo}`);
              
              // Try to find recipient connection
              const recipientWs = this.userConnections.get(msgTo);
              
              if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
                const forwardMsg = {
                  type: 'chat-message',
                  from: msgFrom,
                  to: msgTo,
                  message: msgText,
                  timestamp: msgTimestamp || new Date().toISOString()
                };
                recipientWs.send(JSON.stringify(forwardMsg));
                console.log(`✅ Server: Message forwarded successfully from ${msgFrom} to ${msgTo}`);
              } else {
                console.log(`⚠️ Server: User ${msgTo} is not online or connection issue`);
                console.log(`   - Connection exists: ${!!recipientWs}`);
                if (recipientWs) {
                  console.log(`   - Connection state: ${recipientWs.readyState} (OPEN=1, CLOSED=3)`);
                }
                console.log(`   - All registered users: ${Array.from(this.userConnections.keys()).join(', ')}`);
                
                // Send confirmation to sender that message was queued
                ws.send(JSON.stringify({
                  type: 'message-queued',
                  to: msgTo,
                  message: 'User is offline. Message will be delivered when they come online.'
                }));
              }
              break;
              
            case 'join-room':
              roomId = data.roomId;
              userId = data.userId || `user_${Date.now()}`;
              
              // Clean up any old connections for this user first
              const oldConnection = this.userConnections.get(userId);
              if (oldConnection && oldConnection !== ws) {
                console.log(`🧹 [DEBUG] Server: Cleaning up old connection for user ${userId}`);
                // Remove old connection from any rooms
                if (oldConnection.roomId) {
                  const oldRoom = this.rooms.get(oldConnection.roomId);
                  if (oldRoom) {
                    oldRoom.delete(oldConnection);
                    if (oldRoom.size === 0) {
                      this.rooms.delete(oldConnection.roomId);
                    }
                  }
                }
                // Close old connection if still open
                if (oldConnection.readyState === WebSocket.OPEN) {
                  oldConnection.close(1000, 'Replaced by new connection');
                }
              }
              
              // Store user connection for notifications (ALWAYS, even if in notification-only room)
              ws.userId = userId;
              this.userConnections.set(userId, ws);
              console.log(`👤 [DEBUG] Server: Registered user connection: ${userId} (room: ${data.roomId})`);
              console.log(`📊 [DEBUG] Server: Total registered users: ${this.userConnections.size}`);
              console.log(`📊 [DEBUG] Server: All registered users:`, Array.from(this.userConnections.keys()).join(', '));
              
              if (!this.rooms.has(roomId)) {
                this.rooms.set(roomId, new Set());
              }
              
              // Remove from old room if exists
              if (ws.roomId && ws.roomId !== roomId) {
                const oldRoom = this.rooms.get(ws.roomId);
                if (oldRoom) {
                  oldRoom.delete(ws);
                  if (oldRoom.size === 0) {
                    this.rooms.delete(ws.roomId);
                  }
                }
              }
              
              // Check if already in this room (avoid duplicates)
              const room = this.rooms.get(roomId);
              if (room && room.has(ws)) {
                console.log(`⚠️ [DEBUG] Server: User ${userId} already in room ${roomId}, skipping duplicate join`);
                // Still send room-joined response for consistency
                const usersInRoom = Array.from(room)
                  .filter(client => client !== ws && client.readyState === WebSocket.OPEN)
                  .map(client => client.userId)
                  .filter((uid, index, self) => self.indexOf(uid) === index); // Remove duplicates
                ws.send(JSON.stringify({
                  type: 'room-joined',
                  roomId,
                  userId,
                  usersInRoom
                }));
              } else {
                room.add(ws);
                ws.roomId = roomId;
                
                // Get list of existing users BEFORE adding new user
                const usersInRoom = Array.from(room)
                  .filter(client => client !== ws && client.readyState === WebSocket.OPEN)
                  .map(client => client.userId)
                  .filter((uid, index, self) => self.indexOf(uid) === index); // Remove duplicates
              
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
                  .map(client => client.userId)
                  .filter((uid, index, self) => self.indexOf(uid) === index); // Remove duplicates
              
                this.broadcastToRoom(roomId, null, {
                  type: 'participants-updated',
                  roomId,
                  participants: allUsersInRoom
                });
              
                console.log(`✅ [DEBUG] Server: User ${userId} joined room ${roomId}. Total users: ${allUsersInRoom.length}`);
                console.log(`📊 [DEBUG] Server: Users in room: ${allUsersInRoom.join(', ')}`);
              }
              break;
              
          case 'incoming-call':
              // Notify specific user about incoming call
              console.log('📞 [DEBUG] Server: Received incoming-call request:', JSON.stringify(data, null, 2));
              
              const targetUserId = data.targetUserId;
              const callerName = data.callerName;
              const callerEmail = data.callerEmail || userId || data.from;
              const callerId = userId || data.from || callerEmail;
              
              console.log('📞 [DEBUG] Server: Parsed incoming-call data:', {
                targetUserId,
                callerName,
                callerEmail,
                callerId,
                roomId: data.roomId,
                roomLink: data.roomLink,
                currentUserId: userId,
                wsUserId: ws.userId,
                dataFrom: data.from
              });
              
              // Ensure caller is registered (if userId not set, use from field)
              if (!userId || !ws.userId) {
                userId = data.from || callerEmail || userId || `user_${Date.now()}`;
                ws.userId = userId;
                this.userConnections.set(userId, ws);
                console.log(`📞 [DEBUG] Server: Auto-registered caller ${userId} for incoming-call`);
              }
              
              console.log(`📞 [DEBUG] Server: Incoming call request: target=${targetUserId}, caller=${callerId}, roomId=${data.roomId}`);
              
              // List all registered users
              const allUsers = Array.from(this.userConnections.keys());
              console.log(`📊 [DEBUG] Server: Total registered users: ${this.userConnections.size}`);
              console.log(`📊 [DEBUG] Server: Registered users list:`, allUsers);
              
              // Try to find target user's connection (whether in room or not)
              // Also try case-insensitive match in case email casing differs
              let targetConnection = this.userConnections.get(targetUserId);
              
              // If not found, try case-insensitive search
              if (!targetConnection) {
                for (const [registeredUserId, connection] of this.userConnections.entries()) {
                  if (registeredUserId.toLowerCase() === targetUserId.toLowerCase()) {
                    console.log(`🔍 [DEBUG] Server: Found target user with case-insensitive match: ${registeredUserId} (looking for ${targetUserId})`);
                    targetConnection = connection;
                    break;
                  }
                }
              }
              
              console.log(`🔍 [DEBUG] Server: Looking for target user ${targetUserId}:`, {
                found: !!targetConnection,
                connectionState: targetConnection ? targetConnection.readyState : 'null',
                isOpen: targetConnection ? targetConnection.readyState === WebSocket.OPEN : false,
                actualUserId: targetConnection ? targetConnection.userId : 'null'
              });
              
              if (targetConnection && targetConnection.readyState === WebSocket.OPEN) {
                // User is online, send notification
                const notificationPayload = {
                  type: 'incoming-call',
                  roomId: data.roomId,
                  roomLink: data.roomLink,
                  callerName,
                  callerEmail,
                  from: callerId
                };
                
                console.log(`📤 [DEBUG] Server: Sending notification to ${targetUserId}:`, JSON.stringify(notificationPayload, null, 2));
                
                try {
                  targetConnection.send(JSON.stringify(notificationPayload));
                  console.log(`✅ [DEBUG] Server: Successfully sent incoming call notification to ${targetUserId} from ${callerId}`);
                } catch (error) {
                  console.error(`❌ [DEBUG] Server: Error sending notification to ${targetUserId}:`, error);
                }
              } else {
                // User not online, try to send via room (if they're in the room)
                console.log(`⚠️ [DEBUG] Server: Target user ${targetUserId} not found in userConnections, trying room...`);
                const targetRoom = this.rooms.get(data.roomId);
                let sent = false;
                
                if (targetRoom) {
                  console.log(`🔍 [DEBUG] Server: Found room ${data.roomId} with ${targetRoom.size} users`);
                  targetRoom.forEach(client => {
                    console.log(`🔍 [DEBUG] Server: Checking room client: userId=${client.userId}, state=${client.readyState}, matches=${client.userId === targetUserId}`);
                    if (client.userId === targetUserId && client.readyState === WebSocket.OPEN) {
                      const notificationPayload = {
                        type: 'incoming-call',
                        roomId: data.roomId,
                        roomLink: data.roomLink,
                        callerName,
                        callerEmail,
                        from: callerId
                      };
                      
                      console.log(`📤 [DEBUG] Server: Sending notification via room to ${targetUserId}:`, JSON.stringify(notificationPayload, null, 2));
                      
                      try {
                        client.send(JSON.stringify(notificationPayload));
                        sent = true;
                        console.log(`✅ [DEBUG] Server: Successfully sent incoming call notification to ${targetUserId} via room from ${callerId}`);
                      } catch (error) {
                        console.error(`❌ [DEBUG] Server: Error sending notification via room to ${targetUserId}:`, error);
                      }
                    }
                  });
                } else {
                  console.log(`⚠️ [DEBUG] Server: Room ${data.roomId} not found`);
                }
                
                if (!sent) {
                  console.log(`❌ [DEBUG] Server: User ${targetUserId} is not online and not in room. Call notification failed.`);
                  console.log(`📊 [DEBUG] Server: Available users:`, allUsers);
                  console.log(`📊 [DEBUG] Server: Available rooms:`, Array.from(this.rooms.keys()));
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
        console.log('🔌 [DEBUG] Server: WebRTC signaling connection closed', {
          userId: userId || ws.userId,
          roomId: roomId || ws.roomId
        });
        if (roomId || ws.roomId) {
          this.leaveRoom(ws, roomId || ws.roomId);
        }
        // Clean up user connection
        if (userId || ws.userId) {
          const uid = userId || ws.userId;
          const userConn = this.userConnections.get(uid);
          if (userConn === ws) {
            this.userConnections.delete(uid);
            console.log(`🗑️ [DEBUG] Server: Cleaned up user connection for ${uid}`);
          }
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

