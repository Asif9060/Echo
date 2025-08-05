import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { frontendAPI } from "../api/index.js";
// import { getIcon, isSVGIcon } from "../utils/icons.jsx";

const ExplorePage = () => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            setLoading(true);
            const response = await frontendAPI.getCategories();
            if (response.success) {
               // Map database categories to the expected format
               const mappedCategories = response.data.categories.map((cat) => ({
                  id: cat.slug || cat._id,
                  name: cat.name,
                  description: cat.description,
                  icon: cat.icon || "folder",
                  gradient: cat.gradient || "from-blue-500 to-purple-600",
                  count: `${cat.itemCount || 0}`,
                  _id: cat._id,
               }));
               setCategories(mappedCategories);
            } else {
               setError(response.message || "Failed to fetch categories");
            }
         } catch (err) {
            setError("Failed to fetch categories");
            console.error("Error fetching categories:", err);
         } finally {
            setLoading(false);
            setIsLoaded(true);
         }
      };

      fetchCategories();
   }, []);

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
         <Breadcrumb />

         {/* Page Header */}
         <header className="container mx-auto px-4 py-16 lg:py-24">
            <div
               className={`text-center transition-all duration-1000 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
               }`}>
               <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Explore All{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                     Categories
                  </span>
               </h1>
               <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Dive into our comprehensive collection of entertainment content. Find
                  exactly what you're looking for across all categories.
               </p>
            </div>
         </header>

         {/* Loading State */}
         {loading && (
            <div className="container mx-auto px-4 pb-20">
               <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
            </div>
         )}

         {/* Error State */}
         {error && (
            <div className="container mx-auto px-4 pb-20">
               <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 text-center">
                  <p className="text-red-400 text-lg">Error: {error}</p>
                  <button
                     onClick={() => window.location.reload()}
                     className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                     Try Again
                  </button>
               </div>
            </div>
         )}

         {/* Categories Grid */}
         {!loading && !error && (
            <main className="container mx-auto px-4 pb-20">
               {categories.length === 0 ? (
                  <div className="text-center py-20">
                     <div className="text-6xl mb-6">📁</div>
                     <h3 className="text-2xl font-bold text-white mb-4">
                        No categories available
                     </h3>
                     <p className="text-gray-400">
                        Categories will appear here once they are created.
                     </p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {categories.map((category, index) => (
                        <Link
                           key={category.id}
                           to={`/${category.id}`}
                           className={`group block transition-all duration-700 delay-${
                              index * 100
                           } transform ${
                              isLoaded
                                 ? "translate-y-0 opacity-100"
                                 : "translate-y-8 opacity-0"
                           }`}>
                           <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 h-full border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                              <div
                                 className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                              <div className="relative z-10">
                                 <div className="flex items-start justify-between mb-6">
                                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                                       <span>
                                          {category.icon === "folder"
                                             ? "📁"
                                             : category.icon === "film"
                                             ? "🎬"
                                             : category.icon === "tv"
                                             ? "📺"
                                             : category.icon === "gamepad"
                                             ? "🎮"
                                             : category.icon === "anime"
                                             ? "🗾"
                                             : "📁"}
                                       </span>
                                    </div>
                                    <div className="text-right">
                                       <div
                                          className={`text-2xl font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                                          {category.count}
                                       </div>
                                       <div className="text-sm text-gray-400">items</div>
                                    </div>
                                 </div>

                                 <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                                    {category.name}
                                 </h3>

                                 <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-6">
                                    {category.description}
                                 </p>

                                 <div className="flex items-center text-purple-400 group-hover:text-white transition-colors duration-300">
                                    <span className="font-medium">Explore now</span>
                                    <svg
                                       className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                                       fill="none"
                                       stroke="currentColor"
                                       viewBox="0 0 24 24">
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                                       />
                                    </svg>
                                 </div>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               )}

               {/* Additional Features */}
               <div
                  className={`mt-16 text-center transition-all duration-1000 delay-500 transform ${
                     isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                  <h2 className="text-3xl font-bold text-white mb-8">Coming Soon</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                     <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="text-3xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                           Advanced Search
                        </h3>
                        <p className="text-gray-400 text-sm">
                           Find content with powerful filters and search options
                        </p>
                     </div>

                     <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="text-3xl mb-4">⭐</div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                           Recommendations
                        </h3>
                        <p className="text-gray-400 text-sm">
                           Personalized content suggestions based on your preferences
                        </p>
                     </div>

                     <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="text-3xl mb-4">📱</div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                           Mobile App
                        </h3>
                        <p className="text-gray-400 text-sm">
                           Take your entertainment experience on the go
                        </p>
                     </div>
                  </div>
               </div>
            </main>
         )}
      </div>
   );
};

export default ExplorePage;
