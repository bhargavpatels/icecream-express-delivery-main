import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/lovable-uploads/e9e827c1-8756-4c5d-9c09-b3a33099bd3b.png" 
                alt="Shri Bombay Chowpati" 
                className="h-12 object-contain"
              />
            </Link>
            <p className="text-gray-600 mb-4">
              Enjoy the best ice cream in Rajkot delivered straight to your doorstep. Quality and taste in every bite.
            </p>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Download Our App</h3>
              <div className="flex flex-col space-y-2">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.order.bombaychowpati" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="m5 3 14 9-14 9V3z"></path>
                  </svg>
                  <span className="text-sm font-medium">Google Play</span>
                </a>
                <a 
                  href="https://apps.apple.com/app/bombaychowpati/id6560114187" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                    <path d="M10 2c1 .5 2 2 2 5"></path>
                  </svg>
                  <span className="text-sm font-medium">App Store</span>
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-pink transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-brand-pink transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-brand-pink transition-colors">Cart</Link>
              </li>
              <li>
                <Link to="/order-history" className="text-gray-600 hover:text-brand-pink transition-colors">Order History</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-brand-pink mt-1 mr-2 flex-shrink-0" />
                <div className="text-gray-600 flex flex-col">
                  <span>Shri Bombay Chowpati,</span>
                  <span>Gauridad, Morbi Road,</span>
                  <span>Rajkot, Gujarat</span>
                </div>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-brand-pink mr-2 flex-shrink-0" />
                <a href="tel:+917600772446" className="text-gray-600 hover:text-brand-pink transition-colors">+91 7600 772 446</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-brand-pink mr-2 flex-shrink-0" />
                <a href="mailto:shreebombaychowpati@gmail.com" className="text-gray-600 hover:text-brand-pink transition-colors">shreebombaychowpati@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Globe size={18} className="text-brand-pink mr-2 flex-shrink-0" />
                <a href="https://shribombaychowpati.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-pink transition-colors">shribombaychowpati.com</a>
              </li>
              <li className="flex items-center">
                <Clock size={18} className="text-brand-pink mr-2 flex-shrink-0" />
                <span className="text-gray-600">10:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Shri Bombay Chowpati Ice Cream. All rights reserved.</p>
          <p className="mt-1">Owner: SATYA NARAYAN JAT</p>
          <p className="mt-1">Developed by <a href="https://mindwaveinfoway.com/" target="_blank" rel="noopener noreferrer" className="text-brand-pink">Mindewave Infoway</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
