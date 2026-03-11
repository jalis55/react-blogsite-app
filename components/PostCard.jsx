import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Eye, Clock } from "lucide-react";
import styles from "./PostCard.module.css";

const CATEGORY_COLORS = {
  Technology: "#4a9eff",
  Design: "#c678dd",
  Culture: "#e5c07b",
  Science: "#98c379",
  Travel: "#56b6c2",
  Food: "#e06c75",
  Health: "#98c379",
  Business: "#d19a66",
  Other: "#abb2bf",
};

export default function PostCard({ post, featured = false }) {
  const categoryColor = CATEGORY_COLORS[post.category] || "#abb2bf";
  const date = new Date(post._creationTime);

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ""}`}>
      {post.coverImage && (
        <Link to={`/post/${post.slug}`} className={styles.imageWrap}>
          <img src={post.coverImage} alt={post.title} className={styles.image} />
        </Link>
      )}
      {!post.coverImage && (
        <Link to={`/post/${post.slug}`} className={styles.imageWrap}>
          <div className={styles.placeholder} style={{ background: `${categoryColor}15` }}>
            <span style={{ color: categoryColor, fontSize: featured ? "3rem" : "2rem" }}>
              {post.category === "Technology" ? "⚡" :
               post.category === "Design" ? "✦" :
               post.category === "Science" ? "🔬" :
               post.category === "Culture" ? "🎭" : "📝"}
            </span>
          </div>
        </Link>
      )}

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category} style={{ color: categoryColor, borderColor: `${categoryColor}40` }}>
            {post.category}
          </span>
          <span className={styles.metaText}>
            <Clock size={12} />
            {post.readTime} min read
          </span>
          <span className={styles.metaText}>
            <Eye size={12} />
            {post.views}
          </span>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h2 className={styles.title}>{post.title}</h2>
        </Link>

        <p className={styles.excerpt}>{post.excerpt}</p>

        <div className={styles.footer}>
          <div className={styles.author}>
            {post.authorImage ? (
              <img src={post.authorImage} alt={post.authorName} className={styles.avatar} />
            ) : (
              <div className={styles.avatarFallback}>
                {post.authorName?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className={styles.authorName}>{post.authorName}</p>
              <p className={styles.date}>{formatDistanceToNow(date, { addSuffix: true })}</p>
            </div>
          </div>

          <Link to={`/post/${post.slug}`} className={styles.readMore}>
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}
