import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { Check, Plus, Minus } from 'lucide-react';
import QuantitySelector from './QuantitySelector';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, cartItems, isWholesale, increaseQuantity, decreaseQuantity } = useCart();

  // Check if this is a 5 liter product that's eligible for wholesale pricing
  const sizeNum = parseFloat(selectedSize.size);
  const isEligibleForWholesale = sizeNum === 5;

  // Check if product is already in cart with the currently selected size
  const existingCartItem = cartItems.find(
    item => item.product.id === product.id && item.selectedSize.size === selectedSize.size
  );

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedSize);
    // Reset isAdding after a short delay
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleIncreaseQuantity = () => {
    increaseQuantity(product.id, selectedSize.size);
  };

  const handleDecreaseQuantity = () => {
    decreaseQuantity(product.id, selectedSize.size);
  };

  // Make sure the image path is properly formatted
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else if (imagePath.startsWith('/')) {
      return imagePath;
    } else {
      return `https://shribombaychowpati.com/AdminPanel/uploads/${imagePath}`;
    }
  };

  // Get the appropriate image based on size
  const getProductImage = () => {
    // If selected size is 750ml and product has a cover image, use it
    if (selectedSize.size === '750 ML' && product.cover) {
      return getImageUrl(product.cover);
    }
    // Otherwise use the default product image
    return getImageUrl(product.image);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden product-shadow animate-fade-in">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img 
          src={getProductImage()} 
          alt={product.name} 
          className="w-full aspect-square object-contain p-4"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      
      <div className="p-4">
        {/* Product Name - Center aligned with fixed height */}
        <div className="flex items-center justify-center mb-3 h-12">
          <h3 className="font-medium text-center text-sm sm:text-base line-clamp-2">
            ♦ {product.name} ♦
          </h3>
        </div>
        
        {/* Size Options - Equal sizing and alignment */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {product.sizes.map((size) => (
            <button
              key={size.size}
              onClick={() => setSelectedSize(size)}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                selectedSize.size === size.size
                  ? 'bg-brand-pink text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {size.size}
            </button>
          ))}
        </div>
        
        {/* Price and Add to Cart - Consistent spacing */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-6">
            <div className="text-sm font-medium text-gray-500">
              MRP: <span className="text-teal-600">₹ {selectedSize.mrp || selectedSize.price}</span>
              {isEligibleForWholesale && selectedSize.mrp && selectedSize.mrp !== selectedSize.price && (
                <span className="ml-2 text-xs text-brand-pink">(₹ {selectedSize.price} wholesale)</span>
              )}
            </div>
          </div>
          
          {existingCartItem ? (
            <QuantitySelector 
              quantity={existingCartItem.quantity}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
              size="small"
              variant="compact"
            />
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full py-2 rounded-md font-medium transition-all bg-brand-pink text-white hover:bg-opacity-90 disabled:opacity-70"
            >
              <span className="flex items-center justify-center gap-1">
                {isAdding ? 'Adding...' : (
                  <>
                    <Plus size={16} />
                    Add
                  </>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
