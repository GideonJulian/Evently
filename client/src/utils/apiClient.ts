import { tokenManager } from './tokenManager';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function apiCall<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { requiresAuth = false, ...fetchOptions } = options;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers || {}),
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = await tokenManager.getToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required. Please login.',
        };
      }
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export { apiCall };
