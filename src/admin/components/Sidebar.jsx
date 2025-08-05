import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
   const location = useLocation();

   const navItems = [
      {
         name: "Dashboard",
         path: "/admin",
         icon: (
            <svg
               className="w-5 h-5"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24">
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
               />
            </svg>
         ),
      },
      {
         name: "Categories",
         path: "/admin/categories",
         icon: (
            <svg
               className="w-5 h-5"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24">
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
               />
            </svg>
         ),
      },
      {
         name: "Items",
         path: "/admin/items",
         icon: (
            <svg
               className="w-5 h-5"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24">
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
               />
            </svg>
         ),
      },
   ];

   const isActive = (path) => {
      if (path === "/admin") {
         return location.pathname === "/admin";
      }
      return location.pathname.startsWith(path);
   };

   return (
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
         {/* Header */}
         <div className="p-6 border-b border-slate-700">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-gray-400 mt-1">Entertainment Hub</p>
         </div>

         {/* Navigation */}
         <nav className="flex-1 p-4">
            <ul className="space-y-2">
               {navItems.map((item) => (
                  <li key={item.path}>
                     <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                           isActive(item.path)
                              ? "bg-purple-600 text-white"
                              : "text-gray-300 hover:bg-slate-700 hover:text-white"
                        }`}>
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                     </Link>
                  </li>
               ))}
            </ul>
         </nav>

         {/* Admin info */}
         <div className="p-4 border-t border-slate-700">
            <div className="flex items-center mb-3">
               <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
               </div>
               <div className="ml-3">
                  <p className="text-sm font-medium text-white">Administrator</p>
                  <p className="text-xs text-gray-400">Admin Panel</p>
               </div>
            </div>

            <Link
               to="/"
               className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200">
               <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
               </svg>
               <span className="ml-2">Back to Site</span>
            </Link>
         </div>
      </div>
   );
};

export default Sidebar;
