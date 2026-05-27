import PostcardCard from "./PostcardCard";
import type { Postcard } from "../types";

interface PostcardWallProps {
  postcards: Postcard[];
  loading: boolean;
  error?: string | null;
}

export default function PostcardWall({ postcards, loading, error }: PostcardWallProps) {
  return (
    <section className="postcard-wall">
      <h2 className="wall-title">The Postcard Wall</h2>
      <p className="wall-subtitle">
        Click any card to flip it over and read the message 💌
      </p>

      {error ? (
        <div className="wall-empty">
          <p>⚠️ Couldn't load postcards: {error}</p>
          <p style={{ fontSize: "1rem", marginTop: "1rem" }}>
            (This usually means Firestore rules need updating — see README)
          </p>
        </div>
      ) : loading ? (
        <div className="wall-loading">
          <span className="loading-spinner">🍼</span>
          <p>Loading postcards...</p>
        </div>
      ) : postcards.length === 0 ? (
        <div className="wall-empty">
          <p>No postcards yet — be the first to add one! ↓</p>
        </div>
      ) : (
        <div className="wall-grid">
          {postcards.map((postcard, index) => (
            <PostcardCard
              key={postcard.id}
              name={postcard.name}
              message={postcard.message}
              imageUrl={postcard.imageUrl}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}
