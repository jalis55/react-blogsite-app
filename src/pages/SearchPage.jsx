import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "../components/PostCard";
import { Search, ArrowLeft } from "lucide-react";
import styles from "./CategoryPage.module.css";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const results = useQuery(api.posts.searchPosts, { searchTerm: q });

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <Link to="/" className={styles.back}>
            <ArrowLeft size={16} /> Home
          </Link>
          <h1 className={styles.title} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Search size={28} style={{ color: "var(--accent)" }} />
            "{q}"
          </h1>
          <p className={styles.subtitle}>
            {results?.length || 0} {results?.length === 1 ? "result" : "results"} found
          </p>
        </div>

        {!results ? (
          <div className={styles.loading}>Searching...</div>
        ) : results.length === 0 ? (
          <div className={styles.empty}>
            <p>No results for "{q}"</p>
            <Link to="/" className={styles.writeLink}>← Back to all posts</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {results.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
