import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Zap, Folder } from "lucide-react";
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

export default function PostCard({ post }) {
  const date = new Date(post._creationTime);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className={styles.card}>
      <Link to={`/post/${post.slug}`} className={styles.imageContainer}>
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <Zap size={32} />
          </div>
        )}
        <div className={styles.categoryBadge}>{post.category}</div>
      </Link>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <time className={styles.date}>{formattedDate}</time>
          <span className={styles.separator}>•</span>
          <span className={styles.readTime}>5 min read</span>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className={styles.title}>{post.title}</h3>
        </Link>
        
        <p className={styles.excerpt}>{post.excerpt}</p>

        <div className={styles.authorRow}>
          <div className={styles.authorAvatar}>
            {post.authorName?.[0] || 'A'}
          </div>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.authorName || 'Anonymous'}</span>
            <span className={styles.authorRole}>Contributor</span>
          </div>
        </div>
      </div>
    </article>
  );
}
