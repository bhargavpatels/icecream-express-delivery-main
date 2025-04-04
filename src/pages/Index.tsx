import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, IceCream, Truck, ThumbsUp, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { fallbackProducts } from '@/data/products';

const Index = () => {
  const featuredProducts = fallbackProducts.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-pattern">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
          <div className="w-full max-w-3xl mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <img
                src="/lovable-uploads/splash_image.png"
                alt="Bombay Chowpati Ice Cream"
                className="w-full max-w-md mx-auto"
              />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
              <span className="block text-brand-pink">Delicious Ice Cream</span>
              <span className="block">Delivered to Your Door</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 animate-fade-in delay-100">
              Experience the best ice cream flavors in Rajkot with our quick and reliable delivery service.
            </p>

            {/* App Store Links */}

            <div className="text-lg md:text-x text-gray-600 mb-8 animate-fade-in delay-100">
              <span>We're also available on: </span>
              <a
                href="https://play.google.com/store/apps/details?id=com.order.bombaychowpati"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-pink hover:underline"
              >
                Play Store
              </a>
              <span> & </span>
              <a
                href="https://apps.apple.com/app/bombaychowpati/id6560114187"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-pink hover:underline"
              >
                App Store
              </a>
            </div>


            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
              <Link
                to="/products"
                className="px-8 py-3 bg-brand-pink text-white rounded-full font-medium hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Browse Flavors
              </Link>

              <Link
                to="/order-history"
                className="px-8 py-3 bg-white text-gray-800 rounded-full font-medium border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#FFFFFF" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We take pride in delivering quality ice cream with exceptional service, ensuring a delightful experience with every order.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<IceCream className="text-brand-pink" size={32} />}
              title="Premium Quality"
              description="Made with the finest ingredients for an authentic taste experience."
            />

            <FeatureCard
              icon={<Truck className="text-brand-pink" size={32} />}
              title="Fast Delivery"
              description="Quick delivery to ensure your ice cream arrives in perfect condition."
            />

            <FeatureCard
              icon={<ThumbsUp className="text-brand-pink" size={32} />}
              title="Customer Satisfaction"
              description="We prioritize your happiness with every scoop we deliver."
            />

            <FeatureCard
              icon={<Clock className="text-brand-pink" size={32} />}
              title="Convenient Hours"
              description="Order anytime and enjoy our ice cream when you want it most."
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Flavors</h2>
            <Link
              to="/products"
              className="flex items-center text-brand-pink font-medium hover:underline"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-pink to-red-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Satisfy Your Sweet Cravings?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Order now and experience the delicious taste of Bombay Chowpati ice cream delivered right to your doorstep.
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-4 bg-white text-brand-pink rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Order Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in">
      <div className="h-14 w-14 rounded-full bg-pink-50 flex items-center justify-center mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default Index;


