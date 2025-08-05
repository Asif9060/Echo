import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { frontendAPI } from "../api/index.js";

// Modern icon components
const ModernIcons = {
   folder: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
         <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
      </svg>
   ),
   film: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
         <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
   ),
   tv: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
         <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5l-1 1v2h8v-2l-1-1h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z" />
      </svg>
   ),
   gamepad: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
         <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.12.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2-3c-.83 0-1.5-.67-1.5-1.5S16.67 5 17.5 5s1.5.67 1.5 1.5S18.33 8 17.5 8z" />
      </svg>
   ),
   anime: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
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
            d="M8 15s1.5 2 4 2 4-2 4-2"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
         />
         <path
            d="M6 8s3-2 6-2 6 2 6 2"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
         />
      </svg>
   ),
   music: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
         <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
   ),
   book: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
         <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
      </svg>
   ),
   star: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
   ),
};

const Hero = () => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [categories, setCategories] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await frontendAPI.getCategories();
            if (response.success) {
               // Map database categories to the expected format
               const mappedCategories = response.data.categories
                  .slice(0, 4)
                  .map((cat) => ({
                     id: cat.slug || cat._id,
                     name: cat.name,
                     description: cat.description,
                     icon: cat.icon || "folder",
                     gradient: cat.gradient || "from-blue-500 to-purple-600",
                     _id: cat._id,
                  }));
               setCategories(mappedCategories);
            }
         } catch (err) {
            console.error("Error fetching categories:", err);
            // Fallback to default categories if API fails
            setCategories([
               {
                  id: "movies",
                  name: "Movies",
                  description: "Discover blockbuster hits and indie gems",
                  icon: "film",
                  gradient: "from-red-500 to-pink-600",
               },
               {
                  id: "series",
                  name: "TV Series",
                  description: "Binge-worthy shows and limited series",
                  icon: "tv",
                  gradient: "from-blue-500 to-purple-600",
               },
               {
                  id: "anime",
                  name: "Anime",
                  description: "Japanese animation and manga adaptations",
                  icon: "anime",
                  gradient: "from-green-500 to-teal-600",
               },
               {
                  id: "games",
                  name: "Games",
                  description: "Gaming content and reviews",
                  icon: "gamepad",
                  gradient: "from-orange-500 to-red-600",
               },
            ]);
         } finally {
            setIsLoaded(true);
         }
      };

      fetchCategories();
   }, []);

   const handleCategoryClick = (categoryId) => {
      navigate(`/${categoryId}`);
   };

   const handleExploreClick = () => {
      navigate("/explore");
   };

   return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
         {/* Animated background elements */}
         {/* <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-32 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-32 left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
         </div> */}

         <video
            src="https://res.cloudinary.com/dcnsouc88/video/upload/v1753282504/bg_dz8p3i.mp4"
            loop
            autoPlay
            muted
            className="w-full absolute h-full object-cover"
         />

         {/* Hero content */}
         <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
            <div className="text-center mb-16">
               {/* Animated welcome message */}
               <h1
                  className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 transform ${
                     isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                     SSAS's Echo
                  </span>
               </h1>

               <p
                  className={`text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${
                     isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                  Discover amazing movies, binge-worthy series, captivating anime, and
                  exciting games all in one place.
               </p>
            </div>

            {/* Category cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
               {categories.map((category, index) => (
                  <div
                     key={category.id}
                     className={`group cursor-pointer transition-all duration-700 delay-${
                        index * 100
                     } transform ${
                        isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                     }`}
                     onClick={() => handleCategoryClick(category.id)}>
                     <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                        <div
                           className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                        <div className="relative z-10">
                           <div className="flex items-center justify-center w-16 h-16 mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                              {ModernIcons[category.icon] || ModernIcons.folder}
                           </div>
                           <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                              {category.name}
                           </h3>
                           <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                              {category.description}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Call-to-action button */}
            <div
               className={`text-center transition-all duration-1000 delay-600 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
               }`}>
               <button
                  onClick={handleExploreClick}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                  <span className="relative z-10 flex items-center">
                     Explore Categories
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
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
               </button>
            </div>
         </div>

         {/* Scroll indicator */}
         {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg
               className="w-6 h-6 text-white/50"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24">
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
               />
            </svg>
         </div> */}
      </section>
   );
};

export default Hero;
