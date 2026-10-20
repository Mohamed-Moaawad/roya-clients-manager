// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

import { getAuth } from 'firebase/auth'

import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// ملحوظة: المشروع ده شغال بـ Vite مش Create React App، فمتغيرات البيئة
// بتتقرا بـ import.meta.env وازم تبدأ بـ VITE_ (مش process.env / REACT_APP_
// زي مشاريعك التانية) - ده الفرق الوحيد عن الطريقة اللي انت متعود عليها.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)
