import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"
//
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// FireBase
const firebaseConfig = {
  apiKey: "AIzaSyA9l_zsA1W4wr7v76dI64eCycus8aJJXnM",
  authDomain: "tetris-app-a4d64.firebaseapp.com",
  databaseURL: "https://tetris-app-a4d64-default-rtdb.firebaseio.com",
  projectId: "tetris-app-a4d64",
  storageBucket: "tetris-app-a4d64.appspot.com",
  messagingSenderId: "905245888322",
  appId: "1:905245888322:web:f64506a32c475e790502db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getDatabase(app)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


