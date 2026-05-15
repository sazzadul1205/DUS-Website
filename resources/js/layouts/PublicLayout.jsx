// resources/js/layouts/PublicLayout.jsx

// React
import React from 'react';

// Icons
import { Dumbbell } from 'lucide-react';

// Components
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

const PublicLayout = ({ children, topBarData, navbarData, footerData }) => {
  return (
    <div className='bg-white' >
      <TopBar topBarData={topBarData} />
      <Navbar navbarData={navbarData} />
      <main className=" mx-auto">{children}</main>
      <Footer footerData={footerData} />
    </div>
  );
};

export default PublicLayout;