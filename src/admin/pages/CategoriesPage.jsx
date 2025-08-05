import { useState, useEffect } from "react";
import { categoriesAPI, useAPI } from "../api.js";

const CategoriesPage = () => {
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [showModal, setShowModal] = useState(false);
   const [editingCategory, setEditingCategory] = useState(null);
   const [formData, setFormData] = useState({
      name: "",
      description: "",
      icon: "folder",
      gradient: "from-blue-500 to-purple-600",
      status: "active",
   });

   const { loading: apiLoading, error: apiError, callAPI } = useAPI();

   const getIconSVG = (iconId) => {
      const icon = iconOptions.find((icon) => icon.id === iconId);
      return icon ? icon.svg : iconOptions[0].svg; // Default to folder icon
   };

   useEffect(() => {
      fetchCategories();
   }, []);

   const fetchCategories = async () => {
      try {
         setLoading(true);
         const response = await categoriesAPI.getAll();
         if (response.success) {
            setCategories(response.data.categories || []);
         } else {
            setError(response.message || "Failed to fetch categories");
         }
      } catch (err) {
         setError("Failed to fetch categories");
         console.error("Error fetching categories:", err);
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         let response;
         if (editingCategory) {
            response = await categoriesAPI.update(editingCategory._id, formData);
            if (response.success) {
               await fetchCategories(); // Refresh the categories list
               resetForm();
               alert("Category updated successfully!");
            } else {
               alert(response.message || "Failed to update category");
            }
         } else {
            response = await categoriesAPI.create(formData);
            if (response.success) {
               await fetchCategories(); // Refresh the categories list
               resetForm();
               alert("Category created successfully!");
            } else {
               alert(response.message || "Failed to create category");
            }
         }
      } catch (err) {
         console.error("Error saving category:", err);
         alert("An error occurred while saving the category");
      }
   };

   const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this category?")) {
         try {
            const response = await categoriesAPI.delete(id);
            if (response.success) {
               await fetchCategories(); // Refresh the categories list
               alert("Category deleted successfully!");
            } else {
               alert(response.message || "Failed to delete category");
            }
         } catch (err) {
            console.error("Error deleting category:", err);
            alert("An error occurred while deleting the category");
         }
      }
   };

   const handleEdit = (category) => {
      setEditingCategory(category);
      setFormData({
         name: category.name,
         description: category.description,
         icon: category.icon || "",
         gradient: category.gradient || "from-blue-500 to-purple-600",
         status: category.status,
      });
      setShowModal(true);
   };

   const resetForm = () => {
      setFormData({
         name: "",
         description: "",
         icon: "folder",
         gradient: "from-blue-500 to-purple-600",
         status: "active",
      });
      setEditingCategory(null);
      setShowModal(false);
   };

   const gradientOptions = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-blue-600",
      "from-purple-500 to-pink-600",
      "from-yellow-500 to-red-600",
      "from-indigo-500 to-purple-600",
      "from-pink-500 to-rose-600",
   ];

   const iconOptions = [
      {
         id: "folder",
         name: "Folder",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
            </svg>
         ),
      },
      {
         id: "film",
         name: "Movies",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
            </svg>
         ),
      },
      {
         id: "tv",
         name: "TV Series",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5l-1 1v2h8v-2l-1-1h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z" />
            </svg>
         ),
      },
      {
         id: "gamepad",
         name: "Games",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M15.5 6.5C15.5 5.66 14.84 5 14 5S12.5 5.66 12.5 6.5 13.16 8 14 8s1.5-.66 1.5-1.5zM19.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM18 13.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM16.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM17 14.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
               <path d="M7.5 2C4.46 2 2 4.46 2 7.5v9C2 19.54 4.46 22 7.5 22h9c3.04 0 5.5-2.46 5.5-5.5v-9C22 4.46 19.54 2 16.5 2h-9z" />
            </svg>
         ),
      },
      {
         id: "anime",
         name: "Anime",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
               />
               <circle cx="9" cy="10" r="1.5" />
               <circle cx="15" cy="10" r="1.5" />
               <path
                  d="M8 16s1.5 2 4 2 4-2 4-2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
               />
               <path
                  d="M6 8s2-4 6-4 6 4 6 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
               />
            </svg>
         ),
      },
      {
         id: "music",
         name: "Music",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
         ),
      },
      {
         id: "book",
         name: "Books",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
            </svg>
         ),
      },
      {
         id: "star",
         name: "Featured",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
         ),
      },
      {
         id: "heart",
         name: "Favorites",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
         ),
      },
      {
         id: "globe",
         name: "General",
         svg: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
            </svg>
         ),
      },
   ];

   if (loading) {
      return (
         <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
               <p className="text-gray-400">Manage your entertainment categories</p>
            </div>
            <button
               onClick={() => setShowModal(true)}
               className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2">
               <span>➕</span>
               <span>Add Category</span>
            </button>
         </div>

         {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
               <p className="text-red-400">Error: {error}</p>
            </div>
         )}

         {/* Categories Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
               <div
                  key={category._id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-all duration-200">
                  <div
                     className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-lg flex items-center justify-center mb-4`}>
                     <div className="text-white">{getIconSVG(category.icon)}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                     {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                     {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                     <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                           category.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}>
                        {category.status}
                     </span>
                     <div className="flex items-center space-x-2">
                        <button
                           onClick={() => handleEdit(category)}
                           className="text-blue-400 hover:text-blue-300 text-sm">
                           Edit
                        </button>
                        <button
                           onClick={() => handleDelete(category._id)}
                           className="text-red-400 hover:text-red-300 text-sm">
                           Delete
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {categories.length === 0 && !loading && (
            <div className="text-center py-12">
               <div className="text-6xl mb-4">📁</div>
               <h3 className="text-xl font-semibold text-white mb-2">
                  No categories yet
               </h3>
               <p className="text-gray-400 mb-6">
                  Create your first category to get started
               </p>
               <button
                  onClick={() => setShowModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                  Add Category
               </button>
            </div>
         )}

         {/* Modal */}
         {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
               <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
                  <h2 className="text-xl font-semibold text-white mb-4">
                     {editingCategory ? "Edit Category" : "Add Category"}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                           Name
                        </label>
                        <input
                           type="text"
                           value={formData.name}
                           onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                           }
                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                           Description
                        </label>
                        <textarea
                           value={formData.description}
                           onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                           }
                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           rows={3}
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                           Icon
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                           {iconOptions.map((icon) => (
                              <button
                                 key={icon.id}
                                 type="button"
                                 onClick={() =>
                                    setFormData({ ...formData, icon: icon.id })
                                 }
                                 className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-1 ${
                                    formData.icon === icon.id
                                       ? "border-purple-500 bg-purple-500/20 text-purple-400"
                                       : "border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500 hover:bg-slate-600"
                                 }`}
                                 title={icon.name}>
                                 <div className="text-purple-400">{icon.svg}</div>
                                 <span className="text-xs text-center">{icon.name}</span>
                              </button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                           Gradient
                        </label>
                        <select
                           value={formData.gradient}
                           onChange={(e) =>
                              setFormData({ ...formData, gradient: e.target.value })
                           }
                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                           {gradientOptions.map((gradient) => (
                              <option key={gradient} value={gradient}>
                                 {gradient
                                    .replace(/from-|to-|-\d+/g, "")
                                    .replace(/-/g, " ")}
                              </option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                           Status
                        </label>
                        <select
                           value={formData.status}
                           onChange={(e) =>
                              setFormData({ ...formData, status: e.target.value })
                           }
                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                           <option value="active">Active</option>
                           <option value="inactive">Inactive</option>
                        </select>
                     </div>

                     <div className="flex justify-end space-x-3 pt-4">
                        <button
                           type="button"
                           onClick={resetForm}
                           className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200">
                           Cancel
                        </button>
                        <button
                           type="submit"
                           disabled={apiLoading}
                           className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50">
                           {apiLoading
                              ? "Saving..."
                              : editingCategory
                              ? "Update"
                              : "Create"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default CategoriesPage;
