import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import {getDatabase} from "firebase/database" 
//
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// FireBase
const firebaseConfig = {
  apiKey: "AIzaSyCr3icEja3B45Z1hBGSF1mii696EXFIT9o",
  authDomain: "taller-173fd.firebaseapp.com",
  databaseURL: "https://taller-173fd-default-rtdb.firebaseio.com",
  projectId: "taller-173fd",
  storageBucket: "taller-173fd.appspot.com",
  messagingSenderId: "349541614927",
  appId: "1:349541614927:web:7197ed0dcf6599d0f1b13a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage=getStorage(app);
export const db= getDatabase(app)

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
