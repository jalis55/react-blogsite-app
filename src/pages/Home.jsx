import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import styles from "./Home.module.css";
import { ArrowRight, Zap } from "lucide-react";

const CATEGORIES = ["Technology", "Design", "Culture", "Science", "Travel", "Health", "Business"];

export default function Home() {
  const posts = useQuery(api.posts.getPublishedPosts);

  if (!posts) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <p>Loading posts...</p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1, 7);
  const recentPosts = posts.slice(7, 13);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Zap size={12} />
              Real-time powered by Convex
            </div>
            <h1 className={styles.heroTitle}>
              Ideas worth
              <br />
              <em>reading about.</em>
            </h1>
            <p className={styles.heroSub}>
              Discover thoughtful writing from curious minds. Stories, insights,
              and perspectives that expand your world.
            </p>
            <div className={styles.heroActions}>
              <Link to="/write" className={styles.heroCta}>
                Start Writing
                <ArrowRight size={16} />
              </Link>
              <a href="#latest" className={styles.heroSecondary}>
                Browse Posts
              </a>
            </div>
          </div>
        </div>
        <div className={styles.heroBg} aria-hidden="true" />
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <div className="container">
          <div className={styles.categoryList}>
            {CATEGORIES.map((cat) => (
              <Link key={cat} to={`/category/${cat}`} className={styles.categoryChip}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className={styles.featured}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured</h2>
              <div className={styles.sectionLine} />
            </div>
            <div className={styles.featuredGrid}>
              <PostCard post={featuredPost} featured />
            </div>
          </div>
        </section>
      )}

      {/* Grid Posts */}
      {gridPosts.length > 0 && (
        <section id="latest" className={styles.grid}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Latest Stories</h2>
              <div className={styles.sectionLine} />
            </div>
            <div className={styles.postsGrid}>
              {gridPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More Posts */}
      {recentPosts.length > 0 && (
        <section className={styles.more}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>More to Read</h2>
              <div className={styles.sectionLine} />
            </div>
            <div className={styles.postsGrid}>
              {recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✦</div>
          <h2>No Posts Yet</h2>
          <p>Be the first to share your ideas with the world.</p>
          <Link to="/write" className={styles.heroCta}>
            Write the first post
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
