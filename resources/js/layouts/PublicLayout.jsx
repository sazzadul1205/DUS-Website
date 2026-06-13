// resources/js/layouts/PublicLayout.jsx

// React
import React from 'react';

// Icons
import { Dumbbell } from 'lucide-react';

// Components
import Navbar from '../components/Shared/Navbar';
import TopBar from '../components/Shared/TopBar';
import Footer from '../components/Shared/Footer';

const PublicLayout = ({ children, topBarData, navbarData, footerData, storageUrl }) => {
  return (
    <main >
      {/* TopBar */}
      <TopBar topBarData={topBarData} storageUrl={storageUrl} />

      {/* Navbar */}
      <Navbar navbarData={navbarData} />

      {/* Main Content */}
      <main className="mx-auto">
        {children}
      </main>

      {/* Footer */}
      <Footer footerData={footerData} storageUrl={storageUrl} />
    </main>
  );
};

export default PublicLayout;
