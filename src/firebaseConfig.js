// firebaseConfig.js

// Firebase modüllerini import et
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Firestore modülünü import ettik

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyC84L4RdBH92VSgOqHNjyq7lwNvFX7Qo6o",
  authDomain: "firstbar-d6988.firebaseapp.com",
  projectId: "firstbar-d6988",
  storageBucket: "firstbar-d6988.firebasestorage.app",
  messagingSenderId: "949606820897",
  appId: "1:949606820897:web:bd1001edc6e68d872b8760",
  measurementId: "G-HJ1MQT10H4"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanı bağlantısını al
const db = getFirestore(app);  // getFirestore fonksiyonu ile Firestore'u alıyoruz

export { db };  // Firestore veritabanı referansını export ediyoruz
