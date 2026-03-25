import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import CryptoJS from "crypto-js";

const FIREBASE_CONFIG = CryptoJS.enc.Base64.parse(
  import.meta.env.VITE_FIREBASE_CONFIG,
);

export function getFirebaseConfig(configKey: string) {
  return JSON.parse(configKey);
}

const app = initializeApp(
  getFirebaseConfig(FIREBASE_CONFIG.toString(CryptoJS.enc.Utf8)),
);

export function getAuthInstance() {
  return getAuth(app);
}
