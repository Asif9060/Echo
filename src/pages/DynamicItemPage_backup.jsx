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

   useEffect(() => {
      const fetchItemData = async () => {
         try {
            setLoading(true);
            setError(null);

            // Fetch all categories to find the category
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

            // Fetch items for this category to find the specific item
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

            // Get related items (other items in the same category, excluding current item)
            const related = itemsResponse.data.items
               .filter((relatedItem) => relatedItem._id !== foundItem._id)
               .slice(0, 4);
            setRelatedItems(related);
         } catch (err) {
            console.error("Error fetching item data:", err);
            setError(err.message || "Failed to load item");
         } finally {
            setLoading(false);
            setTimeout(() => setIsLoaded(true), 100);
         }
      };

      if (categorySlug && itemSlug) {
         fetchItemData();
      }
   }, [categorySlug, itemSlug]);

   const handleRelatedItemClick = (relatedItem) => {
      navigate(`/${categorySlug}/${relatedItem.slug}`);
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
                     The item you're looking for doesn't exist.
                  </p>
                  <div className="space-x-4">
                     <Link
                        to={`/${categorySlug}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Back to {category?.name || "Category"}
                     </Link>
                     <Link
                        to="/explore"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors">
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

         {/* Item Details */}
         <main className="container mx-auto px-4 py-8">
            <div
               className={`transition-all duration-1000 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
               }`}>
               {/* Back Button */}
               <div className="mb-8">
                  <Link
                     to={`/${categorySlug}`}
                     className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                     <svg
                        className="w-5 h-5 mr-2"
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
                     Back to {category?.name}
                  </Link>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Item Image */}
                  <div className="lg:col-span-1">
                     <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl overflow-hidden aspect-[3/4]">
                        {item?.screenshots && item.screenshots.length > 0 ? (
                           <img
                              src={item.screenshots[0]}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                 e.target.style.display = "none";
                              }}
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center">
                              <span className="text-6xl text-gray-400">�</span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Item Info */}
                  <div className="lg:col-span-2">
                     <div className="space-y-6">
                        {/* Title and Rating */}
                        <div>
                           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                              {item?.title}
                           </h1>

                           {item?.ratings && (
                              <div className="flex items-center space-x-4 mb-4">
                                 <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-semibold">
                                    ⭐{" "}
                                    {(() => {
                                       const avgRating =
                                          ((item.ratings.story || 0) +
                                             (item.ratings.graphics || 0) +
                                             (item.ratings.gameplay || 0) +
                                             (item.ratings.replayability || 0)) /
                                          4;
                                       return avgRating.toFixed(1);
                                    })()}{" "}
                                    / 5
                                 </div>
                                 <span className="text-gray-400">Game</span>
                              </div>
                           )}
                        </div>

                        {/* Description */}
                        <div>
                           <h3 className="text-xl font-semibold text-white mb-3">
                              Description
                           </h3>
                           <p className="text-gray-300 leading-relaxed">
                              {item?.description}
                           </p>
                        </div>

                        {/* Story Summary */}
                        {item?.storySummary && (
                           <div>
                              <h3 className="text-xl font-semibold text-white mb-3">
                                 Story Summary
                              </h3>
                              <p className="text-gray-300 leading-relaxed">
                                 {item.storySummary}
                              </p>
                           </div>
                        )}

                        {/* Highlights */}
                        {item?.highlights && item.highlights.length > 0 && (
                           <div>
                              <h3 className="text-xl font-semibold text-white mb-3">
                                 Highlights
                              </h3>
                              <ul className="space-y-2 text-gray-300">
                                 {item.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start">
                                       <span className="text-purple-400 mr-2">•</span>
                                       {highlight}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        )}

                        {/* Author Review */}
                        {item?.authorReview && (
                           <div>
                              <h3 className="text-xl font-semibold text-white mb-3">
                                 Review
                              </h3>
                              <p className="text-gray-300 leading-relaxed italic">
                                 {item.authorReview}
                              </p>
                           </div>
                        )}

                        {/* Detailed Ratings */}
                        {item?.ratings && (
                           <div>
                              <h3 className="text-xl font-semibold text-white mb-3">
                                 Detailed Ratings
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Story</span>
                                    <span className="text-yellow-400">
                                       ⭐ {item.ratings.story || 0}/5
                                    </span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Graphics</span>
                                    <span className="text-yellow-400">
                                       ⭐ {item.ratings.graphics || 0}/5
                                    </span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Gameplay</span>
                                    <span className="text-yellow-400">
                                       ⭐ {item.ratings.gameplay || 0}/5
                                    </span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Replayability</span>
                                    <span className="text-yellow-400">
                                       ⭐ {item.ratings.replayability || 0}/5
                                    </span>
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* Screenshot Gallery */}
                        {item?.screenshots && item.screenshots.length > 1 && (
                           <div>
                              <h3 className="text-xl font-semibold text-white mb-3">
                                 Screenshots
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                 {item.screenshots.slice(1).map((screenshot, index) => (
                                    <div
                                       key={index}
                                       className="relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden aspect-video">
                                       <img
                                          src={screenshot}
                                          alt={`Screenshot ${index + 2}`}
                                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                          onError={(e) => {
                                             e.target.style.display = "none";
                                          }}
                                       />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Soundtrack Links */}
                        {item?.soundtrackLinks && item.soundtrackLinks.length > 0 && (
                           <div>
                              <h3 className="text-xl font-semibold text-white mb-3">
                                 Soundtrack
                              </h3>
                              <div className="space-y-2">
                                 {item.soundtrackLinks.map((link, index) => (
                                    <a
                                       key={index}
                                       href={link}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                                       <svg
                                          className="w-4 h-4 mr-2"
                                          fill="currentColor"
                                          viewBox="0 0 20 20">
                                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                          <path
                                             fillRule="evenodd"
                                             d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                             clipRule="evenodd"
                                          />
                                       </svg>
                                       Listen to Soundtrack {index + 1}
                                    </a>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {item?.releaseDate && (
                              <div>
                                 <h4 className="text-lg font-semibold text-white mb-2">
                                    Release Date
                                 </h4>
                                 <p className="text-gray-300">
                                    {new Date(item.releaseDate).toLocaleDateString()}
                                 </p>
                              </div>
                           )}

                           {item?.developer && (
                              <div>
                                 <h4 className="text-lg font-semibold text-white mb-2">
                                    Developer
                                 </h4>
                                 <p className="text-gray-300">{item.developer}</p>
                              </div>
                           )}
                        </div>

                        {/* Genres */}
                        {item?.genres && item.genres.length > 0 && (
                           <div>
                              <h4 className="text-lg font-semibold text-white mb-3">
                                 Genres
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                 {item.genres.map((genre, index) => (
                                    <span
                                       key={index}
                                       className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                                       {genre}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Platforms */}
                        {item?.platforms && item.platforms.length > 0 && (
                           <div>
                              <h4 className="text-lg font-semibold text-white mb-3">
                                 Platforms
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                 {item.platforms.map((platform, index) => (
                                    <span
                                       key={index}
                                       className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                                       {platform}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Key Features */}
                        {item?.keyFeatures && item.keyFeatures.length > 0 && (
                           <div>
                              <h4 className="text-lg font-semibold text-white mb-3">
                                 Key Features
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                 {item.keyFeatures.map((feature, index) => (
                                    <span
                                       key={index}
                                       className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                                       {feature}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Related Items */}
               {relatedItems.length > 0 && (
                  <div className="mt-16">
                     <h2 className="text-2xl font-bold text-white mb-8">
                        More from {category?.name}
                     </h2>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedItems.map((relatedItem, index) => (
                           <div
                              key={relatedItem._id}
                              className={`cursor-pointer transition-all duration-500 delay-${
                                 index * 100
                              } transform ${
                                 isLoaded
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-8 opacity-0"
                              }`}
                              onClick={() => handleRelatedItemClick(relatedItem)}>
                              <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
                                 <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-800">
                                    {relatedItem.screenshots &&
                                    relatedItem.screenshots.length > 0 ? (
                                       <img
                                          src={relatedItem.screenshots[0]}
                                          alt={relatedItem.title}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                             e.target.style.display = "none";
                                          }}
                                       />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center">
                                          <span className="text-2xl text-gray-400">
                                             �
                                          </span>
                                       </div>
                                    )}
                                 </div>

                                 <div className="p-4">
                                    <h3 className="text-white font-semibold mb-2 line-clamp-2">
                                       {relatedItem.title}
                                    </h3>
                                    {relatedItem.ratings && (
                                       <div className="text-yellow-400 text-sm">
                                          ⭐{" "}
                                          {(() => {
                                             const avgRating =
                                                ((relatedItem.ratings.story || 0) +
                                                   (relatedItem.ratings.graphics || 0) +
                                                   (relatedItem.ratings.gameplay || 0) +
                                                   (relatedItem.ratings.replayability ||
                                                      0)) /
                                                4;
                                             return avgRating.toFixed(1);
                                          })()}{" "}
                                          / 5
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </main>
      </div>
   );
};

export default DynamicItemPage;
