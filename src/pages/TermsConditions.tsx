import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchTermsConditions } from '@/services/contentService';
import { navigateBack } from '@/utils/navigationUtils';

const TermsConditions = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getTermsConditions = async () => {
      try {
        setLoading(true);
        const terms = await fetchTermsConditions();
        setContent(terms);
      } catch (error) {
        console.error('Failed to load terms and conditions:', error);
      } finally {
        setLoading(false);
      }
    };

    getTermsConditions();
  }, []);

  // Use the improved navigateBack function
  const handleBackClick = () => {
    navigateBack(navigate);
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
            <h1 className="text-2xl font-bold text-brand-pink">Terms & Conditions</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink"></div>
              </div>
            ) : (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsConditions; 