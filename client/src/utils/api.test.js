/**
 * Tests for API utilities
 */

import {
  parseJsonResponse,
  handleApiError,
  apiFetch,
  apiPost,
  apiGet,
  apiRequest,
  API_URL
} from './api';

describe('parseJsonResponse', () => {
  it('parses JSON response', async () => {
    const response = new Response(JSON.stringify({ foo: 'bar' }), {
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await parseJsonResponse(response);
    expect(data).toEqual({ foo: 'bar' });
  });

  it('returns error object for non-JSON response', async () => {
    const response = new Response('Hello world', {
      headers: { 'Content-Type': 'text/plain' }
    });
    const data = await parseJsonResponse(response);
    expect(data.error).toBe('Server returned non-JSON response');
    expect(data.message).toBe('Hello world');
  });

  it('throws on invalid JSON when content-type is application/json', async () => {
    const response = new Response('not valid json {', {
      headers: { 'Content-Type': 'application/json' }
    });
    await expect(parseJsonResponse(response)).rejects.toThrow('Invalid JSON');
  });
});

describe('handleApiError', () => {
  it('returns error object with status and message', () => {
    const res = { status: 400, statusText: 'Bad Request' };
    const data = { error: 'Validation failed' };
    const err = handleApiError(res, data);
    expect(err.status).toBe(400);
    expect(err.message).toBe('Validation failed');
    expect(err.type).toBe('validation');
  });

  it('maps 401 to authentication type', () => {
    const err = handleApiError({ status: 401 }, {});
    expect(err.type).toBe('authentication');
  });

  it('maps 403 to authorization type', () => {
    const err = handleApiError({ status: 403 }, {});
    expect(err.type).toBe('authorization');
  });

  it('maps 404 to not_found type', () => {
    const err = handleApiError({ status: 404 }, { error: 'Not found' });
    expect(err.type).toBe('not_found');
  });

  it('maps 500 to server type', () => {
    const err = handleApiError({ status: 500 }, {});
    expect(err.type).toBe('server');
    expect(err.message).toContain('Server error');
  });
});

describe('apiFetch and apiRequest', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('apiRequest returns success when fetch returns ok', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    const result = await apiRequest('/api/test', { method: 'GET' }, false);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 1 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/test'),
      expect.any(Object)
    );
  });

  it('apiRequest returns error when fetch returns non-ok', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'Bad request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    const result = await apiRequest('/api/test', { method: 'GET' }, false);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error.message).toBe('Bad request');
    expect(result.error.type).toBe('validation');
  });

  it('apiPost sends POST with JSON body', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    await apiPost('/api/test', { name: 'Test' }, false);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Test' })
      })
    );
  });

  it('apiRequest returns network error on fetch throw', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network failed'));
    const result = await apiRequest('/api/test', {}, false);
    expect(result.success).toBe(false);
    expect(result.error.type).toBe('network');
    expect(result.error.message).toBeDefined();
  });
});

describe('API_URL export', () => {
  it('exports API_URL string', () => {
    expect(typeof API_URL).toBe('string');
    expect(API_URL.length).toBeGreaterThan(0);
  });
});
