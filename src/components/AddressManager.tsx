import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Circle, MapPin } from 'lucide-react';
import { toast } from "sonner";
import { Address } from '@/types/address';
import { 
  getSavedAddresses, 
  saveAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress,
  validatePinCode,
  validateMobile
} from '@/services/addressService';
import { fetchPinCodes } from '@/services/pinCodeService';

interface AddressManagerProps {
  onAddressSelect?: (address: Address) => void;
  selectedAddressId?: string;
  showSelection?: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({ 
  onAddressSelect, 
  selectedAddressId,
  showSelection = true
}) => {
  // State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [localSelectedAddressId, setLocalSelectedAddressId] = useState<string | undefined>(selectedAddressId);
  
  // Form state
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [pinCodes, setPinCodes] = useState<string[]>([]);
  const [isLoadingPinCodes, setIsLoadingPinCodes] = useState(false);
  
  // Validation state
  const [streetAddressError, setStreetAddressError] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');
  const [mobileError, setMobileError] = useState('');
  
  // Load addresses on mount
  useEffect(() => {
    loadAddresses();
  }, []);

  // Update selected address when prop changes
  useEffect(() => {
    if (selectedAddressId) {
      setLocalSelectedAddressId(selectedAddressId);
    }
  }, [selectedAddressId]);
  
  // Load available pin codes when modal opens
  useEffect(() => {
    if (isAddressModalOpen && pinCodes.length === 0) {
      loadPinCodes();
    }
  }, [isAddressModalOpen]);
  
  // Load addresses
  const loadAddresses = async () => {
    const savedAddresses = getSavedAddresses();
    setAddresses(savedAddresses);
    
    // If we have addresses and one is selected by default, notify parent
    if (savedAddresses.length > 0 && onAddressSelect) {
      const defaultAddress = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
      
      // If there's a selected address ID, use that
      const selectedAddress = selectedAddressId 
        ? savedAddresses.find(addr => addr.id === selectedAddressId) 
        : defaultAddress;
      
      if (selectedAddress) {
        setLocalSelectedAddressId(selectedAddress.id);
        onAddressSelect(selectedAddress);
      }
    }
  };
  
  // Load pin codes
  const loadPinCodes = async () => {
    setIsLoadingPinCodes(true);
    try {
      const codes = await fetchPinCodes();
      setPinCodes(codes);
    } catch (error) {
      console.error('Error loading pin codes:', error);
    } finally {
      setIsLoadingPinCodes(false);
    }
  };
  
  // Validate address form
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate street address
    if (!streetAddress.trim()) {
      setStreetAddressError('Street address is required');
      isValid = false;
    } else {
      setStreetAddressError('');
    }
    
    // Validate pin code
    if (!validatePinCode(pinCode, pinCodes)) {
      setPinCodeError('Please enter a valid 6-digit pin code');
      isValid = false;
    } else {
      setPinCodeError('');
    }
    
    // Validate mobile number (if provided)
    if (mobileNumber && !validateMobile(mobileNumber)) {
      setMobileError('Please enter a valid 10-digit mobile number');
      isValid = false;
    } else {
      setMobileError('');
    }
    
    return isValid;
  };
  
  // Handle adding a new address
  const handleAddAddress = () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      saveAddress({
        streetAddress,
        city: city || 'Rajkot', // Default to Rajkot if city is not provided
        pinCode,
        mobileNumber: mobileNumber || undefined
      });
      
      toast.success('Address added successfully');
      resetForm();
      setIsAddressModalOpen(false);
      loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };
  
  // Handle updating an address
  const handleUpdateAddress = () => {
    if (!validateForm() || !editingAddressId) {
      return;
    }
    
    try {
      updateAddress(editingAddressId, {
        streetAddress,
        city: city || 'Rajkot',
        pinCode,
        mobileNumber: mobileNumber || undefined
      });
      
      toast.success('Address updated successfully');
      resetForm();
      setIsAddressModalOpen(false);
      setIsEditMode(false);
      setEditingAddressId(null);
      loadAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    }
  };
  
  // Handle deleting an address
  const handleDeleteAddress = (id: string) => {
    try {
      deleteAddress(id);
      toast.success('Address deleted successfully');
      loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };
  
  // Handle setting an address as default
  const handleSetDefault = (id: string) => {
    try {
      setDefaultAddress(id);
      toast.success('Default address updated');
      loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };
  
  // Handle selecting an address for delivery
  const handleSelectAddress = (address: Address) => {
    setLocalSelectedAddressId(address.id);
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };
  
  // Reset the form
  const resetForm = () => {
    setStreetAddress('');
    setCity('');
    setPinCode('');
    setMobileNumber('');
    setStreetAddressError('');
    setPinCodeError('');
    setMobileError('');
  };
  
  // Open edit modal for an address
  const handleEdit = (address: Address) => {
    setStreetAddress(address.streetAddress);
    setCity(address.city || '');
    setPinCode(address.pinCode);
    setMobileNumber(address.mobileNumber || '');
    setIsEditMode(true);
    setEditingAddressId(address.id);
    setIsAddressModalOpen(true);
  };
  
  return (
    <div className="w-full">
      {addresses.length > 0 ? (
        <div className="space-y-2">
          {addresses.map((address, index) => (
            <div 
              key={address.id} 
              className={`border rounded-lg p-4 relative ${
                localSelectedAddressId === address.id 
                  ? 'border-green-500' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex">
                <div 
                  className="cursor-pointer mr-3 flex-shrink-0 mt-1"
                  onClick={() => handleSelectAddress(address)}
                >
                  {localSelectedAddressId === address.id ? (
                    <div className="h-6 w-6 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Address</p>
                      <p className="text-gray-600 text-sm mt-1">{address.streetAddress}</p>
                      <p className="text-gray-600 text-sm">{address.city || 'Rajkot'}, {address.pinCode}</p>
                    </div>
                    
                    {address.isDefault && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="flex mt-2 space-x-3 text-xs">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-gray-500 hover:text-brand-pink flex items-center transition-colors"
                      type="button"
                    >
                      <Edit2 size={12} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-gray-500 hover:text-red-500 flex items-center transition-colors"
                      type="button"
                      disabled={address.isDefault}
                    >
                      <Trash2 size={12} className={`mr-1 ${address.isDefault ? "opacity-50" : ""}`} /> Delete
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-gray-500 hover:text-green-600 flex items-center transition-colors"
                        type="button"
                      >
                        <CheckCircle size={12} className="mr-1" /> Set as Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              setIsEditMode(false);
              setEditingAddressId(null);
              resetForm();
              setIsAddressModalOpen(true);
            }}
            className="w-full flex items-center justify-center text-brand-pink font-medium py-2 mt-2 border border-dashed border-gray-300 rounded-lg hover:border-brand-pink"
          >
            <Plus size={16} className="mr-2" />
            Add New Address
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin size={40} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
          <p className="text-gray-500 mb-4">Add a new address to save it for future orders</p>
          <button
            onClick={() => {
              setIsEditMode(false);
              resetForm();
              setIsAddressModalOpen(true);
            }}
            className="px-4 py-2 bg-brand-pink text-white rounded-lg inline-flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add New Address
          </button>
        </div>
      )}
      
      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">
              {isEditMode ? 'Edit Address' : 'Add New Address'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Enter your street address"
                  className={`w-full p-3 border ${streetAddressError ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 min-h-[80px]`}
                ></textarea>
                {streetAddressError && (
                  <p className="text-red-500 text-xs mt-1">{streetAddressError}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Pin Code <span className="text-red-500">*</span>
                </label>
                {isLoadingPinCodes ? (
                  <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading pin codes...
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      id="pincode"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className={`w-full py-3 px-3 border ${pinCodeError ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 appearance-none`}
                    >
                      <option value="">Select pin code</option>
                      {pinCodes.map((code) => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                )}
                {pinCodeError && (
                  <p className="text-red-500 text-xs mt-1">{pinCodeError}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full p-3 border ${mobileError ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50`}
                  maxLength={10}
                />
                {mobileError ? (
                  <p className="text-red-500 text-xs mt-1">{mobileError}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">Indian mobile number (starts with 6, 7, 8, or 9)</p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={isEditMode ? handleUpdateAddress : handleAddAddress}
                className="flex-1 py-2 bg-brand-pink text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                {isEditMode ? 'Update Address' : 'Save Address'}
              </button>
              <button
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setIsEditMode(false);
                  setEditingAddressId(null);
                  resetForm();
                }}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
