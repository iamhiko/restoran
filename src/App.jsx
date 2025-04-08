import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar.jsx";
import CategoryContent from "./CategoryContent.jsx";
import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { FaTrash } from "react-icons/fa";

const App = () => {
  const [selected, setSelected] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const filteredKeys = Object.keys(data).filter((key) => key !== "hammaddeler");
        setCategories(filteredKeys);
      } else {
        console.error("Belge bulunamadı");
      }
    } catch (error) {
      console.error("Kategori verisi alınamadı: ", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const categoryKey = newCategory.trim().toLowerCase();

    if (categories.includes(categoryKey)) {
      alert("Bu kategori zaten var.");
      return;
    }

    try {
      const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
      await updateDoc(docRef, {
        [categoryKey]: {}
      });

      setCategories((prev) => [...prev, categoryKey]);
      setNewCategory("");
    } catch (error) {
      console.error("Kategori eklenirken hata oluştu: ", error);
    }
  };

  const handleDeleteCategory = async (categoryKey) => {
    const confirmed = window.confirm(`"${categoryKey}" kategorisini silmek istediğinizden emin misiniz?`);
    if (!confirmed) return;

    try {
      const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
      await updateDoc(docRef, {
        [categoryKey]: deleteField()
      });

      setCategories((prev) => prev.filter((cat) => cat !== categoryKey));
      if (selected === categoryKey) {
        setSelected(null);
      }
    } catch (error) {
      console.error("Kategori silinirken hata oluştu: ", error);
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div className="category-list">
        {categories.map((category) => (
          <div key={category} className="category-wrapper">
            <div
              className={`category ${selected === category ? "active" : ""}`}
              onClick={() => setSelected(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
            <button
              className="delete-category-btn"
              onClick={() => handleDeleteCategory(category)}
              title="Sil"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="category-form">
        <input
          type="text"
          placeholder="Yeni kategori ismi..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Kategori Ekle</button>
      </div>

      {selected && <CategoryContent selected={selected} />}
    </div>
  );
};

export default App;
