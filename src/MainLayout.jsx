import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ItemList from "./ItemList.jsx";

const MainLayout = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="main-layout">
      <Navbar user={user} />
      <Outlet />
      <Footer />
      <ItemList />
    </div>
  );
};

export default MainLayout;