import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { frontendAPI } from "../api/index.js";

const Breadcrumb = () => {
   const location = useLocation();
   const [dynamicNames, setDynamicNames] = useState({});

   const breadcrumbNames = {
      movies: "Movies",
      series: "TV Series",
      anime: "Anime",
      games: "Games",
      explore: "Explore",
      admin: "Admin",
      categories: "Categories",
      items: "Items",
   };

   useEffect(() => {
      const pathnames = location.pathname.split("/").filter((x) => x);

      const fetchDynamicNames = async () => {
         if (pathnames.length === 0) return;

         try {
            // Fetch categories to resolve category names
            const categoriesResponse = await frontendAPI.getCategories();
            if (categoriesResponse.success) {
               const categories = categoriesResponse.data.categories;
               const newDynamicNames = {};

               // Map category slugs to names
               categories.forEach((cat) => {
                  newDynamicNames[cat.slug] = cat.name;
               });

               // If we have a second pathname (item), fetch items to get item name
               if (pathnames.length >= 2 && pathnames[0] !== "admin") {
                  const categorySlug = pathnames[0];
                  const itemSlug = pathnames[1];

                  const category = categories.find((cat) => cat.slug === categorySlug);
                  if (category) {
                     const itemsResponse = await frontendAPI.getItemsByCategory(
                        category._id
                     );
                     if (itemsResponse.success) {
                        const item = itemsResponse.data.items.find(
                           (item) => item.slug === itemSlug
                        );
                        if (item) {
                           newDynamicNames[itemSlug] = item.title;
                        }
                     }
                  }
               }

               setDynamicNames(newDynamicNames);
            }
         } catch (error) {
            console.error("Error fetching dynamic names for breadcrumb:", error);
         }
      };

      fetchDynamicNames();
   }, [location.pathname]);

   const pathnames = location.pathname.split("/").filter((x) => x);

   return (
      <nav
         className="bg-slate-800/50 backdrop-blur-sm border-b border-white/10"
         aria-label="Breadcrumb">
         <div className="container mx-auto px-4 py-3">
            <ol className="flex items-center space-x-2 text-sm">
               <li>
                  <Link
                     to="/"
                     className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                     <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                     </svg>
                     Home
                  </Link>
               </li>

               {pathnames.map((pathname, index) => {
                  const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathnames.length - 1;

                  // Get display name: first check dynamic names, then static names, then capitalize pathname
                  const displayName =
                     dynamicNames[pathname] ||
                     breadcrumbNames[pathname] ||
                     pathname.charAt(0).toUpperCase() + pathname.slice(1);

                  return (
                     <li key={pathname} className="flex items-center">
                        <svg
                           className="w-4 h-4 text-gray-600 mx-2"
                           fill="currentColor"
                           viewBox="0 0 20 20">
                           <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                           />
                        </svg>
                        {isLast ? (
                           <span className="text-white font-medium" aria-current="page">
                              {displayName}
                           </span>
                        ) : (
                           <Link
                              to={routeTo}
                              className="text-gray-400 hover:text-white transition-colors duration-200">
                              {displayName}
                           </Link>
                        )}
                     </li>
                  );
               })}
            </ol>
         </div>
      </nav>
   );
};

export default Breadcrumb;
