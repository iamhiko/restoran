import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import './ItemList.css';
import { FaTrash } from "react-icons/fa"; 
import AddItemForm from "./AddItemForm";

function ItemList() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMaterial, setNewMaterial] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setMaterials(data.hammaddeler || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleAddMaterial = async () => {
    if (!newMaterial.trim()) return;
    
    try {
      const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
      const updatedMaterials = [...materials, newMaterial.trim().toUpperCase()];
      
      await updateDoc(docRef, {
        hammaddeler: updatedMaterials
      });
      
      setMaterials(updatedMaterials);
      setNewMaterial("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };

  const handleDeleteMaterial = async (index) => {
    try {
      const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
      const updatedMaterials = materials.filter((_, i) => i !== index);
      
      await updateDoc(docRef, {
        hammaddeler: updatedMaterials
      });
      
      setMaterials(updatedMaterials);
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="ItemList-Container">
      <div className="header">
        <h2>Hammadde Listesi</h2>
      </div>
      
      <div className="materials-container">
        {materials.length === 0 ? (
          <p>Listelenecek hammadde bulunamadı</p>
        ) : (
          <ul>
            {materials.map((item, index) => (
              <li className="hammaddeler" key={index}>
                {item}
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteMaterial(index)}
                >
                  <FaTrash></FaTrash> 
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {!isAdding ? (
          <button className="add-button" onClick={() => setIsAdding(true)}>
            + Ekle
          </button>
        ) : (
          <div className="add-form">
            <div className="add-form-buttons">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Hammadde adı"
                autoFocus
              />
              <button onClick={handleAddMaterial} className="itemlist-kaydet">Kaydet</button>
              <button onClick={() => setIsAdding(false)} className="itemlist-iptal">İptal</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemList;