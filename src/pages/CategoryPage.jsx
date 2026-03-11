import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "../components/PostCard";
import { ArrowLeft } from "lucide-react";
import styles from "./CategoryPage.module.css";

export default function CategoryPage() {
  const { category } = useParams();
  const posts = useQuery(api.posts.getPostsByCategory, { category });

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <Link to="/" className={styles.back}>
            <ArrowLeft size={16} /> All Posts
          </Link>
          <h1 className={styles.title}>{category}</h1>
          <p className={styles.subtitle}>
            {posts?.length || 0} {posts?.length === 1 ? "post" : "posts"} in this category
          </p>
        </div>

        {!posts ? (
          <div className={styles.loading}>Loading...</div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <p>No posts in {category} yet.</p>
            <Link to="/write" className={styles.writeLink}>Be the first to write one →</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
