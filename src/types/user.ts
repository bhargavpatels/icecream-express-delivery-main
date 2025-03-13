
// Define user types
export interface UserAddress {
  id: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: UserAddress[];
}

// Context type
export interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  language: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<UserAddress, "id">) => void;
  updateAddress: (address: UserAddress) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  changeLanguage: (lang: string) => void;
  deleteAccount: () => Promise<boolean>;
}
