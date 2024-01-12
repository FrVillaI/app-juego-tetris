import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import {getDatabase} from "firebase/database" 
//
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// FireBase
const firebaseConfig = {
  apiKey: "AIzaSyDMlKaK08VR3Y1hd7XBl97dk7ELY0n880w",
  authDomain: "app-preuba-iv.firebaseapp.com",
  databaseURL: "https://app-preuba-iv-default-rtdb.firebaseio.com",
  projectId: "app-preuba-iv",
  storageBucket: "app-preuba-iv.appspot.com",
  messagingSenderId: "849481760885",
  appId: "1:849481760885:web:f51392fc5358ed8f90b83c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage=getStorage(app);
export const db= getDatabase(app)

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });