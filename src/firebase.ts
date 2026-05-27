import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import type { Postcard } from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "alaa-congrats");
const storage = getStorage(app);

const postcardsCollection = collection(db, "postcards");

export async function uploadImage(file: File): Promise<string> {
  const filename = `postcards/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filename);
  console.log("[Firebase] Uploading image:", filename);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  console.log("[Firebase] Image uploaded, URL:", url);
  return url;
}

export async function addPostcard(
  data: Omit<Postcard, "id" | "createdAt">
): Promise<string> {
  const payload = {
    ...data,
    createdAt: Date.now(), // plain number — simpler than serverTimestamp
  };
  console.log("[Firebase] Writing postcard to Firestore:", payload);
  const docRef = await addDoc(postcardsCollection, payload);
  console.log("[Firebase] Postcard written, doc ID:", docRef.id);
  return docRef.id;
}

export function subscribeToPostcards(
  callback: (postcards: Postcard[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(postcardsCollection, orderBy("createdAt", "desc"));
  console.log("[Firebase] Subscribing to postcards...");
  return onSnapshot(
    q,
    (snapshot) => {
      console.log("[Firebase] Snapshot received, docs:", snapshot.docs.length);
      const postcards = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Postcard[];
      callback(postcards);
    },
    (error) => {
      console.error("[Firebase] Firestore error:", error.code, error.message);
      onError?.(error);
    }
  );
}

export function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
}
