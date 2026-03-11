import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, Eye, Clock, ArrowLeft, Tag, Send, Trash2 } from "lucide-react";
import styles from "./BlogPost.module.css";

export default function BlogPost() {
  const { slug } = useParams();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const post = useQuery(api.posts.getPostBySlug, { slug });
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const incrementViews = useMutation(api.posts.incrementViews);
  const addComment = useMutation(api.comments.addComment);
  const deleteComment = useMutation(api.comments.deleteComment);
  const toggleLike = useMutation(api.likes.toggleLike);

  const comments = useQuery(
    api.comments.getComments,
    post ? { postId: post._id } : "skip"
  );
  const likeCount = useQuery(
    api.likes.getLikes,
    post ? { postId: post._id } : "skip"
  );
  const userLike = useQuery(
    api.likes.getUserLike,
    post && isSignedIn ? { postId: post._id, userId: user.id } : "skip"
  );

  useEffect(() => {
    if (post?._id) {
      incrementViews({ id: post._id });
    }
  }, [post?._id]);

  const handleLike = async () => {
    if (!isSignedIn || !post) return;
    await toggleLike({ postId: post._id, userId: user.id });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !isSignedIn || !post) return;
    setSubmitting(true);
    try {
      await addComment({
        postId: post._id,
        authorId: user.id,
        authorName: user.fullName || user.username || "Anonymous",
        authorImage: user.imageUrl,
        content: comment.trim(),
      });
      setComment("");
    } finally {
      setSubmitting(false);
    }
  };

  if (post === undefined) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className={styles.notFound}>
        <h1>Post not found</h1>
        <Link to="/" className={styles.backLink}><ArrowLeft size={16} /> Back to home</Link>
      </div>
    );
  }

  return (
    <article className={styles.article}>
      {/* Back nav */}
      <div className={`container ${styles.topNav}`}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <span className={styles.category}>{post.category}</span>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>

            <div className={styles.metaRow}>
              <div className={styles.author}>
                {post.authorImage ? (
                  <img src={post.authorImage} alt={post.authorName} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarFallback}>{post.authorName?.[0]?.toUpperCase()}</div>
                )}
                <div>
                  <p className={styles.authorName}>{post.authorName}</p>
                  <p className={styles.authorDate}>
                    {formatDistanceToNow(new Date(post._creationTime), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className={styles.stats}>
                <span className={styles.stat}><Clock size={14} /> {post.readTime} min</span>
                <span className={styles.stat}><Eye size={14} /> {post.views}</span>
                <button
                  onClick={handleLike}
                  className={`${styles.likeBtn} ${userLike ? styles.liked : ""}`}
                >
                  <Heart size={14} fill={userLike ? "currentColor" : "none"} />
                  {likeCount || 0}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className={styles.coverWrap}>
          <div className="container">
            <img src={post.coverImage} alt={post.title} className={styles.cover} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container">
        <div className={styles.layout}>
          <div
            className={`${styles.content} prose`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Like */}
            <div className={styles.sideCard}>
              <button
                onClick={handleLike}
                className={`${styles.bigLikeBtn} ${userLike ? styles.liked : ""}`}
              >
                <Heart size={24} fill={userLike ? "currentColor" : "none"} />
                <span>{likeCount || 0} likes</span>
              </button>
              {!isSignedIn && (
                <p className={styles.sideNote}>
                  <SignInButton mode="modal">
                    <span className={styles.signInLink}>Sign in</span>
                  </SignInButton>{" "}
                  to like this post
                </p>
              )}
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Tags</h3>
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      <Tag size={11} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author card */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Author</h3>
              <div className={styles.authorCard}>
                {post.authorImage ? (
                  <img src={post.authorImage} alt={post.authorName} className={styles.authorBigAvatar} />
                ) : (
                  <div className={styles.authorBigFallback}>{post.authorName?.[0]?.toUpperCase()}</div>
                )}
                <p className={styles.authorBigName}>{post.authorName}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Comments */}
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>
            Comments <span className={styles.commentCount}>{comments?.length || 0}</span>
          </h2>

          {isSignedIn ? (
            <form onSubmit={handleComment} className={styles.commentForm}>
              <div className={styles.commentInputRow}>
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="" className={styles.commentAvatar} />
                ) : (
                  <div className={styles.commentAvatarFallback}>{user.fullName?.[0]?.toUpperCase()}</div>
                )}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className={styles.commentTextarea}
                  rows={3}
                />
              </div>
              <div className={styles.commentActions}>
                <button type="submit" disabled={submitting || !comment.trim()} className={styles.submitBtn}>
                  <Send size={14} />
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.signInPrompt}>
              <SignInButton mode="modal">
                <button className={styles.signInPromptBtn}>Sign in to comment</button>
              </SignInButton>
            </div>
          )}

          <div className={styles.commentList}>
            {comments?.map((c) => (
              <div key={c._id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <div className={styles.commentAuthor}>
                    {c.authorImage ? (
                      <img src={c.authorImage} alt={c.authorName} className={styles.commentAvatar} />
                    ) : (
                      <div className={styles.commentAvatarFallback}>{c.authorName?.[0]?.toUpperCase()}</div>
                    )}
                    <div>
                      <p className={styles.commentName}>{c.authorName}</p>
                      <p className={styles.commentDate}>
                        {formatDistanceToNow(new Date(c._creationTime), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {isSignedIn && user.id === c.authorId && (
                    <button
                      onClick={() => deleteComment({ id: c._id })}
                      className={styles.deleteCommentBtn}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className={styles.commentContent}>{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
