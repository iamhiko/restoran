import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Authentication
import { db } from "./firebaseConfig"; // Firebase Firestore
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import CategoryContent from "./CategoryContent.jsx";
import Navbar from "./Navbar.jsx";
import ItemList from "./ItemList.jsx";
import './HomeContent.css';
const HomeContent = () => {
  const [selected, setSelected] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true); // Yükleniyor durumu
  const navigate = useNavigate();
  
  // Kullanıcı doğrulaması
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        navigate("/login");
      } else {
        // Kullanıcı giriş yaptıysa kategorileri al
        fetchCategories();
      }
    });
  }, [navigate]);

  // Firebase'den kategorileri al
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
    } finally {
      setLoading(false); // Yükleme işlemi bitti
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
      
      {/* Yükleniyor durumu */}
      {loading ? (
        <div>Loading...</div>
      ) : (
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
        
      )}

      <div className="category-form">
        <input
          type="text"
          placeholder="Yeni kategori ismi..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Kategori Ekle</button>
      </div>

      {/* Seçilen kategori içeriği */}
      {selected && <CategoryContent selected={selected} />}
    </div>
    
  );
};

export default HomeContent;
