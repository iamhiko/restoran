import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import MainLayout from "./MainLayout.jsx";
import HomeContent from "./HomeContent.jsx";
import ItemList from "./ItemList.jsx";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomeContent />} />
        <Route path="main" element={<HomeContent />} />
        <Route path="items" element={<ItemList />} />
      </Route>
    </Routes>
  );
};

export default App;