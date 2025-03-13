import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { navigateBack } from '@/utils/navigationUtils';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [phoneError, setPhoneError] = useState('');
  const [phoneHelperText, setPhoneHelperText] = useState('');
  
  // Validate phone number when it changes
  useEffect(() => {
    validatePhone(phone);
  }, [phone]);
  
  // Function to validate Indian mobile numbers
  const validatePhone = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    
    if (!digits) {
      setPhoneError('');
      setPhoneHelperText('Enter your registered 10-digit mobile number');
      return false;
    }
    
    // Check if the number starts with a valid Indian mobile prefix
    const validStart = /^[6-9]/.test(digits);
    
    if (digits.length < 10) {
      setPhoneError(validStart ? '' : 'Number must start with 6, 7, 8, or 9');
      setPhoneHelperText(`${10 - digits.length} more digit${10 - digits.length === 1 ? '' : 's'} needed`);
      return false;
    } else if (digits.length > 10) {
      setPhoneError('Number must be exactly 10 digits');
      setPhoneHelperText('Remove extra digits');
      return false;
    } else if (!validStart) {
      setPhoneError('Must start with 6, 7, 8, or 9');
      setPhoneHelperText('Valid Indian mobile numbers only');
      return false;
    }
    
    // Valid number
    setPhoneError('');
    setPhoneHelperText('Valid mobile number');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("OTP sent to your phone");
      navigate('/reset-password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBackClick = () => {
    navigateBack(navigate, '/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-grow flex flex-col items-center justify-center p-4 pt-24 pb-12">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBackClick}
              className="p-2 text-gray-500 hover:text-brand-pink"
            >
              <ArrowLeft size={24} />
            </button>
            
            <img 
              src="/lovable-uploads/e9e827c1-8756-4c5d-9c09-b3a33099bd3b.png" 
              alt="Shri Bombay Chowpati" 
              className="h-12 object-contain"
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-brand-pink mb-6">
              Forgot Password?
            </h1>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-10 py-3 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${phoneError ? 'focus:ring-red-500' : 'focus:ring-brand-pink'} focus:border-transparent bg-gray-50`}
                    placeholder="Enter your registered 10-digit mobile number"
                    maxLength={10}
                    required
                  />
                </div>
                <div className={`mt-1 text-sm ${phoneError ? 'text-red-500' : 'text-gray-500'}`}>
                  {phoneError || phoneHelperText}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                <span className="text-red-500">*</span> We will send you an OTP to reset your password
              </p>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-pink text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
              
              <div className="mt-6 text-center">
                <Link to="/login" className="text-brand-pink text-sm font-medium">
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
