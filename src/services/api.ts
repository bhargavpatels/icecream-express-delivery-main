import { ApiUrls } from '@/config/api-config';
import { Product } from '@/types/product';
import { fallbackProducts } from '@/data/products';
import { withAuth, handleApiResponse } from '@/utils/apiUtils';

const API_BASE_URL = ApiUrls.baseUrl; 

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

// Adapter function to convert API product to TypeProduct
const adaptProduct = (product: any): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.image,
    sizes: product.sizes.map((size: any) => ({
      size: size.name || "Regular",
      price: size.price
    }))
  };
};

// Fetch products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ApiUrls.getProducts}`, withAuth());
    return handleApiResponse(response).then(data => data.map(adaptProduct));
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to local data in case of API failure
    return fallbackProducts;
  }
};

// Fetch product by ID
export const fetchProductById = async (productId: string): Promise<Product> => {
  try {
    // Modified to use the actual API format
    const formData = new FormData();
    formData.append('pid', productId);
    
    const response = await fetch(`${API_BASE_URL}${ApiUrls.getProducts}`, {
      method: 'POST',
      body: formData,
      ...withAuth()
    });
    
    const data = await handleApiResponse(response);
    return adaptProduct(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    // Return a fallback product from the local data
    const fallbackProduct = fallbackProducts.find(p => p.id === productId);
    if (!fallbackProduct) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    return fallbackProduct;
  }
};

// Create new order
export interface OrderRequest {
  userId: string;
  addressId: string;
  totalAmount: number;
  orderMeta: OrderItemMeta[];
}

export interface OrderItemMeta {
  pid: string;
  pMetaId: string;
  quantity: number;
  amount: number;
}

export const placeOrder = async (orderData: OrderRequest) => {
  try {
    const formData = new FormData();
    formData.append('userId', orderData.userId);
    formData.append('addressId', orderData.addressId);
    formData.append('totalAmount', orderData.totalAmount.toString());
    formData.append('orderMeta', JSON.stringify(orderData.orderMeta));

    const response = await fetch(`${API_BASE_URL}${ApiUrls.createOrder}`, {
      method: 'POST',
      body: formData,
      ...withAuth()
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error placing order:', error);
    throw new Error('Failed to place order. Please try again.');
  }
};

// Fetch order history
export const fetchOrderHistory = async (phone: string) => {
  try {
    const formData = new FormData();
    formData.append('phone', phone);
    
    const response = await fetch(`${API_BASE_URL}${ApiUrls.getOrders}`, {
      method: 'POST',
      body: formData,
      ...withAuth()
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw new Error('Failed to fetch order history. Please try again.');
  }
};

// Track order
export const trackOrder = async (orderId: string) => {
  try {
    const formData = new FormData();
    formData.append('orderId', orderId);
    
    const response = await fetch(`${API_BASE_URL}${ApiUrls.getOrders}`, {
      method: 'POST',
      body: formData,
      ...withAuth()
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error(`Error tracking order ${orderId}:`, error);
    throw new Error('Failed to track order. Please try again.');
  }
};

// Cancel order
export const cancelOrder = async (orderId: string) => {
  try {
    const formData = new FormData();
    formData.append('orderId', orderId);
    
    const response = await fetch(`${API_BASE_URL}${ApiUrls.cancelOrder}`, {
      method: 'POST',
      body: formData,
      ...withAuth()
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error(`Error canceling order ${orderId}:`, error);
    throw new Error('Failed to cancel order. Please try again.');
  }
};

// Get user addresses
export const fetchAddresses = async (userId: string) => {
  try {
    const formData = new FormData();
    formData.append('userId', userId);
    
    const response = await fetch(`${API_BASE_URL}${ApiUrls.getAddress}`, {
      method: 'POST',
      body: formData,
      ...withAuth()
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw new Error('Failed to fetch addresses. Please try again.');
  }
};

// Add new address
export interface AddressRequest {
  userId: string;
  address: string;
  pinCode: string;
}

export const addAddress = async (addressData: AddressRequest) => {
  try {
    const formData = new FormData();
    formData.append('userId', addressData.userId);
    formData.append('address', addressData.address);
    formData.append('pinCode', addressData.pinCode);
    
    const response = await fetch(`${API_BASE_URL}${ApiUrls.addAddress}`, {
      method: 'POST',
      body: formData,
      ...withAuth()
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error adding address:', error);
    throw new Error('Failed to add address. Please try again.');
  }
};
