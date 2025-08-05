import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import AnimePage from "./pages/AnimePage";
import GamesPage from "./pages/GamesPage";
import ExplorePage from "./pages/ExplorePage";
import DynamicCategoryPage from "./pages/DynamicCategoryPage";
import DynamicItemPage from "./pages/DynamicItemPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "./admin/components/AdminLayout.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import CategoriesPage from "./admin/pages/CategoriesPage.jsx";
import ItemsPage from "./admin/pages/ItemsPage.jsx";

function App() {
   return (
      <Router>
         <div className="min-h-screen bg-slate-900">
            <Routes>
               {/* Public routes */}
               <Route path="/" element={<HomePage />} />
               <Route path="/explore" element={<ExplorePage />} />

               {/* Admin routes - MUST come before dynamic routes */}
               <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="items" element={<ItemsPage />} />
               </Route>

               {/* Legacy static routes (fallback for existing bookmarks) */}
               <Route path="/movies" element={<MoviesPage />} />
               <Route path="/series" element={<SeriesPage />} />
               <Route path="/anime" element={<AnimePage />} />
               <Route path="/games" element={<GamesPage />} />

               {/* Dynamic item routes - more specific routes first */}
               <Route path="/:categorySlug/:itemSlug" element={<DynamicItemPage />} />

               {/* Dynamic category routes - less specific routes last */}
               <Route path="/:categorySlug" element={<DynamicCategoryPage />} />

               {/* 404 catch-all route */}
               <Route path="*" element={<NotFoundPage />} />
            </Routes>
         </div>
      </Router>
   );
}

export default App;
