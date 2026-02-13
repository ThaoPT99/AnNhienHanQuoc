/**
 * Tests for API configuration
 */

import {
  getApiUrl,
  API_URL,
  buildApiUrl,
  API_ENDPOINTS,
  getEndpointUrl
} from './api';

describe('getApiUrl', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env.REACT_APP_API_URL = originalEnv.REACT_APP_API_URL;
    process.env.NODE_ENV = originalEnv.NODE_ENV;
    process.env.REACT_APP_DEV_API_URL = originalEnv.REACT_APP_DEV_API_URL;
  });

  it('returns REACT_APP_API_URL when set', () => {
    process.env.REACT_APP_API_URL = 'https://custom.api.com';
    expect(getApiUrl()).toBe('https://custom.api.com');
  });

  it('returns production URL when NODE_ENV is production and no REACT_APP_API_URL', () => {
    delete process.env.REACT_APP_API_URL;
    process.env.NODE_ENV = 'production';
    expect(getApiUrl()).toBe('https://annhienhanquoc-production.up.railway.app');
  });

  it('returns localhost when NODE_ENV is development and no REACT_APP_API_URL', () => {
    delete process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_DEV_API_URL;
    process.env.NODE_ENV = 'development';
    expect(getApiUrl()).toBe('http://localhost:5000');
  });
});

describe('API_URL', () => {
  it('is a non-empty string', () => {
    expect(typeof API_URL).toBe('string');
    expect(API_URL.length).toBeGreaterThan(0);
  });

  it('does not end with slash', () => {
    expect(API_URL.endsWith('/')).toBe(false);
  });
});

describe('buildApiUrl', () => {
  it('concatenates API_URL and endpoint', () => {
    const url = buildApiUrl('/api/health');
    expect(url).toContain('/api/health');
    expect(url).toMatch(/^https?:\/\//);
  });

  it('adds leading slash to endpoint if missing', () => {
    const url = buildApiUrl('api/health');
    expect(url).toContain('/api/health');
  });

  it('does not create double slashes', () => {
    const url = buildApiUrl('/api/health');
    expect(url).not.toMatch(/\/\/api/);
  });
});

describe('API_ENDPOINTS', () => {
  it('has AUTH endpoints', () => {
    expect(API_ENDPOINTS.AUTH).toBeDefined();
    expect(API_ENDPOINTS.AUTH.LOGIN).toBe('/api/auth/login');
    expect(API_ENDPOINTS.AUTH.REGISTER).toBe('/api/auth/register');
  });

  it('has NEWSLETTER endpoints', () => {
    expect(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE).toBe('/api/newsletter/subscribe');
  });

  it('has dynamic endpoint as function', () => {
    expect(typeof API_ENDPOINTS.COMMUNITY.POST).toBe('function');
    expect(API_ENDPOINTS.COMMUNITY.POST(5)).toBe('/api/community/posts/5');
  });

  it('GAMIFICATION.RANK encodes email', () => {
    const path = API_ENDPOINTS.GAMIFICATION.RANK('user+test@example.com');
    expect(path).toContain('user%2Btest%40example.com');
  });
});

describe('getEndpointUrl', () => {
  it('returns full URL for simple endpoint key', () => {
    const url = getEndpointUrl('AUTH.LOGIN');
    expect(url).toContain('/api/auth/login');
    expect(url).toMatch(/^https?:\/\//);
  });

  it('returns full URL for path string', () => {
    const url = getEndpointUrl('/api/health');
    expect(url).toContain('/api/health');
  });

  it('returns full URL for dynamic endpoint with param', () => {
    const url = getEndpointUrl('GAMIFICATION.RANK', 'user@test.com');
    expect(url).toContain('/api/leaderboard/rank/');
    expect(url).toContain(encodeURIComponent('user@test.com'));
  });

  it('returns full URL for COMMUNITY.POST with id', () => {
    const url = getEndpointUrl('COMMUNITY.POST', 123);
    expect(url).toContain('/api/community/posts/123');
  });

  it('falls back to buildApiUrl(endpoint) when key not found', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const url = getEndpointUrl('UNKNOWN.KEY');
    expect(url).toContain('UNKNOWN.KEY');
    consoleSpy.mockRestore();
  });
});
