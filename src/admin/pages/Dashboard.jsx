import { useState, useEffect } from "react";
import { categoriesAPI, itemsAPI } from "../api.js";

const Dashboard = () => {
   const [stats, setStats] = useState({
      categories: { total: 0, active: 0 },
      items: { total: 0, active: 0, draft: 0, featured: 0 },
      loading: true,
      error: null,
   });

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const [categoryStats, itemStats] = await Promise.all([
               categoriesAPI.getStats(),
               itemsAPI.getStats(),
            ]);

            if (categoryStats.success && itemStats.success) {
               setStats({
                  categories: {
                     total: categoryStats.data.stats.length,
                     active: categoryStats.data.stats.filter(
                        (cat) => cat.status === "active"
                     ).length,
                  },
                  items: {
                     total: itemStats.data.overview.total,
                     active: itemStats.data.overview.active,
                     draft: itemStats.data.overview.draft,
                  },
                  loading: false,
                  error: null,
               });
            }
         } catch (error) {
            setStats((prev) => ({
               ...prev,
               loading: false,
               error: error instanceof Error ? error.message : "Failed to load stats",
            }));
         }
      };

      fetchStats();

      // Refresh stats every 60 seconds
      const intervalId = setInterval(fetchStats, 60000);

      // Refresh when page becomes visible
      const handleVisibilityChange = () => {
         if (!document.hidden) {
            fetchStats();
         }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
         clearInterval(intervalId);
         document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
   }, []);

   const statCards = [
      {
         title: "Total Categories",
         value: stats.categories.total,
         icon: "📂",
         color: "from-blue-500 to-blue-600",
      },
      {
         title: "Active Categories",
         value: stats.categories.active,
         icon: "✅",
         color: "from-green-500 to-green-600",
      },
      {
         title: "Total Items",
         value: stats.items.total,
         icon: "📄",
         color: "from-purple-500 to-purple-600",
      },
      {
         title: "Active Items",
         value: stats.items.active,
         icon: "🟢",
         color: "from-emerald-500 to-emerald-600",
      },
      {
         title: "Draft Items",
         value: stats.items.draft,
         icon: "📝",
         color: "from-yellow-500 to-yellow-600",
      },
   ];

   if (stats.loading) {
      return (
         <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   if (stats.error) {
      return (
         <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
            Error loading dashboard: {stats.error}
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">
               Overview of your entertainment content management system
            </p>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card) => (
               <div
                  key={card.title}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                        <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                     </div>
                     <div
                        className={`text-4xl bg-gradient-to-r ${card.color} p-3 rounded-lg`}>
                        {card.icon}
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Quick Actions */}
         {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                  <div className="text-2xl mb-2">📂</div>
                  <div className="font-medium">Add Category</div>
               </button>

               <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-medium">Add Item</div>
               </button>

               <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium">View Analytics</div>
               </button>

               <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200">
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="font-medium">Settings</div>
               </button>
            </div>
         </div> */}

         {/* Recent Activity */}
         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
               <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>System initialized successfully</span>
                  <span className="ml-auto text-sm text-gray-500">Just now</span>
               </div>
               <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Admin panel loaded</span>
                  <span className="ml-auto text-sm text-gray-500">1 minute ago</span>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
