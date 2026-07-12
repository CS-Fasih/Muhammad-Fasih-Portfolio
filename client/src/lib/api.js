export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest(path, options = {}) {
  const { body, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');

  let requestBody = body;
  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(path, {
      credentials: 'include',
      ...requestOptions,
      headers: requestHeaders,
      body: requestBody,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Unable to reach the server. Check your connection and try again.', 0);
  }

  const contentType = response.headers.get('content-type') || '';
  let payload = null;

  if (response.status !== 204) {
    try {
      payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message = typeof payload === 'object' && payload
      ? payload.error || payload.message
      : null;
    const details = typeof payload === 'object' && payload
      ? payload.errors || payload.details
      : null;

    throw new ApiError(
      message || 'Something went wrong. Please try again.',
      response.status,
      details,
    );
  }

  return payload;
}
