import { toast } from "sonner";
import { User } from '../types/user';
import { mockUser } from '../context/userReducer';
import { ApiUrls } from '@/config/api-config';

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` }));
    throw new Error(errorData.message || `Error ${response.status}`);
  }
  return response.json();
};

// Test function to check API connectivity
export const testApiConnection = async (): Promise<boolean> => {
  try {
    // Try to fetch the base URL to check if the server is reachable
    const response = await fetch(ApiUrls.baseUrl, {
      method: 'GET',
      mode: 'no-cors', // This might help bypass CORS issues for testing
    });
    
    console.log('Test connection response:', response);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

/**
 * Logs in a user with email/phone and password
 * Uses the live API without fallback to demo mode
 */
export const loginUser = async (identifier: string, password: string): Promise<User | null> => {
  try {
    // Test API connection first
    const isConnected = await testApiConnection();
    if (!isConnected) {
      console.error('Cannot connect to API server');
      toast.error('Cannot connect to server. Please check your internet connection.');
      return null;
    }
    
    // Create form data for the API request
    const formData = new FormData();
    
    // Check if identifier is a phone number (only contains digits)
    const isPhone = /^\d+$/.test(identifier);
    
    if (isPhone) {
      formData.append('phone', identifier);
    } else {
      formData.append('email', identifier);
    }
    
    formData.append('password', password);
    
    console.log(`Attempting to login with ${isPhone ? 'phone' : 'email'}: ${identifier}`);
    
    // Construct the full URL
    const loginUrl = `${ApiUrls.baseUrl}${ApiUrls.apiPath}${ApiUrls.login}`;
    console.log('Login URL:', loginUrl);
    
    // Try alternative approach with XMLHttpRequest instead of fetch
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', loginUrl, true);
      
      xhr.onload = function() {
        console.log('XHR Status:', xhr.status);
        console.log('XHR Response:', xhr.responseText);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('Login response data:', data);
            
            if (data.status === 'success' && data.data) {
              // Extract user data from the response
              const userData: User = {
                id: data.data.id || Date.now().toString(),
                name: data.data.name || 'User',
                email: data.data.email || identifier,
                phone: data.data.phone || '',
                addresses: data.data.addresses || []
              };
              
              // Store auth token if available
              if (data.data.token) {
                localStorage.setItem('auth_token', data.data.token);
              }
              
              toast.success(data.message || "Login successful!");
              resolve(userData);
            } else {
              toast.error(data.message || "Invalid credentials");
              resolve(null);
            }
          } catch (error) {
            console.error('Error parsing response:', error);
            toast.error("Error processing server response");
            resolve(null);
          }
        } else {
          console.error('Login failed with status:', xhr.status);
          toast.error("Login failed. Please check your credentials and try again.");
          resolve(null);
        }
      };
      
      xhr.onerror = function() {
        console.error('XHR Error:', xhr.statusText);
        toast.error("Network error. Please check your connection.");
        resolve(null);
      };
      
      xhr.send(formData);
    });
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error instanceof Error ? error.message : "Login failed. Please try again.");
    return null;
  }
};

/**
 * Registers a new user with the provided details
 * Uses the live API without fallback to demo mode
 */
export const registerUser = async (name: string, email: string, phone: string, password: string): Promise<User | null> => {
  try {
    // Validate all required fields
    if (!name || !email || !phone || !password) {
      toast.error("Please fill all required fields");
      return null;
    }
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    
    console.log('Attempting to register user:', { name, email, phone });
    
    // Construct the full URL
    const signUpUrl = `${ApiUrls.baseUrl}${ApiUrls.apiPath}${ApiUrls.signUp}`;
    console.log('SignUp URL:', signUpUrl);
    
    // Try alternative approach with XMLHttpRequest instead of fetch
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', signUpUrl, true);
      
      xhr.onload = function() {
        console.log('XHR Status:', xhr.status);
        console.log('XHR Response:', xhr.responseText);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('Registration response data:', data);
            
            if (data.status === 'success' && data.data) {
              // Extract user data from the response
              const userData: User = {
                id: data.data.id || Date.now().toString(),
                name: data.data.name || name,
                email: data.data.email || email,
                phone: data.data.phone || phone,
                addresses: data.data.addresses || []
              };
              
              // Store auth token if available
              if (data.data.token) {
                localStorage.setItem('auth_token', data.data.token);
              }
              
              toast.success(data.message || "Registration successful!");
              resolve(userData);
            } else {
              toast.error(data.message || "Registration failed");
              resolve(null);
            }
          } catch (error) {
            console.error('Error parsing response:', error);
            toast.error("Error processing server response");
            resolve(null);
          }
        } else {
          console.error('Registration failed with status:', xhr.status);
          toast.error("Registration failed. Please try again later.");
          resolve(null);
        }
      };
      
      xhr.onerror = function() {
        console.error('XHR Error:', xhr.statusText);
        toast.error("Network error. Please check your connection.");
        resolve(null);
      };
      
      xhr.send(formData);
    });
  } catch (error) {
    console.error("Registration error:", error);
    toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.");
    return null;
  }
};

export const changeUserPassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
  try {
    // Simulated password change
    if (oldPassword && newPassword) {
      toast.success("Password changed successfully");
      return true;
    } else {
      toast.error("Please fill all password fields");
      return false;
    }
  } catch (error) {
    console.error("Change password error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to change password");
    return false;
  }
};

export const deleteUserAccount = async (): Promise<boolean> => {
  try {
    // Simulated account deletion
    toast.success("Account deleted successfully");
    return true;
  } catch (error) {
    console.error("Delete account error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to delete account");
    return false;
  }
};
