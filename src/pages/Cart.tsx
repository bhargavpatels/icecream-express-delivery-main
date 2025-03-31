import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, ShoppingBag, Info } from 'lucide-react';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartItem from '@/components/CartItem';
import AddressManager from '@/components/AddressManager';
import { useCart } from '@/context/CartContext';
import { saveOrder, generateOrderId, formatOrderDate } from '@/utils/orderStorage';
import { OrderItem } from '@/services/orderService';
import { fetchPinCodes } from '@/services/pinCodeService';
import { Address } from '@/types/address';
import { getDefaultAddress } from '@/services/addressService';
import { AppStrings } from '@/config/api-config';
import { useUser } from '@/hooks/useUser';

const Cart = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, totalAmount, totalVolume, totalCountItems, isWholesale, clearCart } = useCart();
  const { isAuthenticated } = useUser();
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddressManagerMode, setIsAddressManagerMode] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [city, setCity] = useState("Rajkot");
  const [pinCode, setPinCode] = useState("360004");
  const [pinCodes, setPinCodes] = useState<string[]>([]);
  const [isLoadingPinCodes, setIsLoadingPinCodes] = useState(false);
  const [pinCodeError, setPinCodeError] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const navigate = useNavigate();

  // Calculate volume of 5L products only - these are eligible for wholesale
  const fiveLiterVolume = cartItems.reduce((total, item) => {
    const sizeNum = parseFloat(item.selectedSize.size);
    if (sizeNum === 5) {
      return total + (sizeNum * item.quantity);
    }
    return total;
  }, 0);

  // Load default address when component mounts
  useEffect(() => {
    const defaultAddress = getDefaultAddress();
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
      const formattedAddress = formatAddressString(defaultAddress);
      setAddress(formattedAddress);
    }
  }, []);

  // Format address object to string
  const formatAddressString = (addressObj: Address): string => {
    let formattedAddress = addressObj.streetAddress;
    if (addressObj.city) {
      formattedAddress += `, ${addressObj.city}`;
    }
    formattedAddress += `, ${addressObj.pinCode}`;
    if (addressObj.mobileNumber) {
      formattedAddress += ` (Mobile: ${addressObj.mobileNumber})`;
    }
    return formattedAddress;
  };

  // Handle address selection
  const handleAddressSelect = (selectedAddr: Address) => {
    setSelectedAddress(selectedAddr);
    const formattedAddress = formatAddressString(selectedAddr);
    setAddress(formattedAddress);
  };

  // Toggle address manager mode
  const toggleAddressManager = () => {
    setIsAddressManagerMode(!isAddressManagerMode);
    setIsAddressModalOpen(true);
  };

  // Fetch pin codes when component mounts
  useEffect(() => {
    const loadPinCodes = async () => {
      if (isAddressModalOpen && pinCodes.length === 0) {
        setIsLoadingPinCodes(true);
        try {
          const codes = await fetchPinCodes();
          console.log("Fetched pin codes:", codes);
          if (Array.isArray(codes) && codes.length > 0) {
            setPinCodes(codes);
          } else {
            console.error('Received empty or invalid pin codes', codes);
          }
        } catch (error) {
          console.error('Error loading pin codes:', error);
        } finally {
          setIsLoadingPinCodes(false);
        }
      }
    };
    
    loadPinCodes();
  }, [isAddressModalOpen, pinCodes.length]);

  // Parse address when modal opens
  useEffect(() => {
    if (isAddressModalOpen) {
      // Try to extract pin code and city from current address
      const addressParts = address.split(',').map(part => part.trim());
      
      // Last part might be the pincode
      const possiblePincode = addressParts[addressParts.length - 1];
      if (possiblePincode && /^\d{6}$/.test(possiblePincode)) {
        setPinCode(possiblePincode);
        // Remove pincode from address parts
        addressParts.pop();
      }
      
      // Second to last part might be the city
      if (addressParts.length > 0) {
        const possibleCity = addressParts[addressParts.length - 1];
        if (possibleCity) {
          setCity(possibleCity);
          // Remove city from address parts
          addressParts.pop();
        }
      }
      
      // Rest is the street address
      setNewAddress(addressParts.join(', '));
    }
  }, [isAddressModalOpen, address]);

  // Validate mobile number
  const validateMobile = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    setMobileNumber(digitsOnly);
    
    if (digitsOnly.length === 0) {
      // Mobile is optional, so empty is valid
      setMobileError("");
      return true;
    } else if (digitsOnly.length !== 10) {
      setMobileError(`Please enter ${10 - digitsOnly.length} more digit${10 - digitsOnly.length !== 1 ? 's' : ''}`);
      return false;
    } else if (!/^[6-9]/.test(digitsOnly)) {
      setMobileError("Mobile number must start with 6, 7, 8, or 9");
      return false;
    } else {
      setMobileError("");
      return true;
    }
  };

  // Validate pin code
  const validatePinCode = (value: string) => {
    if (!value) {
      setPinCodeError("Pin code is required");
      return false;
    }
    
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length !== 6) {
      setPinCodeError(`Pin code must be exactly 6 digits`);
      return false;
    }
    
    if (pinCodes.length > 0 && !pinCodes.includes(digitsOnly)) {
      setPinCodeError("This pin code is not in our delivery area");
      return false;
    }
    
    setPinCodeError("");
    return true;
  };

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      toast.info("Please login to place your order");
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    
    if (!selectedAddress && !address) {
      toast.error("Please add a delivery address!");
      setIsAddressModalOpen(true);
      return;
    }
    
    const orderId = generateOrderId();
    const orderDate = formatOrderDate();
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      id: `${item.product.id}-${item.selectedSize.size}`,
      name: item.product.name,
      size: item.selectedSize.size,
      quantity: item.quantity,
      price: item.selectedSize.price,
      image: item.product.image
    }));
    
    const order = {
      id: orderId,
      date: orderDate,
      status: 'pending',
      total: totalAmount,
      address: address,
      items: orderItems
    };
    
    saveOrder(order);
    toast.success("Order placed successfully!");
    clearCart();
    navigate('/order-history');
  };

  const handleSaveAddress = () => {
    if (newAddress.trim() && pinCode) {
      // Validate pin code
      if (!validatePinCode(pinCode)) {
        toast.error("Please enter a valid pin code");
        return;
      }
      
      // Validate mobile if provided
      if (mobileNumber && !validateMobile(mobileNumber)) {
        return;
      }
      
      // City is now optional
      let fullAddress = newAddress.trim();
      if (city.trim()) {
        fullAddress += `, ${city.trim()}`;
      }
      fullAddress += `, ${pinCode}`;
      
      if (mobileNumber) {
        fullAddress += ` (Mobile: ${mobileNumber})`;
      }
      
      setAddress(fullAddress);
      setIsAddressModalOpen(false);
      setIsAddressManagerMode(false);
      toast.success("Delivery address updated!");
    } else {
      if (!newAddress.trim()) {
        toast.error("Please enter street address");
      } else if (!pinCode) {
        toast.error("Please select a pin code");
      }
    }
  };

  const clearCartItems = () => {
    clearCart();
  };

  return (
    <div className="flex flex-col min-h-screen bg-pattern">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/products" className="mr-4 text-gray-500 hover:text-brand-pink transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Your Cart</h1>
          </div>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>
                  
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <CartItem
                        key={`${item.product.id}-${item.selectedSize.size}`}
                        item={item}
                        onIncrease={() => increaseQuantity(item.product.id, item.selectedSize.size)}
                        onDecrease={() => decreaseQuantity(item.product.id, item.selectedSize.size)}
                        onRemove={() => removeFromCart(item.product.id, item.selectedSize.size)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  {/* Volume Information */}
                  <div className="flex items-center mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                    <Info size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium mb-1">Order Details</div>
                      
                      {totalVolume > 0 && (
                        <>
                          <div className="font-medium text-xs mb-1 mt-2 text-blue-700">Ice Cream Products</div>
                          <div className="flex flex-col space-y-1 border-l-2 border-blue-200 pl-2">
                            <div className="flex justify-between">
                              <span>Total Volume:</span>
                              <span>{totalVolume.toFixed(1)} liters</span>
                            </div>
                            <div className="flex justify-between">
                              <span>5L Products:</span>
                              <span>{fiveLiterVolume.toFixed(1)} liters</span>
                            </div>
                            {isWholesale && (
                              <p className="text-green-600 mt-1 text-xs">✓ Wholesale pricing applied (10+ liters)</p>
                            )}
                            {!isWholesale && fiveLiterVolume > 0 && (
                              <p className="mt-1 text-xs">Add {(10 - fiveLiterVolume).toFixed(1)} more liters for wholesale prices</p>
                            )}
                          </div>
                        </>
                      )}
                      
                      {totalCountItems > 0 && (
                        <>
                          <div className="font-medium text-xs mb-1 mt-3 text-orange-700">Cone & Candy Products</div>
                          <div className="flex flex-col space-y-1 border-l-2 border-orange-200 pl-2">
                            <div className="flex justify-between">
                              <span>Total Quantity:</span>
                              <span>{totalCountItems} pcs</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items</span>
                      <span>{cartItems.length} items ({cartItems.reduce((total, item) => total + item.quantity, 0)} qty)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹ {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">₹ 0.00</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-xl">₹ {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start mb-2">
                      <MapPin size={18} className="text-brand-pink mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Delivery Address</span>
                        {selectedAddress ? (
                          <p className="text-gray-600 text-sm mt-1">
                            {selectedAddress.streetAddress},
                            {selectedAddress.city && ` ${selectedAddress.city},`}
                            {' ' + selectedAddress.pinCode}
                            {selectedAddress.mobileNumber && ` • ${selectedAddress.mobileNumber}`}
                          </p>
                        ) : (
                          address ? (
                            <p className="text-gray-600 text-sm mt-1">{address}</p>
                          ) : (
                            <p className="text-gray-500 text-sm mt-1 italic">No delivery address selected</p>
                          )
                        )}
                      </div>
                    </div>
                    <button
                      onClick={toggleAddressManager}
                      className="text-sm text-brand-pink font-medium flex items-center mt-2 hover:underline"
                    >
                      <Plus size={14} className="mr-1" />
                      {selectedAddress ? 'Change Address' : 'Add Address'}
                    </button>
                  </div>
                  
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3 bg-brand-pink text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Place Order
                  </button>
                  <button
                    onClick={clearCartItems}
                    className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center mt-4"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Add some delicious ice cream to get started!
              </p>
              <Link
                to="/products"
                className="px-6 py-3 bg-brand-pink text-white rounded-full font-medium hover:bg-opacity-90 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </main>
      
      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            {isAddressManagerMode ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Manage Addresses</h3>
                  <button 
                    onClick={() => setIsAddressModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                
                <AddressManager 
                  onAddressSelect={handleAddressSelect}
                  selectedAddressId={selectedAddress?.id}
                  showSelection={true}
                />
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setIsAddressModalOpen(false)}
                    className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">Update Delivery Address</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Enter your street address"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[80px]"
                    ></textarea>
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
                      {AppStrings.selectPinCode} <span className="text-red-500">*</span>
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
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setPinCode(newValue);
                            validatePinCode(newValue);
                          }}
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
                      onChange={(e) => validateMobile(e.target.value)}
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
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsAddressManagerMode(true)}
                      className="text-brand-pink flex items-center hover:underline"
                    >
                      <Plus size={16} className="mr-1" />
                      Use saved addresses instead
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleSaveAddress}
                    className="flex-1 py-2 bg-brand-pink text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => setIsAddressModalOpen(false)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Cart;
