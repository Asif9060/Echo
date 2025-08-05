import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { frontendAPI } from "../api/index.js";
import Breadcrumb from "../components/Breadcrumb";

const DynamicItemPage = () => {
   const { categorySlug, itemSlug } = useParams();
   const navigate = useNavigate();
   const [item, setItem] = useState(null);
   const [category, setCategory] = useState(null);
   const [relatedItems, setRelatedItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [isLoaded, setIsLoaded] = useState(false);
   const [activeScreenshot, setActiveScreenshot] = useState(0);
   const [showFullImage, setShowFullImage] = useState(false);

   useEffect(() => {
      const fetchItemData = async () => {
         try {
            setLoading(true);
            setError(null);

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

            const itemsResponse = await frontendAPI.getItemsByCategory(foundCategory._id);
            if (!itemsResponse.success) {
               throw new Error("Failed to fetch items");
            }

            const foundItem = itemsResponse.data.items.find(
               (item) => item.slug === itemSlug
            );

            if (!foundItem) {
               setError("Item not found");
               return;
            }

            setItem(foundItem);

            const otherItems = itemsResponse.data.items
               .filter((relatedItem) => relatedItem._id !== foundItem._id)
               .slice(0, 8);
            setRelatedItems(otherItems);

            setTimeout(() => setIsLoaded(true), 300);
         } catch (err) {
            console.error("Error fetching item data:", err);
            setError(err.message || "Failed to load item");
         } finally {
            setLoading(false);
         }
      };

      fetchItemData();
   }, [categorySlug, itemSlug]);

   const handleRelatedItemClick = (relatedItem) => {
      navigate(`/${categorySlug}/${relatedItem.slug}`);
   };

   const calculateAverageRating = (ratings) => {
      if (!ratings) return 0;
      return (
         ((ratings.story || 0) +
            (ratings.graphics || 0) +
            (ratings.gameplay || 0) +
            (ratings.replayability || 0)) /
         4
      );
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Breadcrumb />
            <div className="container mx-auto px-4 py-20">
               <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center space-y-4">
                     <div className="w-12 h-12 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-gray-400 animate-pulse">
                        Loading item details...
                     </p>
                  </div>
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
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-full flex items-center justify-center">
                     <div className="text-6xl">😕</div>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-6">{error}</h1>
                  <p className="text-gray-400 mb-12 text-lg max-w-md mx-auto">
                     The item you're looking for doesn't exist or has been moved.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Link
                        to={`/${categorySlug}`}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                        Back to {category?.name || "Category"}
                     </Link>
                     <Link
                        to="/explore"
                        className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl transition-all duration-300 border border-white/20">
                        Browse All Categories
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
         <Breadcrumb />

         {/* Hero Section with Cover Image */}
         {item?.screenshots && item.screenshots.length > 0 && (
            <div className="relative h-96 overflow-hidden">
               <div
                  className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
                  style={{ backgroundImage: `url(${item.screenshots[0]})` }}></div>
               <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-slate-900"></div>
               <div className="relative container mx-auto px-6 h-full flex items-end pb-12">
                  <div className="flex items-center space-x-6">
                     {/* Quick Rating Badge */}
                     {item?.ratings && (
                        <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
                           <div className="flex items-center space-x-3">
                              <div className="text-3xl">⭐</div>
                              <div>
                                 <div className="text-2xl font-bold text-white">
                                    {calculateAverageRating(item.ratings).toFixed(1)}
                                 </div>
                                 <div className="text-sm text-gray-300">out of 5</div>
                              </div>
                           </div>
                        </div>
                     )}
                     {/* Quick Info */}
                     <div className="text-white">
                        <div className="text-sm text-gray-300 mb-1">
                           {category?.name} • {item?.developer}
                        </div>
                        <div className="text-sm text-gray-400">
                           Released:{" "}
                           {item?.releaseDate
                              ? new Date(item.releaseDate).toLocaleDateString()
                              : "TBA"}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Main Content */}
         <main className="container mx-auto px-6 py-12">
            {/* Back Button */}
            <div className="mb-8">
               <Link
                  to={`/${categorySlug}`}
                  className="inline-flex items-center space-x-3 text-purple-400 hover:text-purple-300 transition-all duration-300 group">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                     <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M15 19l-7-7 7-7"
                        />
                     </svg>
                  </div>
                  <span className="font-medium">Back to {category?.name}</span>
               </Link>
            </div>

            <div
               className={`transition-all duration-1000 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
               }`}>
               {/* Title Section */}
               <div className="mb-12">
                  <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6 leading-tight">
                     {item?.title}
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                     {item?.description}
                  </p>
               </div>

               {/* Main Content Grid */}
               <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                  {/* Left Column - Images and Media */}
                  <div className="xl:col-span-5">
                     {/* Screenshot Gallery */}
                     {item?.screenshots && item.screenshots.length > 0 && (
                        <div className="space-y-6">
                           {/* Main Screenshot */}
                           <div className="relative group">
                              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl overflow-hidden">
                                 <img
                                    src={item.screenshots[activeScreenshot]}
                                    alt={`${item.title} screenshot ${
                                       activeScreenshot + 1
                                    }`}
                                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                                    onClick={() => setShowFullImage(true)}
                                 />
                              </div>
                              <button
                                 onClick={() => setShowFullImage(true)}
                                 className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                 <svg
                                    className="w-5 h-5"
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
                              </button>
                           </div>

                           {/* Screenshot Thumbnails */}
                           {item.screenshots.length > 1 && (
                              <div className="grid grid-cols-4 gap-3">
                                 {item.screenshots.map((screenshot, index) => (
                                    <button
                                       key={index}
                                       onClick={() => setActiveScreenshot(index)}
                                       className={`aspect-video rounded-xl overflow-hidden transition-all duration-300 ${
                                          activeScreenshot === index
                                             ? "ring-2 ring-purple-500 scale-105"
                                             : "hover:scale-105 opacity-70 hover:opacity-100"
                                       }`}>
                                       <img
                                          src={screenshot}
                                          alt={`Thumbnail ${index + 1}`}
                                          className="w-full h-full object-cover"
                                       />
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>
                     )}

                     {/* Quick Stats */}
                     <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl">
                        <h3 className="text-lg font-semibold text-white mb-4">
                           Quick Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="text-center p-4 bg-white/5 rounded-2xl">
                              <div className="text-2xl font-bold text-purple-400">
                                 {item?.platforms?.length || 0}
                              </div>
                              <div className="text-sm text-gray-400">Platforms</div>
                           </div>
                           <div className="text-center p-4 bg-white/5 rounded-2xl">
                              <div className="text-2xl font-bold text-blue-400">
                                 {item?.genres?.length || 0}
                              </div>
                              <div className="text-sm text-gray-400">Genres</div>
                           </div>
                           <div className="text-center p-4 bg-white/5 rounded-2xl">
                              <div className="text-2xl font-bold text-green-400">
                                 {item?.keyFeatures?.length || 0}
                              </div>
                              <div className="text-sm text-gray-400">Features</div>
                           </div>
                           <div className="text-center p-4 bg-white/5 rounded-2xl">
                              <div className="text-2xl font-bold text-yellow-400">
                                 {item?.ratings
                                    ? calculateAverageRating(item.ratings).toFixed(1)
                                    : "N/A"}
                              </div>
                              <div className="text-sm text-gray-400">Rating</div>
                           </div>
                        </div>
                     </div>

                     {/* Characters Section */}
                     {item?.characters && item.characters.length > 0 && (
                        <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl">
                           <div className="flex items-center space-x-3 mb-6">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                 <span className="text-white text-sm">👥</span>
                              </div>
                              <h3 className="text-lg font-semibold text-white">
                                 Characters
                              </h3>
                           </div>
                           <div className="grid gap-6">
                              {item.characters.map((character, index) => (
                                 <div
                                    key={index}
                                    className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex-shrink-0">
                                       <img
                                          src={character.image}
                                          alt={character.name}
                                          className="w-18 h-full object-cover rounded-xl border border-white/20"
                                          onError={(e) => {
                                             e.target.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0zMiA0MEMzNy41MjI4IDQwIDQyIDM1LjUyMjggNDIgMzBDNDIgMjQuNDc3MiAzNy41MjI4IDIwIDMyIDIwQzI2LjQ3NzIgMjAgMjIgMjQuNDc3MiAyMiAzMEMyMiAzNS41MjI4IDI2LjQ3NzIgNDAgMzIgNDBaIiBmaWxsPSIjNjM2NjgxIi8+CjxwYXRoIGQ9Ik0zMiA0NEMzNi40MTgzIDQ0IDQwIDQ3LjU4MTcgNDAgNTJINTJWNDhDNTIgNDQuNjg2MyA0OS4zMTM3IDQyIDQ2IDQySDQ2QzQyLjY4NjMgNDIgNDAgNDQuNjg2MyA0MCA0OFY1Mkg0MEM0MCA0Ny41ODE3IDM2LjQxODMgNDQgMzIgNDRDMjcuNTgxNyA0NCAyNCA0Ny41ODE3IDI0IDUySDE2VjQ4QzE2IDQ0LjY4NjMgMTguNjg2MyA0MiAyMiA0MkgyMkMyNS4zMTM3IDQyIDI4IDQ0LjY4NjMgMjggNDhWNTJIMjRDMjQgNDcuNTgxNyAyNy41ODE3IDQ0IDMyIDQ0WiIgZmlsbD0iIzYzNjY4MSIvPgo8L3N2Zz4K";
                                          }}
                                       />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <h4 className="text-white font-semibold text-lg mb-2">
                                          {character.name}
                                       </h4>
                                       <p className="text-gray-300 leading-relaxed text-sm">
                                          {character.description}
                                       </p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Right Column - Content */}
                  <div className="xl:col-span-7 space-y-10">
                     {/* Story Summary */}
                     {item?.storySummary && (
                        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                           <div className="flex items-center space-x-3 mb-6">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                 <span className="text-white text-sm">📖</span>
                              </div>
                              <h2 className="text-2xl font-bold text-white">Story</h2>
                           </div>
                           <p className="text-gray-300 text-lg leading-relaxed">
                              {item.storySummary}
                           </p>
                        </section>
                     )}

                     {/* Highlights */}
                     {item?.highlights && item.highlights.length > 0 && (
                        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                           <div className="flex items-center space-x-3 mb-6">
                              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                 <span className="text-white text-sm">✨</span>
                              </div>
                              <h2 className="text-2xl font-bold text-white">
                                 Highlights
                              </h2>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {item.highlights.map((highlight, index) => (
                                 <div
                                    key={index}
                                    className="flex items-start space-x-3 p-4 bg-white/5 rounded-2xl">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                                    <p className="text-gray-300">{highlight}</p>
                                 </div>
                              ))}
                           </div>
                        </section>
                     )}

                     {/* Detailed Ratings */}
                     {item?.ratings && (
                        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                           <div className="flex items-center space-x-3 mb-6">
                              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg flex items-center justify-center">
                                 <span className="text-white text-sm">⭐</span>
                              </div>
                              <h2 className="text-2xl font-bold text-white">
                                 Detailed Ratings
                              </h2>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {[
                                 {
                                    key: "story",
                                    label: "Story",
                                    color: "from-purple-500 to-purple-400",
                                 },
                                 {
                                    key: "graphics",
                                    label: "Graphics",
                                    color: "from-blue-500 to-blue-400",
                                 },
                                 {
                                    key: "gameplay",
                                    label: "Gameplay",
                                    color: "from-green-500 to-green-400",
                                 },
                                 {
                                    key: "replayability",
                                    label: "Replayability",
                                    color: "from-orange-500 to-orange-400",
                                 },
                              ].map((rating) => (
                                 <div
                                    key={rating.key}
                                    className="bg-white/5 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-3">
                                       <span className="text-white font-medium">
                                          {rating.label}
                                       </span>
                                       <span className="text-2xl font-bold text-yellow-400">
                                          {item.ratings[rating.key] || 0}/5
                                       </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                       <div
                                          className={`h-2 rounded-full bg-gradient-to-r ${rating.color} transition-all duration-500`}
                                          style={{
                                             width: `${
                                                ((item.ratings[rating.key] || 0) / 5) *
                                                100
                                             }%`,
                                          }}></div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </section>
                     )}

                     {/* Author Review */}
                     {item?.authorReview && (
                        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                           <div className="flex items-center space-x-3 mb-6">
                              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                 <span className="text-white text-sm">💭</span>
                              </div>
                              <h2 className="text-2xl font-bold text-white">Review</h2>
                           </div>
                           <blockquote className="text-gray-300 text-lg leading-relaxed italic border-l-4 border-purple-500 pl-6">
                              "{item.authorReview}"
                           </blockquote>
                        </section>
                     )}

                     {/* Technical Details */}
                     <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center space-x-3 mb-6">
                           <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-400 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm">🔧</span>
                           </div>
                           <h2 className="text-2xl font-bold text-white">
                              Technical Details
                           </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           {/* Basic Info */}
                           <div className="space-y-4">
                              {item?.developer && (
                                 <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                                    <span className="text-gray-400">Developer</span>
                                    <span className="text-white font-medium">
                                       {item.developer}
                                    </span>
                                 </div>
                              )}
                              {item?.releaseDate && (
                                 <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                                    <span className="text-gray-400">Release Date</span>
                                    <span className="text-white font-medium">
                                       {new Date(item.releaseDate).toLocaleDateString()}
                                    </span>
                                 </div>
                              )}
                           </div>

                           {/* Tags */}
                           <div className="space-y-6">
                              {/* Platforms */}
                              {item?.platforms && item.platforms.length > 0 && (
                                 <div>
                                    <h4 className="text-white font-semibold mb-3">
                                       Platforms
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                       {item.platforms.map((platform, index) => (
                                          <span
                                             key={index}
                                             className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-xl text-sm border border-blue-500/30">
                                             {platform}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {/* Genres */}
                              {item?.genres && item.genres.length > 0 && (
                                 <div>
                                    <h4 className="text-white font-semibold mb-3">
                                       Genres
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                       {item.genres.map((genre, index) => (
                                          <span
                                             key={index}
                                             className="bg-purple-500/20 text-purple-300 px-3 py-2 rounded-xl text-sm border border-purple-500/30">
                                             {genre}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </section>

                     {/* Key Features */}
                     {item?.keyFeatures && item.keyFeatures.length > 0 && (
                        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                           <div className="flex items-center space-x-3 mb-6">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                 <span className="text-white text-sm">🎯</span>
                              </div>
                              <h2 className="text-2xl font-bold text-white">
                                 Key Features
                              </h2>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {item.keyFeatures.map((feature, index) => (
                                 <div
                                    key={index}
                                    className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl">
                                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-300">{feature}</span>
                                 </div>
                              ))}
                           </div>
                        </section>
                     )}

                     {/* Soundtrack */}
                     {item?.soundtrackLinks && item.soundtrackLinks.length > 0 && (
                        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                           <div className="flex items-center space-x-3 mb-6">
                              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                                 <span className="text-white text-sm">🎵</span>
                              </div>
                              <h2 className="text-2xl font-bold text-white">
                                 Soundtrack
                              </h2>
                           </div>
                           <div className="space-y-3">
                              {item.soundtrackLinks.map((link, index) => (
                                 <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                       <svg
                                          className="w-6 h-6 text-white"
                                          fill="currentColor"
                                          viewBox="0 0 20 20">
                                          <path
                                             fillRule="evenodd"
                                             d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                             clipRule="evenodd"
                                          />
                                       </svg>
                                    </div>
                                    <div>
                                       <div className="text-white font-medium">
                                          Soundtrack Track {index + 1}
                                       </div>
                                       <div className="text-gray-400 text-sm">
                                          Click to listen
                                       </div>
                                    </div>
                                    <div className="ml-auto text-purple-400 group-hover:text-purple-300">
                                       <svg
                                          className="w-5 h-5"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24">
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                          />
                                       </svg>
                                    </div>
                                 </a>
                              ))}
                           </div>
                        </section>
                     )}
                  </div>
               </div>

               {/* Related Items */}
               {relatedItems.length > 0 && (
                  <section className="mt-20">
                     <div className="flex items-center space-x-3 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                           <span className="text-white text-sm">🔍</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white">
                           More from {category?.name}
                        </h2>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedItems.map((relatedItem, index) => (
                           <div
                              key={relatedItem._id}
                              className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                                 isLoaded
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-8 opacity-0"
                              }`}
                              style={{ animationDelay: `${index * 100}ms` }}
                              onClick={() => handleRelatedItemClick(relatedItem)}>
                              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                                 <div className="relative h-48 overflow-hidden">
                                    {relatedItem.screenshots &&
                                    relatedItem.screenshots.length > 0 ? (
                                       <img
                                          src={relatedItem.screenshots[0]}
                                          alt={relatedItem.title}
                                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                       />
                                    ) : (
                                       <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                          <span className="text-4xl opacity-40">🎮</span>
                                       </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    {relatedItem.ratings && (
                                       <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm">
                                          ⭐{" "}
                                          {calculateAverageRating(
                                             relatedItem.ratings
                                          ).toFixed(1)}
                                       </div>
                                    )}
                                 </div>
                                 <div className="p-4">
                                    <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                       {relatedItem.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                       {relatedItem.description}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               )}
            </div>
         </main>

         {/* Full Image Modal */}
         {showFullImage && item?.screenshots && (
            <div
               className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
               onClick={() => setShowFullImage(false)}>
               <div className="relative max-w-7xl max-h-full">
                  <img
                     src={item.screenshots[activeScreenshot]}
                     alt={`${item.title} full screen`}
                     className="max-w-full max-h-full object-contain rounded-2xl"
                     onClick={(e) => e.stopPropagation()}
                  />
                  <button
                     onClick={() => setShowFullImage(false)}
                     className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors">
                     <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M6 18L18 6M6 6l12 12"
                        />
                     </svg>
                  </button>
               </div>
            </div>
         )}

         {/* Add CSS for animations and line-clamp */}
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

            .line-clamp-2 {
               display: -webkit-box;
               -webkit-line-clamp: 2;
               -webkit-box-orient: vertical;
               overflow: hidden;
            }
         `}</style>
      </div>
   );
};

export default DynamicItemPage;
