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
  const [isLoadingPinCodes, setIsLoadingPinCodes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();
  
  // Load pin codes on mount
  useEffect(() => {
    const loadPinCodes = async () => {
      setIsLoadingPinCodes(true);
      try {
        const codes = await fetchPinCodes();
        setPinCodes(codes);
      } catch (error) {
        console.error('Error loading pin codes:', error);
        toast.error('Failed to load pin codes');
      } finally {
        setIsLoadingPinCodes(false);
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
    navigateBack(navigate, '/settings/addresses');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-pattern">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackClick}
              className="mr-4 text-gray-500 hover:text-brand-pink transition-colors"
              type="button"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-brand-pink">{AppStrings.addNewAddress}</h1>
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
                <select
                  id="pincode"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent bg-gray-50"
                  required
                  disabled={isLoadingPinCodes}
                >
                  <option value="">Select Pin Code</option>
                  {pinCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 bg-brand-pink text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || isLoadingPinCodes}
                >
                  {isSubmitting ? 'Adding...' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddAddress;
