/**
 * API utility functions for managing authentication and API requests
 */

/**
 * Get the authentication token from local storage
 * @returns The auth token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Create headers with authentication token for API requests
 * @returns Headers object with authentication if available
 */
export const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Add authentication to fetch options
 * @param options Fetch options object
 * @returns Fetch options with added auth headers
 */
export const withAuth = (options: RequestInit = {}): RequestInit => {
  return {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeaders(),
    },
  };
};

/**
 * Handle API error responses
 * @param response Response object from fetch
 * @returns JSON data if response is ok, throws error otherwise
 */
export const handleApiResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    
    if (isJson) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If parsing fails, use default error message
      }
    }
    
    throw new Error(errorMessage);
  }
  
  return isJson ? response.json() : null;
};

/**
 * Check if the user is logged in by looking for a token
 * @returns True if the user has an auth token
 */
export const isUserLoggedIn = (): boolean => {
  return !!getAuthToken();
};
