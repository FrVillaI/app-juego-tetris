import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import {getDatabase} from "firebase/database" 
//
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// FireBase
const firebaseConfig = {
  apiKey: "AIzaSyA79_g1c_pLas4Hw14anM1doK9RhhwO0Ww",
  authDomain: "app-tetris-286a6.firebaseapp.com",
  databaseURL: "https://app-tetris-286a6-default-rtdb.firebaseio.com",
  projectId: "app-tetris-286a6",
  storageBucket: "app-tetris-286a6.appspot.com",
  messagingSenderId: "442306324964",
  appId: "1:442306324964:web:569c21e64b54ae4575bff1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage=getStorage(app);
export const db= getDatabase(app)

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
