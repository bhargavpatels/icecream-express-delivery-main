import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Edit, Trash } from 'lucide-react';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/hooks/useUser';
import { navigateBack } from '@/utils/navigationUtils';

const Addresses = () => {
  const { user, deleteAddress } = useUser();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigateBack(navigate, '/profile');
  };
  
  const handleAddAddress = () => {
    navigate('/settings/addresses/add');
  };
  
  const handleEditAddress = (id: string) => {
    navigate(`/settings/addresses/edit/${id}`);
  };
  
  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
    toast.success("Address deleted successfully");
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-pattern">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBack} 
              className="mr-4 text-gray-500 hover:text-brand-pink transition-colors"
              type="button"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-brand-pink">Manage Addresses</h1>
          </div>
          
          <button
            onClick={handleAddAddress}
            className="w-full py-3 bg-brand-pink text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center mb-6"
          >
            <Plus size={18} className="mr-2" />
            Add New Address
          </button>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {user?.addresses && user.addresses.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {user.addresses.map((address) => (
                  <div key={address.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <MapPin size={20} className="text-brand-pink mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-gray-600 text-sm mt-1">{address.address}</p>
                          <p className="text-gray-600 text-sm">{address.city}, {address.pincode}</p>
                          {address.isDefault && <p className="text-brand-pink text-sm mt-1">Default Address</p>}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAddress(address.id)}
                          className="p-2 text-gray-500 hover:text-brand-pink"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 text-gray-500 hover:text-red-500"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MapPin size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">You don't have any saved addresses yet.</p>
                <p className="text-gray-500 text-sm">Click "Add New Address" to add one.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Addresses;
