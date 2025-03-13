import { Address } from '@/types/address';
import { v4 as uuidv4 } from 'uuid';

// Local storage key for saved addresses
const ADDRESSES_STORAGE_KEY = 'user_addresses';

// Get all saved addresses
export const getSavedAddresses = (): Address[] => {
  const savedAddresses = localStorage.getItem(ADDRESSES_STORAGE_KEY);
  if (!savedAddresses) {
    return [];
  }
  
  try {
    return JSON.parse(savedAddresses);
  } catch (error) {
    console.error('Error parsing saved addresses:', error);
    return [];
  }
};

// Save a new address
export const saveAddress = (address: Omit<Address, 'id' | 'isDefault'>): Address => {
  const addresses = getSavedAddresses();
  
  // If this is the first address, make it default
  const isDefault = addresses.length === 0;
  
  const newAddress: Address = {
    ...address,
    id: uuidv4(),
    isDefault
  };
  
  // If this address is default, ensure no other address is default
  if (isDefault) {
    addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  const updatedAddresses = [...addresses, newAddress];
  localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updatedAddresses));
  
  return newAddress;
};

// Update an existing address
export const updateAddress = (id: string, addressData: Partial<Omit<Address, 'id'>>): Address | null => {
  const addresses = getSavedAddresses();
  const addressIndex = addresses.findIndex(addr => addr.id === id);
  
  if (addressIndex === -1) {
    return null;
  }
  
  const updatedAddress = { ...addresses[addressIndex], ...addressData };
  
  // If setting this address as default, update other addresses
  if (addressData.isDefault) {
    addresses.forEach(addr => {
      if (addr.id !== id) {
        addr.isDefault = false;
      }
    });
  }
  
  addresses[addressIndex] = updatedAddress;
  localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
  
  return updatedAddress;
};

// Delete an address
export const deleteAddress = (id: string): boolean => {
  const addresses = getSavedAddresses();
  const filteredAddresses = addresses.filter(addr => addr.id !== id);
  
  if (filteredAddresses.length === addresses.length) {
    return false; // Address not found
  }
  
  // If we deleted the default address, make the first address default
  if (addresses.find(addr => addr.id === id)?.isDefault && filteredAddresses.length > 0) {
    filteredAddresses[0].isDefault = true;
  }
  
  localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(filteredAddresses));
  return true;
};

// Set an address as default
export const setDefaultAddress = (id: string): Address | null => {
  return updateAddress(id, { isDefault: true });
};

// Get the default address
export const getDefaultAddress = (): Address | null => {
  const addresses = getSavedAddresses();
  return addresses.find(addr => addr.isDefault) || (addresses.length > 0 ? addresses[0] : null);
};

// Validate pincode (reusing existing logic)
export const validatePinCode = (pinCode: string, availablePinCodes: string[]): boolean => {
  if (!pinCode) {
    return false;
  }
  
  const digitsOnly = pinCode.replace(/\D/g, '');
  
  if (digitsOnly.length !== 6) {
    return false;
  }
  
  if (availablePinCodes.length > 0 && !availablePinCodes.includes(digitsOnly)) {
    return false;
  }
  
  return true;
};

// Validate mobile (reusing existing logic)
export const validateMobile = (mobile: string): boolean => {
  if (!mobile) {
    return true; // Mobile is optional
  }
  
  const digitsOnly = mobile.replace(/\D/g, '');
  
  if (digitsOnly.length !== 10) {
    return false;
  }
  
  if (!/^[6-9]/.test(digitsOnly)) {
    return false;
  }
  
  return true;
};
