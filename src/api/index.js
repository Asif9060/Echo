import { useState } from "react";

// API configuration for main frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://echo-server-alhh.onrender.com/api";

// Frontend API functions for public data
export const frontendAPI = {
   // Get all active categories for public display
   getCategories: async () => {
      try {
         const response = await fetch(`${API_BASE_URL}/categories?status=active`);
         const data = await response.json();
         return data;
      } catch (error) {
         console.error("Error fetching categories:", error);
         return { success: false, message: "Failed to fetch categories" };
      }
   },

   // Get all items for a specific category
   getItemsByCategory: async (categoryId, params = {}) => {
      try {
         const queryParams = new URLSearchParams({
            category: categoryId,
            status: "active", // Only get active items for public
            ...params,
         });
         const response = await fetch(`${API_BASE_URL}/items?${queryParams}`);
         const data = await response.json();
         return data;
      } catch (error) {
         console.error("Error fetching items:", error);
         return { success: false, message: "Failed to fetch items" };
      }
   },

   // Get featured items
   getFeaturedItems: async (limit = 10) => {
      try {
         const response = await fetch(
            `${API_BASE_URL}/items?featured=true&status=active&limit=${limit}`
         );
         const data = await response.json();
         return data;
      } catch (error) {
         console.error("Error fetching featured items:", error);
         return { success: false, message: "Failed to fetch featured items" };
      }
   },

   // Get single item by ID
   getItem: async (id) => {
      try {
         const response = await fetch(`${API_BASE_URL}/items/${id}`);
         const data = await response.json();
         return data;
      } catch (error) {
         console.error("Error fetching item:", error);
         return { success: false, message: "Failed to fetch item" };
      }
   },

   // Search items
   searchItems: async (query, params = {}) => {
      try {
         const queryParams = new URLSearchParams({
            search: query,
            status: "active",
            ...params,
         });
         const response = await fetch(`${API_BASE_URL}/items?${queryParams}`);
         const data = await response.json();
         return data;
      } catch (error) {
         console.error("Error searching items:", error);
         return { success: false, message: "Failed to search items" };
      }
   },
};

// Custom hook for managing API state
export const useFrontendAPI = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const callAPI = async (apiFunction) => {
      setLoading(true);
      setError(null);
      try {
         const result = await apiFunction();
         if (!result.success) {
            throw new Error(result.message || "API call failed");
         }
         return result;
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
         setError(errorMessage);
         throw err;
      } finally {
         setLoading(false);
      }
   };

   return { loading, error, callAPI };
};
