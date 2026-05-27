import Hero from "./components/Hero";
import TransitionSection from "./components/TransitionSection";
import PostcardWall from "./components/PostcardWall";
import PostcardForm from "./components/PostcardForm";
import Footer from "./components/Footer";
import { usePostcards } from "./hooks/usePostcards";
import "./App.css";

export default function App() {
  const { postcards, loading } = usePostcards();

  return (
    <div className="app">
      <Hero />
      <TransitionSection />
      <PostcardWall postcards={postcards} loading={loading} />
      <PostcardForm />
      <Footer />
    </div>
  );
}
