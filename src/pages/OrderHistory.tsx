import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Truck, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { enrichOrderItemsWithProductData, OrderItem } from '@/services/orderService';
import { getOrders, StoredOrder } from '@/utils/orderStorage';

// Mock data for order history
// This is sample data used for development and testing purposes
// In a production environment, this would be fetched from an API
const initialOrders = [
  {
    id: 'ORD123456',
    date: 'July 21, 2024 02:50',
    status: 'pending',
    total: 1675,
    address: '512, Mindwave Infoway, Shivalay Complex, Mavdi Road, Rajkot',
    items: [
      {
        id: 'american-dry-fruit-5l',
        name: 'American Dry Fruit',
        size: '5 Litre',
        quantity: 2,
        price: 550,
        image: '/lovable-uploads/04cf3976-e7c5-4ac3-b9e8-56c930935730.png'
      },
      {
        id: 'american-dry-fruit-750ml',
        name: 'American Dry Fruit',
        size: '750 ML',
        quantity: 1,
        price: 135,
        image: '/lovable-uploads/04cf3976-e7c5-4ac3-b9e8-56c930935730.png'
      },
      {
        id: 'anjir-5l',
        name: 'Anjir',
        size: '5 Litre',
        quantity: 1,
        price: 440,
        image: '/lovable-uploads/2cbb579d-e6e6-451a-9646-15f36d014a0d.png'
      }
    ]
  },
  // Order with completed status - sample order from July 16, 2024
  // This example shows a smaller order with a single item type
  {
    id: 'ORD123455',
    date: 'July 16, 2024 03:36',
    status: 'completed',
    total: 910,
    address: '512, Mindwave Infoway, Shivalay Complex, Mavdi Road, Rajkot',
    items: [
      {
        id: 'butter-scotch-750ml',
        name: 'Butter Scotch',
        size: '750 ML',
        quantity: 7,
        price: 130,
        image: '/lovable-uploads/ba51d014-83b7-4953-89a2-76223693f38c.png'
      }
    ]
  },
  // Order with completed status - sample order from July 16, 2024
  // This example shows a smaller order with a single item type
  {
    id: 'ORD123454',
    date: 'July 16, 2024 03:36',
    status: 'completed',
    total: 835,
    address: '512, Mindwave Infoway, Shivalay Complex, Mavdi Road, Rajkot',
    items: [
      {
        id: 'american-dry-fruit-750ml',
        name: 'American Dry Fruit',
        size: '750 ML',
        quantity: 1,
        price: 135,
        image: '/lovable-uploads/04cf3976-e7c5-4ac3-b9e8-56c930935730.png'
      },
      {
        id: 'dry-fruit-5l',
        name: 'Dry Fruit',
        size: '5 Litre',
        quantity: 1,
        price: 550,
        image: '/lovable-uploads/04cf3976-e7c5-4ac3-b9e8-56c930935730.png'
      }
    ]
  },
  // Order with completed status - sample order from July 13, 2024
  // Example of a larger order with premium flavors
  {
    id: 'ORD123453',
    date: 'July 13, 2024 08:59',
    status: 'completed',
    total: 1985,
    address: '512, Mindwave Infoway, Shivalay Complex, Mavdi Road, Rajkot',
    items: [
      {
        id: 'dry-fruit-5l',
        name: 'Dry Fruit',
        size: '5 Litre',
        quantity: 1,
        price: 550,
        image: '/lovable-uploads/04cf3976-e7c5-4ac3-b9e8-56c930935730.png'
      },
      {
        id: 'badam-pista-5l',
        name: 'Badam Pista',
        size: '5 Litre',
        quantity: 1, 
        price: 490,
        image: '/lovable-uploads/44650b1c-7ba8-42f0-8efa-4fdf70e5b686.png'
      }
    ]
  }
];

// Type definition for orders with dynamically fetched images
interface OrderWithDynamicImages {
  id: string;
  date: string;
  status: string;
  total: number;
  address: string;
  items: OrderItem[];
}

/**
 * OrderHistory Component
 * 
 * Displays a history of past orders with detailed information
 * Uses dynamic product image fetching to display the correct images
 * for each ordered item based on product data
 */
const OrderHistory = () => {
  const [orders, setOrders] = useState<OrderWithDynamicImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders and enrich them with product data
    const fetchOrdersWithProductImages = async () => {
      try {
        // First try to get user's saved orders from storage
        const savedOrders = getOrders();
        
        // If no saved orders, fall back to sample data
        const ordersToProcess = savedOrders.length > 0 ? savedOrders : initialOrders;
        
        // Process each order to enrich items with product data
        const ordersWithImages = await Promise.all(
          ordersToProcess.map(async (order) => {
            const enrichedItems = await enrichOrderItemsWithProductData(order.items);
            return {
              ...order,
              items: enrichedItems
            };
          })
        );
        
        setOrders(ordersWithImages);
      } catch (error) {
        console.error('Error fetching product images:', error);
        // Fallback to initial orders if there's an error
        setOrders(initialOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithProductImages();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-pattern">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4 text-gray-500 hover:text-brand-pink transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Order History</h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-8">
                You haven't placed any orders with us yet.
              </p>
              <Link
                to="/products"
                className="px-6 py-3 bg-brand-pink text-white rounded-full font-medium hover:bg-opacity-90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface OrderCardProps {
  order: OrderWithDynamicImages;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <span className="text-sm text-gray-500">Order ID: {order.id}</span>
            <div className="mt-1 font-medium">{order.date}</div>
          </div>
          
          <div className="mt-3 sm:mt-0 flex items-center">
            <span className="font-bold text-xl mr-3">₹ {order.total}</span>
            <StatusBadge status={order.status} />
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="mr-2 mt-1 text-brand-pink">
            <Clock size={16} />
          </div>
          <div className="text-sm text-gray-600">
            <p>{order.address}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-3">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={item.id} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                  <Image 
                    src={item.product?.image || item.image} 
                    alt={item.product?.name || item.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
              ))}
              
              {order.items.length > 3 && (
                <div className="h-10 w-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-brand-pink text-sm font-medium hover:underline"
          >
            {isExpanded ? 'Show Less' : 'Show Details'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-gray-50 animate-fade-in">
          <h3 className="font-medium mb-3">Order Items</h3>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center">
                <Image 
                  src={item.product?.image || item.image} 
                  alt={item.product?.name || item.name} 
                  className="h-16 w-16 object-cover rounded-md mr-4" 
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product?.name || item.name}</h4>
                  <div className="text-sm text-gray-500 mt-1">{item.size}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹ {item.price}</div>
                  <div className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>₹ {order.total}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Delivery Fee</span>
              <span>₹ 0.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>₹ {order.total}</span>
            </div>
          </div>
          
          {order.status === 'pending' && (
            <div className="mt-6">
              <button className="w-full py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors">
                Cancel Order
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <div className="flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
          <Truck size={14} className="mr-1" />
          Pending
        </div>
      );
    case 'completed':
      return (
        <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
          <CheckCircle size={14} className="mr-1" />
          Completed
        </div>
      );
    default:
      return (
        <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {status}
        </div>
      );
  }
};

export default OrderHistory;
