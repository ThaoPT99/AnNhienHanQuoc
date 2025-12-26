/**
 * Script to get Twilio STUN/TURN credentials via API
 * Usage: node get-twilio-turn-credentials.js
 * 
 * Set environment variables:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 */

const https = require('https');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error('❌ Error: Missing Twilio credentials');
  console.log('\n📝 Please set environment variables:');
  console.log('   TWILIO_ACCOUNT_SID=your_account_sid');
  console.log('   TWILIO_AUTH_TOKEN=your_auth_token');
  console.log('\n💡 You can find these in Twilio Console:');
  console.log('   https://console.twilio.com/');
  console.log('   → Dashboard → Account Info');
  process.exit(1);
}

// Create basic auth header
const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

const options = {
  hostname: 'api.twilio.com',
  port: 443,
  path: '/2010-04-01/Accounts/' + accountSid + '/Tokens.json',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

console.log('🔄 Requesting Twilio STUN/TURN credentials...\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode !== 201) {
      console.error('❌ Error:', res.statusCode);
      console.error('Response:', data);
      try {
        const error = JSON.parse(data);
        console.error('Error message:', error.message);
      } catch (e) {
        console.error('Raw response:', data);
      }
      process.exit(1);
    }

    try {
      const response = JSON.parse(data);
      
      if (response.ice_servers && response.ice_servers.length > 0) {
        const turnServer = response.ice_servers.find(server => 
          server.urls && server.urls.some(url => url.includes('turn:'))
        );

        if (turnServer) {
          console.log('✅ Successfully retrieved Twilio STUN/TURN credentials!\n');
          console.log('📋 Copy these credentials to your code:\n');
          console.log('='.repeat(60));
          console.log('Username:', turnServer.username);
          console.log('Password:', turnServer.credential);
          console.log('='.repeat(60));
          console.log('\n💻 Update client/src/components/VideoCall.js:');
          console.log('\n// Twilio STUN/TURN');
          console.log('{');
          console.log('  urls: [');
          console.log('    \'stun:global.stun.twilio.com:3478\',');
          console.log('    \'turn:global.turn.twilio.com:3478?transport=udp\',');
          console.log('    \'turn:global.turn.twilio.com:3478?transport=tcp\',');
          console.log('    \'turn:global.turn.twilio.com:443?transport=tcp\'');
          console.log('  ],');
          console.log('  username: \'' + turnServer.username + '\',');
          console.log('  credential: \'' + turnServer.credential + '\'');
          console.log('},');
          console.log('\n⚠️  Remember: Do NOT commit credentials to Git!');
          console.log('   Use environment variables for production.');
        } else {
          console.log('⚠️  Warning: Could not find TURN server in response');
          console.log('Full response:', JSON.stringify(response, null, 2));
        }
      } else {
        console.log('⚠️  Warning: No ICE servers in response');
        console.log('Full response:', JSON.stringify(response, null, 2));
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Raw response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  process.exit(1);
});

req.end();

