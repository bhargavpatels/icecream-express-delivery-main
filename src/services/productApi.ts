import { Product, ProductSize } from "@/types/product";
import { sampleApiResponse, coneCandyApiResponse } from "@/data/products";

// Interface for API responses
export interface ApiResponse<T> {
  code: string;
  msg: string;
  Data: T;
}

// Interface for product data from API
export interface ApiProductData {
  pid: string;
  title: string;
  status: string;
  type: string;
  image: string;
  cover: string;
  product_data: ApiProductSizeData[];
}

// Interface for product size data from API
export interface ApiProductSizeData {
  id: string;
  size: string;
  mrp: string;
  price: string;
  status: string;
}

// Transform the API product data to match our app's product interface
export const transformProductData = (apiProduct: ApiProductData): Product => {
  return {
    id: apiProduct.pid,
    name: apiProduct.title,
    category: apiProduct.type || "Classic Flavors",
    description: `Delicious ${apiProduct.title} ice cream`,
    image: apiProduct.image || "/placeholder.svg",
    cover: apiProduct.cover || apiProduct.image,
    sizes: apiProduct.product_data?.map((sizeData: ApiProductSizeData) => ({
      size: sizeData.size,
      price: parseInt(sizeData.price, 10),
      mrp: parseInt(sizeData.mrp, 10)
    })) || [{ size: "Regular", price: 0 }]
  };
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    // Use the proxy to fetch products from the API
    const response = await fetch('/api/getProducts.php');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: ApiResponse<ApiProductData[]> = await response.json();
    console.log("Fetched products from API:", data);
    
    if (data.code === "200" && data.Data) {
      return data.Data.map(transformProductData);
    } else {
      throw new Error(data.msg || "Failed to fetch products");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fall back to sample data in case of any error
    return [
      ...sampleApiResponse.Data.map(transformProductData),
      ...coneCandyApiResponse.Data.map(transformProductData)
    ];
  }
};

// Get cone candy products
export const getConeCandy = async (): Promise<Product[]> => {
  try {
    // Use the proxy to fetch cone candy products
    const response = await fetch('/api/getConeCandy.php');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: ApiResponse<ApiProductData[]> = await response.json();
    console.log("Fetched cone candy products from API:", data);
    
    if (data.code === "200" && data.Data) {
      return data.Data.map(transformProductData);
    } else {
      throw new Error(data.msg || "Failed to fetch cone candy products");
    }
  } catch (error) {
    console.error("Error fetching cone candy products:", error);
    // Fall back to sample data in case of any error
    return coneCandyApiResponse.Data.map(transformProductData);
  }
};

// Cache the categories to avoid recalculating
let cachedCategories: string[] = [];

// Extract unique categories from products
export const getCategories = async (): Promise<string[]> => {
  if (cachedCategories.length > 0) {
    return cachedCategories;
  }
  
  try {
    const products = await getProducts();
    cachedCategories = Array.from(new Set(products.map(product => product.category)));
    return cachedCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
