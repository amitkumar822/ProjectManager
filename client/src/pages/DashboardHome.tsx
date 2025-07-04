import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';

function DashboardHome() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[250px] bg-white border-r shadow-md">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardHome;
