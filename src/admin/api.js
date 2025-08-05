import { useState } from "react";

const API_BASE_URL = "https://echo-server-alhh.onrender.com/api";

// Categories API functions
export const categoriesAPI = {
   getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/categories?${queryString}`);
      return response.json();
   },

   getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      return response.json();
   },

   create: async (categoryData) => {
      const response = await fetch(`${API_BASE_URL}/categories`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(categoryData),
      });
      return response.json();
   },

   update: async (id, categoryData) => {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(categoryData),
      });
      return response.json();
   },

   delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
         method: "DELETE",
      });
      return response.json();
   },

   getStats: async () => {
      const response = await fetch(`${API_BASE_URL}/categories/stats`);
      return response.json();
   },
};

// Items API functions
export const itemsAPI = {
   getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/items?${queryString}`);
      return response.json();
   },

   getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/items/${id}`);
      return response.json();
   },

   create: async (itemData) => {
      const response = await fetch(`${API_BASE_URL}/items`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(itemData),
      });
      return response.json();
   },

   update: async (id, itemData) => {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(itemData),
      });
      return response.json();
   },

   delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
         method: "DELETE",
      });
      return response.json();
   },

   bulkDelete: async (ids) => {
      const response = await fetch(`${API_BASE_URL}/items`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ ids }),
      });
      return response.json();
   },

   updateStatus: async (id, status) => {
      const response = await fetch(`${API_BASE_URL}/items/${id}/status`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ status }),
      });
      return response.json();
   },

   getStats: async () => {
      const response = await fetch(`${API_BASE_URL}/items/stats`);
      return response.json();
   },

   uploadImage: async (imageFile) => {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_BASE_URL}/items/upload-image`, {
         method: "POST",
         body: formData,
      });
      return response.json();
   },
};

// Custom hook for API calls with loading states
export const useAPI = () => {
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
