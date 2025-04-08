import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import './AddItemForm.css';
import { FaPlus } from 'react-icons/fa';

const AddItemForm = ({ category, onAddItem }) => {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    ingredients: [],
    price: ""
  });
  const [isAdding, setIsAdding] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Hammaddeleri gerçek zamanlı yükle
  useEffect(() => {
    const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAvailableIngredients(docSnap.data().hammaddeler || []);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleAddItem = async () => {
    try {
      if (!category || !newItem.name.trim()) return;

      const itemToAdd = {
        name: newItem.name,
        description: newItem.description,
        ingredients: selectedIngredients,
        price: newItem.price
      };

      const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
      await updateDoc(docRef, {
        [`${category}.${newItem.name}`]: itemToAdd
      });

      onAddItem({
        id: newItem.name,
        ...itemToAdd,
        collectionName: category
      });

      // Formu sıfırla
      setNewItem({ name: "", description: "", ingredients: [], price: "" });
      setSelectedIngredients([]);
      setIsAdding(false);
    } catch (error) {
      console.error("Ürün eklenemedi:", error);
    }
  };

  const getLabel = (key) => {
    switch (key) {

      default:
        return "Ürün";
    }
  };

  return (
    <div>
      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className="add-item-btn">
          <FaPlus className="icon" />
          {getLabel(category)} Ekle
        </button>
      ) : (
        <div className="add-item-form">
          <div className="ingredients-section">
            <h4>Hammaddeleri Seçin</h4>
            <div className="ingredients-grid">
              {availableIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`ingredient-item ${selectedIngredients.includes(ingredient) ? 'selected' : ''}`}
                  onClick={() => handleIngredientSelect(ingredient)}
                >
                  {ingredient}
                </div>
              ))}
            </div>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Ürün Adı"
            value={newItem.name}
            onChange={handleInputChange}
          />
          <input
            name="description"
            placeholder="Açıklama"
            value={newItem.description}
            onChange={handleInputChange}
          />
          <input
            name="price"
            placeholder="Fiyat"
            value={newItem.price}
            onChange={handleInputChange}
          />

          <div className="button-group">
            <button onClick={handleAddItem}>Ekle</button>
            <button onClick={() => setIsAdding(false)}>İptal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddItemForm;