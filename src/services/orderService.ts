import { Product } from "@/types/product";
import { getProducts } from "@/services/productApi";
import { fallbackProducts } from "@/data/products";

/**
 * Interface for order item
 */
export interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  product?: {
    name: string;
    image: string;
    cover?: string;
  };
}

/**
 * Find a product by name and size
 * @param products - List of products
 * @param name - Product name to find
 * @param size - Product size to find
 * @returns Matching product or undefined
 */
const findProductByNameAndSize = (
  products: Product[],
  name: string,
  size: string
): Product | undefined => {
  return products.find(
    (product) =>
      product.name.toLowerCase() === name.toLowerCase() &&
      product.sizes.some((s) => s.size.toLowerCase() === size.toLowerCase())
  );
};

/**
 * Get the image URL for a product by name and size
 * @param name - Product name
 * @param size - Product size
 * @returns Promise resolving to image URL
 */
export const getProductImageByNameAndSize = async (
  name: string,
  size: string
): Promise<string> => {
  try {
    // Try to get products from API
    const products = await getProducts();
    
    // Find the product
    const product = findProductByNameAndSize(products, name, size);
    
    // Return the image URL if found, otherwise return placeholder
    return product?.image || "/placeholder.svg";
  } catch (error) {
    console.error("Error fetching product image:", error);
    
    // Fallback to local data if API fails
    const product = findProductByNameAndSize(fallbackProducts, name, size);
    return product?.image || "/placeholder.svg";
  }
};

/**
 * Enrich order items with product data
 * @param orderItems - Order items to enrich
 * @returns Promise resolving to enriched order items
 */
export const enrichOrderItemsWithProductData = async (
  orderItems: OrderItem[]
): Promise<OrderItem[]> => {
  try {
    // Get all products
    const products = await getProducts();
    
    // Map order items to include product data
    return await Promise.all(
      orderItems.map(async (item) => {
        const product = findProductByNameAndSize(products, item.name, item.size);
        
        // Get the appropriate image based on size
        const getProductImage = () => {
          if (item.size === '750 ML' && product?.cover) {
            return product.cover;
          }
          return product?.image || item.image || "/placeholder.svg";
        };
        
        return {
          ...item,
          image: getProductImage(),
          product: product
            ? {
                name: product.name,
                image: product.image,
                cover: product.cover
              }
            : undefined,
        };
      })
    );
  } catch (error) {
    console.error("Error enriching order items:", error);
    
    // Fallback to local data if API fails
    return orderItems.map((item) => {
      const product = findProductByNameAndSize(fallbackProducts, item.name, item.size);
      
      // Get the appropriate image based on size
      const getProductImage = () => {
        if (item.size === '750 ML' && product?.cover) {
          return product.cover;
        }
        return product?.image || item.image || "/placeholder.svg";
      };
      
      return {
        ...item,
        image: getProductImage(),
        product: product
          ? {
              name: product.name,
              image: product.image,
              cover: product.cover
            }
          : undefined,
      };
    });
  }
};
