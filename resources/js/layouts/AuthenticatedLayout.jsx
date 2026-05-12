// resources/js/layouts/AuthenticatedLayout.jsx
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

const AuthenticatedLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />

      {/* Main Content - Adjust margin based on sidebar state */}
      <main className={`transition-all duration-300 p-2 mx-auto text-black ${isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}>
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;