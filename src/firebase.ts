import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
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
const db = getFirestore(app);
const storage = getStorage(app);

const postcardsCollection = collection(db, "postcards");

export async function uploadImage(file: File): Promise<string> {
  const filename = `postcards/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function addPostcard(
  data: Omit<Postcard, "id" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(postcardsCollection, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function subscribeToPostcards(
  callback: (postcards: Postcard[]) => void
) {
  const q = query(postcardsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const postcards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toMillis?.() ?? Date.now(),
    })) as Postcard[];
    callback(postcards);
  });
}

export function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
}
