import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { navigateBack } from '@/utils/navigationUtils';
import { useUser } from '@/hooks/useUser';
import { fetchPinCodes } from '@/services/pinCodeService';
import { AppStrings } from '@/config/api-config';
import { UserAddress } from '@/types/user';

const AddAddress = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [pinCodes, setPinCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();

  // Fetch pin codes when component mounts
  useEffect(() => {
    const loadPinCodes = async () => {
      setIsLoading(true);
      try {
        const codes = await fetchPinCodes();
        setPinCodes(codes);
      } catch (error) {
        console.error('Error loading pin codes:', error);
        toast.error("Failed to load pin codes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPinCodes();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast.error(AppStrings.pleaseEnterAddress);
      return;
    }
    
    if (!city.trim()) {
      toast.error("Please enter city");
      return;
    }
    
    if (!pinCode) {
      toast.error(AppStrings.pleaseSelectPinCode);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new address object
      const newAddress: Omit<UserAddress, "id"> = {
        address: address.trim(),
        city: city.trim(),
        pincode: pinCode,
        isDefault: user?.addresses && user.addresses.length === 0 // Make default if first address
      };
      
      // Update user profile with new address
      updateProfile({
        addresses: [...(user?.addresses || []), { ...newAddress, id: Date.now().toString() }]
      });
      
      toast.success("Address added successfully");
      navigate('/settings/addresses');
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle back navigation
  const handleBackClick = () => {
    navigateBack(navigate);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-grow flex flex-col p-4 pt-24 pb-24">
        <div className="w-full max-w-lg mx-auto">
          <div className="mb-6 flex items-center">
            <button
              onClick={handleBackClick}
              className="p-2 text-gray-500 hover:text-brand-pink"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-brand-pink ml-2">{AppStrings.addNewAddress}</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  {AppStrings.enterAddress}
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent bg-gray-50 min-h-[100px]"
                  placeholder={AppStrings.enterAddress}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent bg-gray-50"
                  placeholder="Enter city name"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  {AppStrings.selectPinCode}
                </label>
                <div className="relative">
                  <select
                    id="pincode"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full py-3 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent bg-gray-50 appearance-none"
                    required
                    disabled={isLoading}
                  >
                    <option value="">{isLoading ? 'Loading pin codes...' : 'Select pin code'}</option>
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
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-3 bg-brand-pink text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Address'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddAddress;
