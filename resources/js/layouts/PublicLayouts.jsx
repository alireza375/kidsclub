import React, { useState, useEffect } from 'react';
import Topbar from '../components/common/Topbar';
import Navbar from '../components/common/Navbar';
import { Outlet } from 'react-router-dom'; 
import Footer from '../components/common/Footer';
import Preloader from '../components/common/Preloader';

const PublicLayouts = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      setLoading(false);
  }, []);

  return (
    <div className=''>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <Topbar />
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
};

export default PublicLayouts;