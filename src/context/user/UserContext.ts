
import { createContext } from 'react';
import { UserContextType } from './userTypes';

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  language: "en",
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: () => {},
  changePassword: async () => false,
  changeLanguage: () => {},
  deleteAccount: async () => false,
  deleteAddress: () => {}
});

export default UserContext;
