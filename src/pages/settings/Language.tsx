import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Languages } from 'lucide-react';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { navigateBack } from '@/utils/navigationUtils';
import { useUser } from '@/hooks/useUser';

const Language = () => {
  const { language, changeLanguage } = useUser();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'gu', label: 'Gujarati' },
    { code: 'hi', label: 'Hindi' }
  ];
  
  const handleBack = () => {
    navigateBack(navigate, '/profile');
  };
  
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    changeLanguage(lang);
    toast.success(`Language changed to ${languages.find(l => l.code === lang)?.label || lang}`);
    
    // Return to profile after a short delay to show selection
    setTimeout(() => {
      navigate('/profile', { replace: true });
    }, 500);
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
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-brand-pink">Change Language</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center">
              <Languages size={20} className="text-brand-pink mr-3" />
              <span className="font-medium">Select your preferred language</span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">{lang.label}</span>
                  {selectedLanguage === lang.code && (
                    <Check size={24} className="text-brand-pink" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Language;
