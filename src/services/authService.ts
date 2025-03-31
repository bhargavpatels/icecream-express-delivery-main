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
    
    // Use the proxy for the login request
    const response = await fetch('/api/Login.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // Don't set Content-Type header when using FormData
        // The browser will set it automatically with the correct boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` }));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    const data = await response.json();
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
      return userData;
    } else {
      toast.error(data.message || "Invalid credentials");
      return null;
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        toast.error("Unable to connect to the server. Please check your internet connection.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.error("Login failed. Please try again.");
    }
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
    
    // Use the proxy for the registration request
    const response = await fetch('/api/SignUp.php', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
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
      return userData;
    } else {
      toast.error(data.message || "Registration failed");
      return null;
    }
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


