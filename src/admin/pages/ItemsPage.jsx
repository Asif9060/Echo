import { useState, useEffect } from "react";
import { itemsAPI, categoriesAPI } from "../api.js";

// Helper for empty ratings
const emptyRatings = { story: "", graphics: "", gameplay: "", replayability: "" };

const ItemsPage = () => {
   const [items, setItems] = useState([]);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [formError, setFormError] = useState("");
   const [showModal, setShowModal] = useState(false);
   const [editingItem, setEditingItem] = useState(null);
   const [uploadingImage, setUploadingImage] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("");
   const [view, setView] = useState("grid");
   const [sortBy, setSortBy] = useState("newest");
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      releaseDate: "",
      developer: "",
      platforms: [],
      genres: [],
      keyFeatures: [""],
      storySummary: "",
      highlights: [""],
      authorReview: "",
      screenshots: [],
      soundtrackLinks: [""],
      ratings: { ...emptyRatings },
      characters: [],
      slug: "",
      category: "",
      status: "draft",
   });
   const [screenshotsFiles, setScreenshotsFiles] = useState([]);

   useEffect(() => {
      fetchItems();
      fetchCategories();
   }, []);

   const fetchItems = async () => {
      try {
         setLoading(true);
         const response = await itemsAPI.getAll();
         if (response.success) {
            // The items are nested in response.data.items
            const itemsArray = response.data?.items || [];
            setItems(Array.isArray(itemsArray) ? itemsArray : []);
         } else {
            setError(response.message || "Failed to fetch items");
            setItems([]);
         }
      } catch (err) {
         console.error("Error fetching items:", err);
         setError("An error occurred while fetching items");
         setItems([]);
      } finally {
         setLoading(false);
      }
   };

   const fetchCategories = async () => {
      try {
         const response = await categoriesAPI.getAll();
         if (response.success) {
            // The categories are nested in response.data.categories
            const categoriesArray = response.data?.categories || [];
            setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
         } else {
            setCategories([]);
         }
      } catch (err) {
         console.error("Error fetching categories:", err);
         setCategories([]);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError("");
      setUploadingImage(true);

      try {
         // Upload screenshots if any
         let screenshotsUrls = formData.screenshots;
         if (screenshotsFiles.length > 0) {
            const uploaded = await Promise.all(
               screenshotsFiles.map(async (file) => {
                  const uploadFormData = new FormData();
                  uploadFormData.append("image", file);
                  const response = await fetch("/api/upload", {
                     method: "POST",
                     body: uploadFormData,
                  });
                  const result = await response.json();
                  return result.url;
               })
            );
            screenshotsUrls = [...formData.screenshots, ...uploaded];
         }

         const itemData = {
            ...formData,
            screenshots: screenshotsUrls,
            platforms: formData.platforms.filter(Boolean),
            genres: formData.genres.filter(Boolean),
            keyFeatures: formData.keyFeatures.filter(Boolean),
            highlights: formData.highlights.filter(Boolean),
            soundtrackLinks: formData.soundtrackLinks.filter(Boolean),
         };

         // Only include ratings if they have valid values
         const hasValidRatings =
            formData.ratings &&
            (formData.ratings.story > 0 ||
               formData.ratings.graphics > 0 ||
               formData.ratings.gameplay > 0 ||
               formData.ratings.replayability > 0);

         if (hasValidRatings) {
            itemData.ratings = {
               story: Number(formData.ratings.story) || undefined,
               graphics: Number(formData.ratings.graphics) || undefined,
               gameplay: Number(formData.ratings.gameplay) || undefined,
               replayability: Number(formData.ratings.replayability) || undefined,
            };
            // Remove undefined values
            Object.keys(itemData.ratings).forEach((key) => {
               if (!itemData.ratings[key] || itemData.ratings[key] <= 0) {
                  delete itemData.ratings[key];
               }
            });
            // If no valid ratings, remove the entire ratings object
            if (Object.keys(itemData.ratings).length === 0) {
               itemData.ratings = null;
            }
         } else {
            itemData.ratings = null; // Explicitly clear ratings
         }

         let response;
         if (editingItem) {
            response = await itemsAPI.update(editingItem._id, itemData);
         } else {
            response = await itemsAPI.create(itemData);
         }

         if (response.success) {
            await fetchItems();
            resetForm();
            alert(
               editingItem ? "Item updated successfully!" : "Item created successfully!"
            );
         } else {
            setFormError(response.message || "Failed to save item");
         }
      } catch (err) {
         console.error("Error saving item:", err);
         setFormError("An error occurred while saving the item");
      } finally {
         setUploadingImage(false);
      }
   };

   const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
         try {
            const response = await itemsAPI.delete(id);
            if (response.success) {
               await fetchItems();
               alert("Item deleted successfully!");
            } else {
               alert(response.message || "Failed to delete item");
            }
         } catch (err) {
            console.error("Error deleting item:", err);
            alert("An error occurred while deleting the item");
         }
      }
   };

   const handleEdit = (item) => {
      setEditingItem(item);
      setFormData({
         title: item.title || "",
         description: item.description || "",
         releaseDate: item.releaseDate ? item.releaseDate.slice(0, 10) : "",
         developer: item.developer || "",
         platforms: item.platforms || [],
         genres: item.genres || [],
         keyFeatures:
            item.keyFeatures && item.keyFeatures.length ? item.keyFeatures : [""],
         storySummary: item.storySummary || "",
         highlights: item.highlights && item.highlights.length ? item.highlights : [""],
         authorReview: item.authorReview || "",
         screenshots: item.screenshots || [],
         soundtrackLinks:
            item.soundtrackLinks && item.soundtrackLinks.length
               ? item.soundtrackLinks
               : [""],
         ratings: item.ratings || { ...emptyRatings },
         characters: item.characters || [],
         slug: item.slug || "",
         category: item.category._id || item.category,
         status: item.status,
      });
      setScreenshotsFiles([]);
      setShowModal(true);
      setFormError("");
   };

   const resetForm = () => {
      setFormData({
         title: "",
         description: "",
         releaseDate: "",
         developer: "",
         platforms: [],
         genres: [],
         keyFeatures: [""],
         storySummary: "",
         highlights: [""],
         authorReview: "",
         screenshots: [],
         soundtrackLinks: [""],
         ratings: { ...emptyRatings },
         characters: [],
         slug: "",
         category: "",
         status: "draft",
      });
      setScreenshotsFiles([]);
      setEditingItem(null);
      setShowModal(false);
      setFormError("");
   };

   // Filter and sort items
   const filteredItems = (Array.isArray(items) ? items : [])
      .filter((item) => {
         // Ensure item exists
         if (!item) {
            return false;
         }

         const matchesSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
         const matchesCategory =
            !selectedCategory ||
            (item.category && item.category._id === selectedCategory);

         return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
         switch (sortBy) {
            case "newest":
               return new Date(b.createdAt) - new Date(a.createdAt);
            case "oldest":
               return new Date(a.createdAt) - new Date(b.createdAt);
            case "title":
               return a.title.localeCompare(b.title);
            case "rating": {
               const avgA = a.ratings
                  ? (a.ratings.story +
                       a.ratings.graphics +
                       a.ratings.gameplay +
                       a.ratings.replayability) /
                    4
                  : 0;
               const avgB = b.ratings
                  ? (b.ratings.story +
                       b.ratings.graphics +
                       b.ratings.gameplay +
                       b.ratings.replayability) /
                    4
                  : 0;
               return avgB - avgA;
            }
            default:
               return 0;
         }
      });

   if (loading) {
      return (
         <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
               <div className="w-12 h-12 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-gray-400 animate-pulse">Loading items...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
         <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Modern Header Section */}
            <div className="mb-10">
               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                  <div className="mb-6 lg:mb-0">
                     <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                        Items Management
                     </h1>
                     <p className="text-lg text-gray-400 max-w-md">
                        Create, edit, and manage your entertainment content with style
                     </p>
                  </div>

                  <button
                     onClick={() => {
                        setFormError("");
                        setShowModal(true);
                     }}
                     className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-3">
                     <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-180 transition-transform duration-300">
                           <span className="text-lg">✨</span>
                        </div>
                        <span className="font-semibold text-lg">Create Item</span>
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </button>
               </div>

               {/* Advanced Filters & Controls */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                  {/* Search Bar */}
                  <div className="lg:col-span-5">
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                           </svg>
                        </div>
                        <input
                           type="text"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           placeholder="Search items by title or description..."
                           className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/10"
                        />
                     </div>
                  </div>

                  {/* Category Filter */}
                  <div className="lg:col-span-3">
                     <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/10">
                        <option value="" className="bg-slate-800">
                           All Categories
                        </option>
                        {(Array.isArray(categories) ? categories : []).map((category) => (
                           <option
                              key={category._id}
                              value={category._id}
                              className="bg-slate-800">
                              {category.name}
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* Sort Options */}
                  <div className="lg:col-span-2">
                     <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/10">
                        <option value="newest" className="bg-slate-800">
                           Newest First
                        </option>
                        <option value="oldest" className="bg-slate-800">
                           Oldest First
                        </option>
                        <option value="title" className="bg-slate-800">
                           A-Z
                        </option>
                        <option value="rating" className="bg-slate-800">
                           Highest Rated
                        </option>
                     </select>
                  </div>

                  {/* View Toggle */}
                  <div className="lg:col-span-2">
                     <div className="flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-1">
                        <button
                           onClick={() => setView("grid")}
                           className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 ${
                              view === "grid"
                                 ? "bg-purple-600 text-white shadow-lg"
                                 : "text-gray-400 hover:text-white hover:bg-white/10"
                           }`}>
                           <svg
                              className="w-5 h-5 mx-auto"
                              fill="currentColor"
                              viewBox="0 0 20 20">
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                           </svg>
                        </button>
                        <button
                           onClick={() => setView("list")}
                           className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 ${
                              view === "list"
                                 ? "bg-purple-600 text-white shadow-lg"
                                 : "text-gray-400 hover:text-white hover:bg-white/10"
                           }`}>
                           <svg
                              className="w-5 h-5 mx-auto"
                              fill="currentColor"
                              viewBox="0 0 20 20">
                              <path
                                 fillRule="evenodd"
                                 d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        </button>
                     </div>
                  </div>
               </div>

               {/* Stats Bar */}
               <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <div className="flex items-center space-x-6">
                     <div className="text-center">
                        <p className="text-2xl font-bold text-white">
                           {filteredItems.length}
                        </p>
                        <p className="text-sm text-gray-400">Total Items</p>
                     </div>
                     <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">
                           {
                              filteredItems.filter((item) => item.status === "active")
                                 .length
                           }
                        </p>
                        <p className="text-sm text-gray-400">Active</p>
                     </div>
                     <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">
                           {
                              filteredItems.filter((item) => item.status === "draft")
                                 .length
                           }
                        </p>
                        <p className="text-sm text-gray-400">Drafts</p>
                     </div>
                  </div>

                  {searchTerm && (
                     <div className="flex items-center space-x-2 text-purple-400">
                        <span>Searching for: "{searchTerm}"</span>
                        <button
                           onClick={() => setSearchTerm("")}
                           className="text-gray-400 hover:text-white transition-colors">
                           ✕
                        </button>
                     </div>
                  )}
               </div>
            </div>

            {error && (
               <div className="mb-8 p-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl">
                  <div className="flex items-center space-x-3">
                     <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">!</span>
                     </div>
                     <p className="text-red-400 font-medium">Error: {error}</p>
                  </div>
               </div>
            )}

            {/* Items Display */}
            {view === "grid" ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredItems.map((item, index) => (
                     <div
                        key={item._id}
                        className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                        style={{
                           animationDelay: `${index * 100}ms`,
                           animation: "fadeInUp 0.6s ease-out forwards",
                        }}>
                        {/* Image Section */}
                        <div className="relative h-56 overflow-hidden">
                           {item.screenshots && item.screenshots.length > 0 ? (
                              <div className="relative w-full h-full">
                                 <img
                                    src={item.screenshots[0]}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                 {item.screenshots.length > 1 && (
                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                       +{item.screenshots.length - 1} more
                                    </div>
                                 )}
                              </div>
                           ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                                 <div className="text-6xl opacity-40">🎮</div>
                              </div>
                           )}

                           {/* Status Badge */}
                           <div className="absolute top-4 left-4">
                              <span
                                 className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                                    item.status === "active"
                                       ? "bg-green-500/80 text-green-100"
                                       : item.status === "draft"
                                       ? "bg-yellow-500/80 text-yellow-100"
                                       : "bg-gray-500/80 text-gray-100"
                                 }`}>
                                 {item.status.charAt(0).toUpperCase() +
                                    item.status.slice(1)}
                              </span>
                           </div>

                           {/* Rating Badge */}
                           {item.ratings && (
                              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                                 ⭐{" "}
                                 {(
                                    (item.ratings.story +
                                       item.ratings.graphics +
                                       item.ratings.gameplay +
                                       item.ratings.replayability) /
                                    4
                                 ).toFixed(1)}
                              </div>
                           )}
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                           <div className="mb-4">
                              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                                 {item.title}
                              </h3>
                              <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                                 {item.description}
                              </p>
                           </div>

                           {/* Metadata */}
                           <div className="space-y-3 mb-6">
                              <div className="flex items-center text-xs text-gray-400">
                                 <span className="font-medium text-purple-400">
                                    Developer:
                                 </span>
                                 <span className="ml-2">{item.developer}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-400">
                                 <span className="font-medium text-purple-400">
                                    Released:
                                 </span>
                                 <span className="ml-2">
                                    {item.releaseDate
                                       ? new Date(item.releaseDate).toLocaleDateString()
                                       : "TBA"}
                                 </span>
                              </div>
                           </div>

                           {/* Tags */}
                           <div className="flex flex-wrap gap-2 mb-6">
                              {item.platforms?.slice(0, 2).map((platform, i) => (
                                 <span
                                    key={i}
                                    className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-lg border border-blue-500/30">
                                    {platform}
                                 </span>
                              ))}
                              {item.genres?.slice(0, 2).map((genre, i) => (
                                 <span
                                    key={i}
                                    className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-lg border border-purple-500/30">
                                    {genre}
                                 </span>
                              ))}
                              {(item.platforms?.length > 2 ||
                                 item.genres?.length > 2) && (
                                 <span className="text-gray-400 text-xs px-2 py-1">
                                    +
                                    {(item.platforms?.length || 0) +
                                       (item.genres?.length || 0) -
                                       4}{" "}
                                    more
                                 </span>
                              )}
                           </div>

                           {/* Action Buttons */}
                           <div className="flex items-center justify-between">
                              <button
                                 onClick={() => handleEdit(item)}
                                 className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 border border-blue-500/30">
                                 <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                 </svg>
                                 <span className="text-sm font-medium">Edit</span>
                              </button>
                              <button
                                 onClick={() => handleDelete(item._id)}
                                 className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 border border-red-500/30">
                                 <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                 </svg>
                                 <span className="text-sm font-medium">Delete</span>
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               /* List View */
               <div className="space-y-4">
                  {filteredItems.map((item, index) => (
                     <div
                        key={item._id}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                        style={{
                           animationDelay: `${index * 50}ms`,
                           animation: "fadeInUp 0.4s ease-out forwards",
                        }}>
                        <div className="flex items-center space-x-6">
                           <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                              {item.screenshots && item.screenshots.length > 0 ? (
                                 <img
                                    src={item.screenshots[0]}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                 />
                              ) : (
                                 <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                                    <span className="text-2xl opacity-40">🎮</span>
                                 </div>
                              )}
                           </div>

                           <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                 <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-white mb-1 truncate">
                                       {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                                       {item.description}
                                    </p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                                       <span>{item.developer}</span>
                                       <span>•</span>
                                       <span>
                                          {item.releaseDate
                                             ? new Date(
                                                  item.releaseDate
                                               ).toLocaleDateString()
                                             : "TBA"}
                                       </span>
                                       {item.ratings && (
                                          <>
                                             <span>•</span>
                                             <span className="text-yellow-400">
                                                ⭐{" "}
                                                {(
                                                   (item.ratings.story +
                                                      item.ratings.graphics +
                                                      item.ratings.gameplay +
                                                      item.ratings.replayability) /
                                                   4
                                                ).toFixed(1)}
                                             </span>
                                          </>
                                       )}
                                    </div>
                                 </div>

                                 <div className="flex items-center space-x-3 ml-4">
                                    <span
                                       className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          item.status === "active"
                                             ? "bg-green-500/20 text-green-400"
                                             : item.status === "draft"
                                             ? "bg-yellow-500/20 text-yellow-400"
                                             : "bg-gray-500/20 text-gray-400"
                                       }`}>
                                       {item.status}
                                    </span>
                                    <button
                                       onClick={() => handleEdit(item)}
                                       className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/20 transition-all">
                                       <svg
                                          className="w-5 h-5"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24">
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                          />
                                       </svg>
                                    </button>
                                    <button
                                       onClick={() => handleDelete(item._id)}
                                       className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-all">
                                       <svg
                                          className="w-5 h-5"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24">
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                       </svg>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {/* Empty State */}
            {filteredItems.length === 0 && !loading && (
               <div className="text-center py-20">
                  <div className="relative">
                     <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center">
                        <div className="text-6xl opacity-40">🎮</div>
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-4">
                        {searchTerm || selectedCategory
                           ? "No items found"
                           : "No items yet"}
                     </h3>
                     <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        {searchTerm || selectedCategory
                           ? "Try adjusting your search or filter criteria to find what you're looking for."
                           : "Create your first item to get started with your entertainment content management."}
                     </p>
                     {!searchTerm && !selectedCategory && (
                        <button
                           onClick={() => {
                              setFormError("");
                              setShowModal(true);
                           }}
                           className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                           Create Your First Item
                        </button>
                     )}
                  </div>
               </div>
            )}

            {/* Simplified Modern Modal */}
            {showModal && (
               <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                     {/* Modal Header */}
                     <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 px-8 py-6">
                        <div className="flex items-center justify-between">
                           <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                              {editingItem ? "Edit Item" : "Create New Item"}
                           </h2>
                           <button
                              onClick={resetForm}
                              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200">
                              <span className="text-gray-400 text-xl">✕</span>
                           </button>
                        </div>
                        {formError && (
                           <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                              <p className="text-red-400 text-sm">{formError}</p>
                           </div>
                        )}
                     </div>

                     {/* Modal Content */}
                     <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                        <form onSubmit={handleSubmit} className="space-y-8">
                           {/* Basic Information */}
                           <div className="space-y-6">
                              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                                 Basic Information
                              </h3>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                       Title
                                    </label>
                                    <input
                                       type="text"
                                       value={formData.title}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             title: e.target.value,
                                          })
                                       }
                                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                       placeholder="Enter item title..."
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                       Category *
                                    </label>
                                    <select
                                       value={formData.category}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             category: e.target.value,
                                          })
                                       }
                                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                       required>
                                       <option value="" className="bg-slate-800">
                                          Select Category
                                       </option>
                                       {(Array.isArray(categories) ? categories : []).map(
                                          (category) => (
                                             <option
                                                key={category._id}
                                                value={category._id}
                                                className="bg-slate-800">
                                                {category.name}
                                             </option>
                                          )
                                       )}
                                    </select>
                                 </div>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Description
                                 </label>
                                 <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                       setFormData({
                                          ...formData,
                                          description: e.target.value,
                                       })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows={4}
                                    placeholder="Describe your item..."
                                 />
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                       Release Date
                                    </label>
                                    <input
                                       type="date"
                                       value={formData.releaseDate}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             releaseDate: e.target.value,
                                          })
                                       }
                                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                       Developer
                                    </label>
                                    <input
                                       type="text"
                                       value={formData.developer}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             developer: e.target.value,
                                          })
                                       }
                                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                       placeholder="Enter developer name..."
                                    />
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                       Platforms
                                    </label>
                                    <input
                                       type="text"
                                       value={formData.platforms.join(", ")}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             platforms: e.target.value
                                                .split(",")
                                                .map((s) => s.trim())
                                                .filter(Boolean),
                                          })
                                       }
                                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                       placeholder="e.g. PC, PS5, Xbox"
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                       Genres
                                    </label>
                                    <input
                                       type="text"
                                       value={formData.genres.join(", ")}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             genres: e.target.value
                                                .split(",")
                                                .map((s) => s.trim())
                                                .filter(Boolean),
                                          })
                                       }
                                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                       placeholder="e.g. Action, RPG"
                                    />
                                 </div>
                              </div>
                           </div>

                           {/* Additional Content */}
                           <div className="space-y-6">
                              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                                 Additional Content
                              </h3>

                              <div>
                                 <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Story Summary
                                 </label>
                                 <textarea
                                    value={formData.storySummary}
                                    onChange={(e) =>
                                       setFormData({
                                          ...formData,
                                          storySummary: e.target.value,
                                       })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows={3}
                                    placeholder="Brief story summary..."
                                 />
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Author Review
                                 </label>
                                 <textarea
                                    value={formData.authorReview}
                                    onChange={(e) =>
                                       setFormData({
                                          ...formData,
                                          authorReview: e.target.value,
                                       })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows={3}
                                    placeholder="Your review of this item..."
                                 />
                              </div>
                           </div>

                           {/* Media & Links */}
                           <div className="space-y-6">
                              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                                 Media & Links
                              </h3>

                              <div>
                                 <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Screenshots
                                 </label>
                                 <div className="space-y-4">
                                    {formData.screenshots.length > 0 && (
                                       <div className="flex flex-wrap gap-4">
                                          {formData.screenshots.map((url, idx) => (
                                             <div key={idx} className="relative group">
                                                <img
                                                   src={url}
                                                   alt={`Screenshot ${idx + 1}`}
                                                   className="w-24 h-24 object-cover rounded-xl border border-white/10"
                                                />
                                                <button
                                                   type="button"
                                                   onClick={() =>
                                                      setFormData({
                                                         ...formData,
                                                         screenshots:
                                                            formData.screenshots.filter(
                                                               (_, i) => i !== idx
                                                            ),
                                                      })
                                                   }
                                                   className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                                                   ✕
                                                </button>
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                    <div className="relative">
                                       <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={(e) =>
                                             setScreenshotsFiles(
                                                Array.from(e.target.files)
                                             )
                                          }
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                       />
                                       <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-colors">
                                          <div className="text-4xl mb-4 opacity-50">
                                             📷
                                          </div>
                                          <p className="text-gray-300 mb-2">
                                             Upload screenshots
                                          </p>
                                          <p className="text-gray-500 text-sm">
                                             JPG, PNG, GIF, WebP (max 5MB each)
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Ratings */}
                           <div className="space-y-6">
                              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                                 Ratings (1-5 scale)
                              </h3>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                 {Object.entries(formData.ratings).map(([key, value]) => (
                                    <div key={key}>
                                       <label className="block text-sm font-medium text-gray-300 mb-3 capitalize">
                                          {key}
                                       </label>
                                       <input
                                          type="number"
                                          min="1"
                                          max="5"
                                          step="0.1"
                                          value={value}
                                          onChange={(e) =>
                                             setFormData({
                                                ...formData,
                                                ratings: {
                                                   ...formData.ratings,
                                                   [key]: e.target.value,
                                                },
                                             })
                                          }
                                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                       />
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* Characters */}
                           <div className="space-y-6">
                              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                                 Characters
                              </h3>
                              <div className="space-y-4">
                                 {formData.characters.map((character, index) => (
                                    <div
                                       key={index}
                                       className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div>
                                             <label className="block text-sm font-medium text-gray-300 mb-3">
                                                Character Name *
                                             </label>
                                             <input
                                                type="text"
                                                value={character.name || ""}
                                                onChange={(e) => {
                                                   const newCharacters = [
                                                      ...formData.characters,
                                                   ];
                                                   newCharacters[index] = {
                                                      ...newCharacters[index],
                                                      name: e.target.value,
                                                   };
                                                   setFormData({
                                                      ...formData,
                                                      characters: newCharacters,
                                                   });
                                                }}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Character name"
                                             />
                                          </div>
                                          <div>
                                             <label className="block text-sm font-medium text-gray-300 mb-3">
                                                Character Image URL *
                                             </label>
                                             <input
                                                type="url"
                                                value={character.image || ""}
                                                onChange={(e) => {
                                                   const newCharacters = [
                                                      ...formData.characters,
                                                   ];
                                                   newCharacters[index] = {
                                                      ...newCharacters[index],
                                                      image: e.target.value,
                                                   };
                                                   setFormData({
                                                      ...formData,
                                                      characters: newCharacters,
                                                   });
                                                }}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                placeholder="https://..."
                                             />
                                          </div>
                                       </div>
                                       <div className="mt-4">
                                          <label className="block text-sm font-medium text-gray-300 mb-3">
                                             Character Description *
                                          </label>
                                          <textarea
                                             value={character.description || ""}
                                             onChange={(e) => {
                                                const newCharacters = [
                                                   ...formData.characters,
                                                ];
                                                newCharacters[index] = {
                                                   ...newCharacters[index],
                                                   description: e.target.value,
                                                };
                                                setFormData({
                                                   ...formData,
                                                   characters: newCharacters,
                                                });
                                             }}
                                             rows={3}
                                             maxLength={300}
                                             className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                             placeholder="Brief character description (max 300 characters)"
                                          />
                                          <p className="text-xs text-gray-400 mt-2">
                                             {character.description?.length || 0}/300
                                             characters
                                          </p>
                                       </div>
                                       <div className="flex justify-end mt-4">
                                          <button
                                             type="button"
                                             onClick={() => {
                                                const newCharacters =
                                                   formData.characters.filter(
                                                      (_, i) => i !== index
                                                   );
                                                setFormData({
                                                   ...formData,
                                                   characters: newCharacters,
                                                });
                                             }}
                                             className="text-red-400 hover:text-red-300 flex items-center space-x-2 transition-colors duration-200">
                                             <span>🗑️</span>
                                             <span>Remove Character</span>
                                          </button>
                                       </div>
                                    </div>
                                 ))}
                                 <button
                                    type="button"
                                    onClick={() => {
                                       setFormData({
                                          ...formData,
                                          characters: [
                                             ...formData.characters,
                                             { name: "", image: "", description: "" },
                                          ],
                                       });
                                    }}
                                    className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-white hover:border-purple-500 hover:bg-white/5 transition-all duration-200 flex items-center justify-center space-x-3">
                                    <span className="text-2xl">➕</span>
                                    <span>Add Character</span>
                                 </button>
                              </div>
                           </div>

                           {/* Status */}
                           <div className="space-y-6">
                              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                                 Publication Settings
                              </h3>
                              <div>
                                 <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Status
                                 </label>
                                 <select
                                    value={formData.status}
                                    onChange={(e) =>
                                       setFormData({
                                          ...formData,
                                          status: e.target.value,
                                       })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                                    <option value="draft" className="bg-slate-800">
                                       Draft
                                    </option>
                                    <option value="active" className="bg-slate-800">
                                       Active
                                    </option>
                                    <option value="inactive" className="bg-slate-800">
                                       Inactive
                                    </option>
                                 </select>
                              </div>
                           </div>

                           {/* Form submission buttons */}
                           <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 px-8 py-6 -mx-8 -mb-8">
                              <div className="flex justify-end space-x-4">
                                 <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-200"
                                    disabled={uploadingImage}>
                                    Cancel
                                 </button>
                                 <button
                                    type="submit"
                                    disabled={uploadingImage}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-2xl transition-all duration-200 flex items-center space-x-3 disabled:cursor-not-allowed">
                                    {uploadingImage ? (
                                       <>
                                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                          <span>Uploading...</span>
                                       </>
                                    ) : (
                                       <>
                                          <span>
                                             {editingItem ? "Update Item" : "Create Item"}
                                          </span>
                                          <svg
                                             className="w-5 h-5"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24">
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                             />
                                          </svg>
                                       </>
                                    )}
                                 </button>
                              </div>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            )}

            {/* Add CSS-in-JS for animations */}
            <style jsx>{`
               @keyframes fadeInUp {
                  from {
                     opacity: 0;
                     transform: translateY(30px);
                  }
                  to {
                     opacity: 1;
                     transform: translateY(0);
                  }
               }

               .line-clamp-1 {
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
               }

               .line-clamp-2 {
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
               }
            `}</style>
         </div>
      </div>
   );
};

export default ItemsPage;
