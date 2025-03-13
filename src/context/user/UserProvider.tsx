import React, { useReducer, ReactNode } from 'react';
import { toast } from "sonner";
import { User } from '../../types/user';
import { userReducer, mockUser } from './userReducer';
import { UserState, UserContextType } from './userTypes';
import UserContext from './UserContext';
import { saveUserToStorage, getUserFromStorage, clearUserStorage, saveLanguageToStorage, getLanguageFromStorage } from '../../utils/userStorage';
import { loginUser, registerUser } from '../../services/authService';

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Initialize state with data from storage
  const initialState: UserState = {
    user: getUserFromStorage() || null,
    language: getLanguageFromStorage()
  };

  const [state, dispatch] = useReducer(userReducer, initialState);
  
  // Check if user is authenticated
  const isAuthenticated = !!state.user;
  
  // Login function using real API
  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      const user = await loginUser(identifier, password);
      
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        saveUserToStorage(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };
  
  // Register function using real API
  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      const user = await registerUser(name, email, phone, password);
      
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        saveUserToStorage(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    clearUserStorage();
    toast.success("Logged out successfully");
  };
  
  // Update profile function
  const updateProfile = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: userData });
    
    // Update local storage
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      saveUserToStorage(updatedUser);
    }
  };
  
  // Change password function - simulated for demo purposes
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // In a real app, you would make an API call here
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just return success
      toast.success("Password changed successfully");
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Failed to change password. Please try again.");
      return false;
    }
  };
  
  // Change language function
  const changeLanguage = (lang: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    saveLanguageToStorage(lang);
  };
  
  // Delete account function - simulated for demo purposes
  const deleteAccount = async (): Promise<boolean> => {
    try {
      // In a real app, you would make an API call here
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'SET_USER', payload: null });
      clearUserStorage();
      
      toast.success("Account deleted successfully");
      return true;
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account. Please try again.");
      return false;
    }
  };
  
  // Delete address function
  const deleteAddress = (id: string) => {
    dispatch({ type: 'DELETE_ADDRESS', payload: id });
    
    // Update local storage
    if (state.user) {
      const updatedAddresses = state.user.addresses.filter(addr => addr.id !== id);
      const updatedUser = { ...state.user, addresses: updatedAddresses };
      saveUserToStorage(updatedUser);
    }
  };
  
  // Context value
  const value: UserContextType = {
    user: state.user,
    isAuthenticated,
    language: state.language,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    changeLanguage,
    deleteAccount,
    deleteAddress
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
