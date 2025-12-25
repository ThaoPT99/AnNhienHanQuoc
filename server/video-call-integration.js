/**
 * Video Call Integration Module
 * Supports Zoom and Google Meet API integration
 */

const axios = require('axios');

// Zoom API Integration
class ZoomIntegration {
  constructor() {
    this.apiKey = process.env.ZOOM_API_KEY;
    this.apiSecret = process.env.ZOOM_API_SECRET;
    this.accountId = process.env.ZOOM_ACCOUNT_ID;
    this.baseURL = 'https://api.zoom.us/v2';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    // Check if token is still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Zoom API credentials not configured');
    }

    try {
      // For Server-to-Server OAuth (recommended for production)
      if (this.accountId) {
        const auth = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
        const response = await axios.post(
          `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`,
          {},
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        this.accessToken = response.data.access_token;
        this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 min buffer
        return this.accessToken;
      } else {
        // Fallback to basic auth (deprecated but works)
        const auth = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
        const response = await axios.post(
          'https://zoom.us/oauth/token?grant_type=client_credentials',
          {},
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        this.accessToken = response.data.access_token;
        this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
        return this.accessToken;
      }
    } catch (error) {
      console.error('Error getting Zoom access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Zoom API');
    }
  }

  async createMeeting(meetingData) {
    try {
      const token = await this.getAccessToken();
      const { topic, start_time, duration, timezone, password, settings } = meetingData;

      const response = await axios.post(
        `${this.baseURL}/users/me/meetings`,
        {
          topic: topic || 'Consultation Meeting',
          type: 2, // Scheduled meeting
          start_time: start_time,
          duration: duration || 30,
          timezone: timezone || 'Asia/Ho_Chi_Minh',
          password: password || this.generatePassword(),
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: false,
            ...settings
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        meeting_id: response.data.id.toString(),
        meeting_url: response.data.join_url,
        meeting_password: response.data.password,
        start_url: response.data.start_url,
        start_time: response.data.start_time,
        duration: response.data.duration
      };
    } catch (error) {
      console.error('Error creating Zoom meeting:', error.response?.data || error.message);
      throw new Error('Failed to create Zoom meeting');
    }
  }

  generatePassword() {
    return Math.random().toString(36).substr(2, 8);
  }
}

// Google Meet Integration (via Google Calendar API)
class GoogleMeetIntegration {
  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    // Check if token is still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      throw new Error('Google API credentials not configured');
    }

    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token'
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Google access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Google API');
    }
  }

  async createMeeting(meetingData) {
    try {
      const token = await this.getAccessToken();
      const { summary, start_time, end_time, timezone, description } = meetingData;

      // Create calendar event with Google Meet link
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          summary: summary || 'Consultation Meeting',
          description: description || '',
          start: {
            dateTime: start_time,
            timeZone: timezone || 'Asia/Ho_Chi_Minh'
          },
          end: {
            dateTime: end_time,
            timeZone: timezone || 'Asia/Ho_Chi_Minh'
          },
          conferenceData: {
            createRequest: {
              requestId: `meet-${Date.now()}`,
              conferenceSolutionKey: {
                type: 'hangoutsMeet'
              }
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            conferenceDataVersion: 1
          }
        }
      );

      return {
        meeting_id: response.data.id,
        meeting_url: response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri,
        meeting_password: null, // Google Meet doesn't use passwords
        start_time: response.data.start.dateTime,
        duration: Math.round((new Date(response.data.end.dateTime) - new Date(response.data.start.dateTime)) / 60000)
      };
    } catch (error) {
      console.error('Error creating Google Meet:', error.response?.data || error.message);
      throw new Error('Failed to create Google Meet');
    }
  }
}

// Main integration class
class VideoCallIntegration {
  constructor() {
    this.zoom = new ZoomIntegration();
    this.googleMeet = new GoogleMeetIntegration();
  }

  async createMeeting(platform, meetingData) {
    try {
      if (platform === 'zoom') {
        return await this.zoom.createMeeting(meetingData);
      } else if (platform === 'google-meet') {
        return await this.googleMeet.createMeeting(meetingData);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      // Fallback to mock meeting if API fails
      console.warn(`API integration failed for ${platform}, using fallback:`, error.message);
      return this.createMockMeeting(platform, meetingData);
    }
  }

  createMockMeeting(platform, meetingData) {
    const meetingId = `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const password = Math.random().toString(36).substr(2, 8);

    if (platform === 'zoom') {
      return {
        meeting_id: meetingId,
        meeting_url: `https://zoom.us/j/${meetingId}`,
        meeting_password: password,
        start_time: meetingData.start_time,
        duration: meetingData.duration || 30
      };
    } else {
      return {
        meeting_id: meetingId,
        meeting_url: `https://meet.google.com/${meetingId}`,
        meeting_password: null,
        start_time: meetingData.start_time,
        duration: meetingData.duration || 30
      };
    }
  }

  isConfigured(platform) {
    if (platform === 'zoom') {
      return !!(process.env.ZOOM_API_KEY && process.env.ZOOM_API_SECRET);
    } else if (platform === 'google-meet') {
      return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
    }
    return false;
  }
}

module.exports = new VideoCallIntegration();

