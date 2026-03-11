import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import styles from "./Home.module.css";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "Travel", "Astronomy", "Design", "Technology", "Culture", "Science"];

export default function Home() {
  const posts = useQuery(api.posts.getPublishedPosts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  if (!posts) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  const featuredPost = posts[0];

  // Filter posts by active category
  const filteredPosts = posts.slice(1).filter((post) => {
    if (activeCategory !== "All" && post.category !== activeCategory) return false;
    return true;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className={styles.home}>
      {/* Latest Featured Hero */}
      {featuredPost && (
        <section
          className={styles.hero}
          style={{ backgroundImage: `url(${featuredPost.coverImage || ""})` }}
        >
          <div className={styles.heroOverlay} />
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.latestBadge}>Latest</div>
              <Link to={`/post/${featuredPost.slug}`}>
                <h1 className={styles.heroTitle}>{featuredPost.title}</h1>
              </Link>
              <p className={styles.heroSub}>{featuredPost.excerpt}</p>
              <Link to={`/post/${featuredPost.slug}`} className={styles.heroReadBtn}>
                Read Story →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Filter & Search Bar */}
      <section className={styles.filterBar}>
        <div className="container">
          <div className={styles.filterInner}>
            <div className={styles.categoryList}>
              <span className={styles.filterLabel}>Blogs:</span>
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
            <form onSubmit={handleSearch} className={styles.searchBox}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchIcon}>
                <Search size={18} color="#ffffff" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className={styles.gridSection}>
        <div className="container">
          {filteredPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No posts found{activeCategory !== "All" ? ` in "${activeCategory}"` : ""}.</p>
              {activeCategory !== "All" && (
                <button onClick={() => setActiveCategory("All")} className={styles.resetBtn}>
                  Show all posts
                </button>
              )}
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
