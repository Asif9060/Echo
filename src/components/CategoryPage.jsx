import { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import Loading from "../components/Loading";

const CategoryPage = ({ title, description, icon, gradient, placeholderCount = 12 }) => {
   const [isLoading, setIsLoading] = useState(true);
   const [isLoaded, setIsLoaded] = useState(false);

   useEffect(() => {
      // Simulate loading time
      const timer = setTimeout(() => {
         setIsLoading(false);
         setIsLoaded(true);
      }, 1500);

      return () => clearTimeout(timer);
   }, []);

   const renderPlaceholderGrid = () => {
      return Array.from({ length: placeholderCount }, (_, index) => (
         <div
            key={index}
            className={`group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}>
            <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
               <div className="absolute bottom-4 left-4 right-4">
                  <div className="h-4 bg-white/20 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-white/10 rounded w-3/4 animate-pulse"></div>
               </div>
            </div>
            <div className="p-4">
               <div className="h-4 bg-white/10 rounded mb-2 animate-pulse"></div>
               <div className="h-3 bg-white/5 rounded w-2/3 animate-pulse"></div>
            </div>
         </div>
      ));
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
         <Breadcrumb />

         {/* Category Header */}
         <header className="relative overflow-hidden">
            <div
               className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-10`}></div>
            <div className="relative container mx-auto px-4 py-16 lg:py-24">
               <div
                  className={`text-center transition-all duration-1000 transform ${
                     isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                  <div className="text-6xl md:text-8xl mb-6 opacity-50">{icon}</div>
                  <h1
                     className={`text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                     {title}
                  </h1>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                     {description}
                  </p>
               </div>
            </div>
         </header>

         {/* Content Section */}
         <main className="container mx-auto px-4 py-12">
            {isLoading ? (
               <Loading message={`Loading ${title.toLowerCase()}...`} />
            ) : (
               <div
                  className={`transition-all duration-1000 delay-300 transform ${
                     isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                  {/* Filter/Sort Section */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                           Featured {title}
                        </h2>
                        <p className="text-gray-400">
                           Discover the best content in this category
                        </p>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-3">
                        <select className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                           <option value="popular">Most Popular</option>
                           <option value="recent">Recently Added</option>
                           <option value="rating">Top Rated</option>
                           <option value="alphabetical">A-Z</option>
                        </select>

                        <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors duration-200 flex items-center">
                           <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                              />
                           </svg>
                           Filter
                        </button>
                     </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                     {renderPlaceholderGrid()}
                  </div>

                  {/* Load More Button */}
                  <div className="text-center mt-12">
                     <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                        Load More {title}
                     </button>
                  </div>
               </div>
            )}
         </main>
      </div>
   );
};

export default CategoryPage;
