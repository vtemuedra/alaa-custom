import { useEffect, useState } from "react";
import { subscribeToPostcards, isFirebaseConfigured } from "../firebase";
import type { Postcard } from "../types";

// Demo postcards shown when Firebase is not configured
const DEMO_POSTCARDS: Postcard[] = [
  {
    id: "demo-1",
    name: "Sarah",
    message:
      "Congratulations Alaa & Partner Placeholder! Little Placeholder Name For Baby is so lucky to have you both. Can't wait to meet the little one! 🥰",
    imageUrl:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "demo-2",
    name: "Marcus",
    message:
      "Welcome to the world, Placeholder Name For Baby! Wishing your family all the love and sleepless nights (the good kind!) 😄🍼",
    imageUrl:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop",
    createdAt: Date.now() - 172800000,
  },
  {
    id: "demo-3",
    name: "Priya",
    message:
      "What wonderful news! Placeholder Name For Baby is going to bring so much joy. Enjoy every moment — they grow up so fast! 💛",
    imageUrl:
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=400&h=300&fit=crop",
    createdAt: Date.now() - 259200000,
  },
  {
    id: "demo-4",
    name: "James",
    message:
      "Huge congrats to the whole family! Placeholder Name For Baby already has the best parents. Here's to new adventures! 🎉",
    imageUrl:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
    createdAt: Date.now() - 345600000,
  },
];

export function usePostcards() {
  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setPostcards(DEMO_POSTCARDS);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToPostcards((data) => {
      setPostcards(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { postcards, loading };
}
