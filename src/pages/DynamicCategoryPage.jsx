import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { frontendAPI } from "../api/index.js";
import Breadcrumb from "../components/Breadcrumb";
import { getIcon, isSVGIcon } from "../utils/icons.jsx";

const DynamicCategoryPage = () => {
   const { categorySlug } = useParams();
   const navigate = useNavigate();
   const [category, setCategory] = useState(null);
   const [items, setItems] = useState([]);
   const [filteredItems, setFilteredItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [isLoaded, setIsLoaded] = useState(false);
   const [ratingFilter, setRatingFilter] = useState({
      value: 0,
      enabled: false,
   });
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

   useEffect(() => {
      const fetchCategoryAndItems = async () => {
         try {
            setLoading(true);
            setError(null);

            // Fetch all categories first to find the one with matching slug
            const categoriesResponse = await frontendAPI.getCategories();
            if (!categoriesResponse.success) {
               throw new Error("Failed to fetch categories");
            }

            const foundCategory = categoriesResponse.data.categories.find(
               (cat) => cat.slug === categorySlug
            );

            if (!foundCategory) {
               setError("Category not found");
               return;
            }

            setCategory(foundCategory);

            // Fetch items for this category
            const itemsResponse = await frontendAPI.getItemsByCategory(foundCategory._id);
            if (itemsResponse.success) {
               const itemsData = itemsResponse.data.items || [];
               setItems(itemsData);
               setFilteredItems(itemsData);
            } else {
               console.error("Failed to fetch items:", itemsResponse.message);
               setItems([]);
               setFilteredItems([]);
            }
         } catch (err) {
            console.error("Error fetching category data:", err);
            setError(err.message || "Failed to load category");
         } finally {
            setLoading(false);
            setTimeout(() => setIsLoaded(true), 100);
         }
      };

      if (categorySlug) {
         fetchCategoryAndItems();
      }
   }, [categorySlug]);

   // helper: compute displayed rating (prefer overall, else average per-aspect)
   const getDisplayedRating = (obj) => {
      if (!obj) return null;
      if (typeof obj.rating === "number" && !Number.isNaN(obj.rating)) return obj.rating;
      if (obj.ratings) {
         const {
            story = 0,
            graphics = 0,
            gameplay = 0,
            replayability = 0,
         } = obj.ratings || {};
         return (story + graphics + gameplay + replayability) / 4;
      }
      return null;
   };

   // Filter items by rating when filter changes
   useEffect(() => {
      if (!ratingFilter.enabled) {
         setFilteredItems(items);
      } else {
         const filtered = items.filter((item) => {
            const r = getDisplayedRating(item);
            if (r === null) return false;
            return Math.round(r) === ratingFilter.value;
         });
         setFilteredItems(filtered);
      }
   }, [items, ratingFilter]);

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         // Only close if dropdown is open and click is outside
         if (isDropdownOpen && !event.target.closest(".rating-dropdown")) {
            setIsDropdownOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, [isDropdownOpen]);

   const handleItemClick = (item) => {
      navigate(`/${categorySlug}/${item.slug}`);
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Breadcrumb />
            <div className="container mx-auto px-4 py-20">
               <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Breadcrumb />
            <div className="container mx-auto px-4 py-20">
               <div className="text-center">
                  <div className="text-6xl mb-6">😕</div>
                  <h1 className="text-3xl font-bold text-white mb-4">{error}</h1>
                  <p className="text-gray-400 mb-8">
                     The category you're looking for doesn't exist.
                  </p>
                  <Link
                     to="/explore"
                     className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                     Browse All Categories
                  </Link>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
         <Breadcrumb />

         {/* Category Header */}
         <header className="container mx-auto px-4 py-16 lg:py-24">
            <div
               className={`text-center transition-all duration-1000 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
               }`}>
               <div
                  className={`inline-block w-16 h-16 bg-gradient-to-r ${
                     category?.gradient || "from-blue-500 to-purple-600"
                  } rounded-2xl flex items-center justify-center mb-6`}>
                  {isSVGIcon(category?.icon) ? (
                     <div className="w-10 h-10 text-white">{getIcon(category?.icon)}</div>
                  ) : (
                     <span className="text-3xl">{getIcon(category?.icon) || "📁"}</span>
                  )}
               </div>

               <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                     {category?.name}
                  </span>
               </h1>

               <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  {category?.description}
               </p>

               <div className="text-gray-400">
                  {filteredItems.length} of {items.length}{" "}
                  {items.length === 1 ? "item" : "items"}{" "}
                  {ratingFilter.enabled ? "matching filter" : "available"}
               </div>
            </div>
         </header>

         {/* Rating Filter */}
         {items.length > 0 && (
            <div className="container mx-auto px-4 mb-8">
               <div
                  className={`transition-all duration-1000 delay-200 transform ${
                     isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <span className="text-white font-medium">
                              Filter by Rating:
                           </span>
                           {ratingFilter.enabled && (
                              <div className="text-sm text-purple-300">
                                 Showing items rated exactly {ratingFilter.value} ⭐
                              </div>
                           )}
                        </div>

                        <div className="flex items-center gap-3">
                           {/* Rating Dropdown */}
                           <div className="relative rating-dropdown">
                              <button
                                 onClick={() => setIsDropdownOpen((prev) => !prev)}
                                 className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 transition-colors min-w-[140px]">
                                 <span className="text-sm">
                                    {ratingFilter.enabled
                                       ? `${ratingFilter.value} ⭐`
                                       : "All Ratings"}
                                 </span>
                                 <svg
                                    className={`w-4 h-4 transition-transform ${
                                       isDropdownOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M19 9l-7 7-7-7"
                                    />
                                 </svg>
                              </button>

                              {isDropdownOpen && (
                                 <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto min-w-[160px]">
                                    <button
                                       type="button"
                                       onClick={() => {
                                          setRatingFilter({
                                             value: 0,
                                             enabled: false,
                                          });
                                          setIsDropdownOpen(false);
                                       }}
                                       className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                                          !ratingFilter.enabled
                                             ? "bg-purple-600 text-white"
                                             : "text-gray-300"
                                       }`}>
                                       All Ratings
                                    </button>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                       <button
                                          type="button"
                                          key={rating}
                                          onClick={() => {
                                             setRatingFilter({
                                                value: rating,
                                                enabled: true,
                                             });
                                             setIsDropdownOpen(false);
                                          }}
                                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                                             ratingFilter.enabled &&
                                             ratingFilter.value === rating
                                                ? "bg-purple-600 text-white"
                                                : "text-gray-300"
                                          }`}>
                                          {rating} ⭐
                                       </button>
                                    ))}
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Items Grid */}
         <main className="container mx-auto px-4 pb-20">
            {filteredItems.length === 0 ? (
               <div
                  className={`text-center py-20 transition-all duration-1000 delay-300 transform ${
                     isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                  <div className="text-6xl mb-6">{items.length === 0 ? "📦" : "🔍"}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                     {items.length === 0 ? "No items yet" : "No items match your filter"}
                  </h3>
                  <p className="text-gray-400">
                     {items.length === 0
                        ? "Items in this category will appear here once they're added."
                        : "Try adjusting your rating filter to see more items."}
                  </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredItems.map((item, index) => (
                     <div
                        key={item._id}
                        className={`group cursor-pointer transition-all duration-1000 ease-[cubic-bezier(.4,0,.2,1)] delay-${
                           index * 50
                        } transform ${
                           isLoaded
                              ? "translate-y-0 opacity-100"
                              : "translate-y-8 opacity-0"
                        }`}
                        onClick={() => handleItemClick(item)}>
                        <div className="relative flex flex-col h-full rounded-3xl shadow-xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-purple-900 hover:to-slate-800 hover:shadow-2xl hover:scale-[1.04] transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] overflow-hidden">
                           {/* Modern Image Section */}
                           <div className="relative h-56 w-full overflow-hidden">
                              {item.screenshots && item.screenshots.length > 0 ? (
                                 <img
                                    src={item.screenshots[0]}
                                    alt={item.title}
                                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-110 group-hover:brightness-95"
                                    onError={(e) => {
                                       e.target.style.display = "none";
                                    }}
                                 />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-slate-700">
                                    <span className="text-5xl text-gray-400">🎬</span>
                                 </div>
                              )}
                              {/* Gradient overlay for readability */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-90" />
                              {/* Rating badge */}
                              {getDisplayedRating(item) !== null && (
                                 <div className="absolute top-4 right-4 bg-yellow-400/90 text-black px-3 py-1 rounded-full text-base font-bold shadow-lg flex items-center gap-1 transition-all duration-500 group-hover:scale-110 group-hover:shadow-yellow-300/40">
                                    <span className="text-lg">⭐</span>{" "}
                                    {Math.round(getDisplayedRating(item))}
                                 </div>
                              )}
                           </div>
                           {/* Content Section */}
                           <div className="flex-1 flex flex-col p-6 gap-3">
                              <h3 className="text-xl font-extrabold text-white mb-1 group-hover:text-purple-400 transition-colors duration-500 ease-[cubic-bezier(.4,0,.2,1)] line-clamp-2">
                                 {item.title}
                              </h3>
                              <p className="text-gray-300 text-base mb-2 line-clamp-3 transition-colors duration-500 group-hover:text-gray-100">
                                 {item.description}
                              </p>
                              {/* Metadata row */}
                              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                                 <span className="capitalize bg-white/10 px-2 py-1 rounded-full">
                                    {item.developer || "Unknown"}
                                 </span>
                                 {item.releaseDate && (
                                    <span className="bg-white/10 px-2 py-1 rounded-full">
                                       {new Date(item.releaseDate).getFullYear()}
                                    </span>
                                 )}
                              </div>
                              {/* Tags row */}
                              {item.platforms && item.platforms.length > 0 && (
                                 <div className="flex flex-wrap gap-2 mt-auto">
                                    {item.platforms
                                       .slice(0, 3)
                                       .map((platform, tagIndex) => (
                                          <span
                                             key={tagIndex}
                                             className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-500 group-hover:bg-purple-500/40 group-hover:text-white">
                                             {platform}
                                          </span>
                                       ))}
                                    {item.platforms.length > 3 && (
                                       <span className="text-gray-500 text-xs px-3 py-1">
                                          +{item.platforms.length - 3} more
                                       </span>
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </main>
      </div>
   );
};

export default DynamicCategoryPage;
