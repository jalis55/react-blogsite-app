import { useQuery, useMutation } from "convex/react";
import { useUser, SignInButton } from "@clerk/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { PenLine, Eye, Edit, Trash2, Lock, Globe, BarChart2 } from "lucide-react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { isSignedIn, user } = useUser();
  const posts = useQuery(
    api.posts.getMyPosts,
    isSignedIn ? { authorId: user.id } : "skip"
  );
  const deletePost = useMutation(api.posts.deletePost);

  if (!isSignedIn) {
    return (
      <div className={styles.locked}>
        <div className={styles.lockedInner}>
          <h2>Sign in to view your Dashboard</h2>
          <SignInButton mode="modal">
            <button className={styles.signInBtn}>Sign In</button>
          </SignInButton>
        </div>
      </div>
    );
  }

  const published = posts?.filter((p) => p.published) || [];
  const drafts = posts?.filter((p) => !p.published) || [];
  const totalViews = posts?.reduce((sum, p) => sum + p.views, 0) || 0;

  const handleDelete = async (id) => {
    if (window.confirm("Delete this post? This cannot be undone.")) {
      await deletePost({ id });
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {user.imageUrl && (
              <img src={user.imageUrl} alt="" className={styles.userAvatar} />
            )}
            <div>
              <h1 className={styles.title}>
                {user.fullName || user.username}'s Dashboard
              </h1>
              <p className={styles.subtitle}>Manage your posts and track performance</p>
            </div>
          </div>
          <Link to="/write" className={styles.writeBtn}>
            <PenLine size={15} />
            New Post
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: "#4a9eff" }}>
              <Globe size={20} />
            </div>
            <div>
              <p className={styles.statValue}>{published.length}</p>
              <p className={styles.statLabel}>Published</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: "#e5c07b" }}>
              <Lock size={20} />
            </div>
            <div>
              <p className={styles.statValue}>{drafts.length}</p>
              <p className={styles.statLabel}>Drafts</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: "#c8a96e" }}>
              <Eye size={20} />
            </div>
            <div>
              <p className={styles.statValue}>{totalViews}</p>
              <p className={styles.statLabel}>Total Views</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: "#98c379" }}>
              <BarChart2 size={20} />
            </div>
            <div>
              <p className={styles.statValue}>{posts?.length || 0}</p>
              <p className={styles.statLabel}>All Posts</p>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        {!posts ? (
          <div className={styles.loading}>Loading...</div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <p>No posts yet. Start writing!</p>
            <Link to="/write" className={styles.writeBtn}>
              <PenLine size={15} /> Write Your First Post
            </Link>
          </div>
        ) : (
          <>
            {published.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Published Posts</h2>
                <div className={styles.postList}>
                  {published.map((post) => (
                    <PostRow key={post._id} post={post} onDelete={handleDelete} />
                  ))}
                </div>
              </section>
            )}

            {drafts.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Drafts</h2>
                <div className={styles.postList}>
                  {drafts.map((post) => (
                    <PostRow key={post._id} post={post} onDelete={handleDelete} isDraft />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PostRow({ post, onDelete, isDraft }) {
  return (
    <div className={`${styles.postRow} ${isDraft ? styles.draft : ""}`}>
      <div className={styles.postInfo}>
        <div className={styles.postStatus}>
          {isDraft ? (
            <span className={styles.draftBadge}><Lock size={10} /> Draft</span>
          ) : (
            <span className={styles.publishedBadge}><Globe size={10} /> Published</span>
          )}
          <span className={styles.postCategory}>{post.category}</span>
        </div>
        <Link to={`/post/${post.slug}`} className={styles.postTitle}>
          {post.title}
        </Link>
        <p className={styles.postMeta}>
          {formatDistanceToNow(new Date(post._creationTime), { addSuffix: true })}
          {" · "}
          <Eye size={11} style={{ display: "inline" }} /> {post.views} views
          {" · "}
          {post.readTime} min read
        </p>
      </div>

      <div className={styles.postActions}>
        <Link to={`/edit/${post._id}`} className={styles.editBtn}>
          <Edit size={15} />
          Edit
        </Link>
        <button onClick={() => onDelete(post._id)} className={styles.deleteBtn}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
