import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import styles from "./Home.module.css";
import { ArrowRight, Zap, Search } from "lucide-react";

const CATEGORIES = ["All", "Technology", "Design", "Culture", "Science", "Travel", "Health", "Business"];

export default function Home() {
  const posts = useQuery(api.posts.getPublishedPosts);
  const [activeCategory, setActiveCategory] = useState("All");

  if (!posts) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className={styles.home}>
      {/* High-Impact Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>Over 500+ Published Stories</div>
            <h1 className={styles.heroTitle}>
              Where curiosity meets <br />
              <span className={styles.gradientText}>original perspectives.</span>
            </h1>
            <p className={styles.heroSub}>
              Discover articles on technology, design, science, and the human experience. 
              Write your own story and join a global community of thinkers.
            </p>
            <div className={styles.heroActions}>
              <Link to="/write" className={styles.primaryBtn}>Start Writing</Link>
              <a href="#latest" className={styles.secondaryBtn}>Browse Stories</a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section id="latest" className={styles.feed}>
        <div className="container">
          <div className={styles.feedHeader}>
            <h2 className={styles.sectionTitle}>Latest Stories</h2>
            <div className={styles.categories}>
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat} 
                  className={activeCategory === cat ? styles.catActive : styles.catBtn}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className={styles.grid}>
              {filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <h3>No posts found in this category</h3>
              <p>Try exploring other categories or check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
