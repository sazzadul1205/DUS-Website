// resources/js/layouts/PublicLayout.jsx

// React
import React from 'react';

// Icons
import { Dumbbell } from 'lucide-react';

// Components
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

const PublicLayout = ({ children, auth }) => {
  return (
    <div className='bg-white' >
      <TopBar auth={auth} />
      <Navbar />
      <main className=" mx-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;