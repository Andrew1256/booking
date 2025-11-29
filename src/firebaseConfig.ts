// src/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// (опціонально) import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyCzOtESfmmwqa3zPhC88T6rmbyeL0p6WDA",
    authDomain: "booking-app-c5a48.firebaseapp.com",
    projectId: "booking-app-c5a48",
    storageBucket: "booking-app-c5a48.appspot.com",
    messagingSenderId: "316995746590",
    appId: "1:316995746590:web:9fffbfcf9f95252a4b270f",
    measurementId: "G-V8D2CWW04T"
};

const app = initializeApp(firebaseConfig);

// Імпортуємо ці сервіси у проєкті
export const auth = getAuth(app);
export const db = getFirestore(app);

// Якщо потрібна аналітика (тільки у браузерах з HTTPS):
// export const analytics = getAnalytics(app);
