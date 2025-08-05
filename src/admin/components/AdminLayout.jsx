import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const AdminLayout = () => {
   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
         <Sidebar />
         <main className="flex-1 p-6 overflow-auto">
            <Outlet />
         </main>
      </div>
   );
};

export default AdminLayout;
