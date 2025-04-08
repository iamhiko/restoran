import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ItemList from './ItemList.jsx';




createRoot(document.getElementById('root')).render(
  <StrictMode>
       
        <ItemList />
        <Navbar />
        <App />
        <Footer />

  </StrictMode>
);