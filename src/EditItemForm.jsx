// EditItemForm.js
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import './EditItemForm.css'

import { doc, updateDoc, deleteField } from "firebase/firestore";

const EditItemForm = ({ item, onSave, onCancel }) => {
  const [editedItem, setEditedItem] = useState({
    name: item.name,
    description: item.description,
    ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(", ") : item.ingredients,
    price: item.price
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      // Ana belge referansı
      const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
      
      // Ingredients'i diziye çevir
      const ingredientsArray = editedItem.ingredients
        .split(",")
        .map(item => item.trim());

      // Güncellenen öğe objesi
      const updatedItem = {
        name: editedItem.name,
        description: editedItem.description,
        ingredients: ingredientsArray,
        price: editedItem.price
      };

      // Eğer isim değiştiyse, eski öğeyi silip yenisini ekleyelim
      const updates = {};
      if (editedItem.name !== item.name) {
        updates[`${item.collectionName}.${item.name}`] = deleteField();
      }
      updates[`${item.collectionName}.${editedItem.name}`] = updatedItem;

      // Firestore'da güncelleme yap
      await updateDoc(docRef, updates);

      // Üst bileşene güncellenmiş öğeyi iletiyoruz
      onSave({
        ...updatedItem,
        id: editedItem.name,
        collectionName: item.collectionName
      });
      
    } catch (error) {
      console.error("Düzenleme hatası: ", error);
    }
  };

  return (
    <div className="edit-item-form">
      <input
        type="text"
        name="name"
        value={editedItem.name}
        onChange={handleInputChange}
        placeholder="Ad"
      />
      <input
        name="description"
        value={editedItem.description}
        onChange={handleInputChange}
        placeholder="Açıklama"
      />
      <input
        name="price"
        value={editedItem.price}
        onChange={handleInputChange}
        placeholder="Fiyat"
      />
      <div className="button-group">
        <button onClick={handleSaveChanges}>Kaydet</button>
        <button onClick={onCancel}>İptal</button>
      </div>
    </div>
  );
};

export default EditItemForm;