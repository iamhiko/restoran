import React from "react";
import { db } from "./firebaseConfig";
import { doc, updateDoc, deleteField } from "firebase/firestore"; // deleteField eklendi
import './CategoryContent.css';
import { FaTrash } from 'react-icons/fa';

const DeleteContent = ({ itemId, collectionName, onDelete }) => {
  const handleDelete = async () => {
    try {
      if (!window.confirm("Bu öğeyi silmek istediğinize emin misiniz?")) {
        return;
      }

      // Ana belge referansı
      const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
      
      // Firestore'da ilgili alanı güncelle (silinecek öğeyi kaldır)
      await updateDoc(docRef, {
        [`${collectionName}.${itemId}`]: deleteField() // deleteField artık tanımlı
      });

      console.log("Item deleted successfully");

      // Üst bileşene silme işlemini bildir
      onDelete(itemId);

    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div>
      <button onClick={handleDelete}><FaTrash className="icon" />Sil</button>
    </div>
  );
};

export default DeleteContent;