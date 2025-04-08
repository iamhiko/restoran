import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AddItemForm from "./AddItemForm";
import DeleteContent from "./DeleteContent";
import EditItemForm from "./EditItemForm";
import "./CategoryContent.css";
import { FaEdit, FaTimes } from 'react-icons/fa';

const categoryLabels = {
  drinks: "içecekler",
  desserts: "tatlılar",
  yiyecekler: "yiyecekler"
};

const CategoryContent = ({ selected }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selected) {
      const fetchData = async () => {
        try {
          const docRef = doc(db, "user1", "PR26tQ0OIeHmJ9Da7eqS");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            if (!data[selected]) {
              console.error(`Firestore'da "${selected}" kategorisi bulunamadı.`);
              setItems([]);
              return;
            }

            const itemsData = Object.entries(data[selected]).map(([key, value]) => ({
              id: key,
              name: value.name,
              description: value.description,
              ingredients: value.ingredients || [],
              price: value.price,
              collectionName: selected
            }));

            setItems(itemsData);
          } else {
            console.error("Firestore belgesi bulunamadı!");
          }
        } catch (error) {
          console.error("Veri çekme hatası: ", error);
        }
      };

      fetchData();
    }
  }, [selected]);

  const handleAddItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsEditing(false);
  };

  const handleSaveEdit = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setSelectedItem(updatedItem);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setSelectedItem(null);
  };

  return (
    <div className="category-content">
      {selected && (
        <div className="subcategory">
          <h3>{categoryLabels[selected] || selected}</h3>
          <AddItemForm category={selected} onAddItem={handleAddItem} />

          <div className="items-container">
            {items.length === 0 ? (
              <div className="loading">Yükleniyor...</div>
            ) : (
              items.map((item) => (
                <div
                  className="item-box"
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                >
                  {item.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedItem && !isEditing && (
        <div className="description-panel">
          <h3>{selectedItem.name}</h3>
          <p>{"Açıklama: " + selectedItem.description}</p>
          <p>{"İçindekiler: " + selectedItem.ingredients.join(", ")}</p>
          <p>{"Fiyat: " + selectedItem.price + " TL"}</p>

          <div className="button-container">
            <button onClick={() => setIsEditing(true)}>
              <FaEdit className="icon" /> Düzenle
            </button>
            <button onClick={() => setSelectedItem(null)}>
              <FaTimes className="icon" /> Kapat
            </button>
            <DeleteContent
              itemId={selectedItem.id}
              collectionName={selectedItem.collectionName}
              onDelete={handleDeleteItem}
            />
          </div>
        </div>
      )}

      {selectedItem && isEditing && (
        <div className="description-panel">
          <EditItemForm
            item={selectedItem}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryContent;