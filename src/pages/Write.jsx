import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PenLine, Eye, Save, X } from "lucide-react";
import styles from "./Write.module.css";

const CATEGORIES = ["Technology", "Design", "Culture", "Science", "Travel", "Food", "Health", "Business", "Other"];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

function estimateReadTime(content) {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Write() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const createPost = useMutation(api.posts.createPost);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "Technology",
    tags: "",
    published: false,
  });
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isSignedIn) {
    return (
      <div className={styles.locked}>
        <div className={styles.lockedInner}>
          <div className={styles.lockIcon}>✦</div>
          <h2>Sign in to Write</h2>
          <p>Join Inkwell to share your ideas with the world.</p>
          <SignInButton mode="modal">
            <button className={styles.signInBtn}>Sign In to Continue</button>
          </SignInButton>
        </div>
      </div>
    );
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (published) => {
    if (!form.title.trim()) return setError("Title is required");
    if (!form.excerpt.trim()) return setError("Excerpt is required");
    if (!form.content.trim()) return setError("Content is required");

    setSaving(true);
    setError("");
    try {
      const slug = slugify(form.title) + "-" + Date.now().toString(36);
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      await createPost({
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt.trim(),
        content: form.content,
        coverImage: form.coverImage || undefined,
        category: form.category,
        tags,
        authorId: user.id,
        authorName: user.fullName || user.username || "Anonymous",
        authorImage: user.imageUrl,
        published,
        readTime: estimateReadTime(form.content),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={`container ${styles.toolbarInner}`}>
          <div className={styles.toolbarLeft}>
            <PenLine size={18} className={styles.toolbarIcon} />
            <span className={styles.toolbarTitle}>New Post</span>
          </div>
          <div className={styles.toolbarActions}>
            <button
              onClick={() => setPreview(!preview)}
              className={`${styles.toolbarBtn} ${preview ? styles.active : ""}`}
            >
              <Eye size={15} />
              {preview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className={styles.draftBtn}
            >
              <Save size={15} />
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className={styles.publishBtn}
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className={`container ${styles.formWrap}`}>
        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={() => setError("")}><X size={14} /></button>
          </div>
        )}

        {preview ? (
          <div className={styles.previewWrap}>
            <h1 className={styles.previewTitle}>{form.title || "Post Title"}</h1>
            {form.coverImage && (
              <img src={form.coverImage} alt="" className={styles.previewCover} />
            )}
            <p className={styles.previewExcerpt}>{form.excerpt}</p>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, "<br/>") }}
            />
          </div>
        ) : (
          <div className={styles.editor}>
            <div className={styles.mainEditor}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title *</label>
                <input
                  value={form.title}
                  onChange={set("title")}
                  placeholder="Give your post a compelling title..."
                  className={styles.titleInput}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Excerpt *</label>
                <textarea
                  value={form.excerpt}
                  onChange={set("excerpt")}
                  placeholder="A short summary that draws readers in..."
                  rows={3}
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Content *</label>
                <p className={styles.hint}>You can write HTML for rich formatting. Use &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;blockquote&gt;, etc.</p>
                <textarea
                  value={form.content}
                  onChange={set("content")}
                  placeholder="Write your post here... You can use HTML tags for formatting."
                  rows={20}
                  className={`${styles.input} ${styles.contentArea}`}
                />
              </div>
            </div>

            <aside className={styles.sideSettings}>
              <div className={styles.settingCard}>
                <h3 className={styles.settingTitle}>Post Settings</h3>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Category</label>
                  <select value={form.category} onChange={set("category")} className={styles.input}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tags</label>
                  <input
                    value={form.tags}
                    onChange={set("tags")}
                    placeholder="react, webdev, tutorial"
                    className={styles.input}
                  />
                  <p className={styles.hint}>Comma-separated</p>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Cover Image URL</label>
                  <input
                    value={form.coverImage}
                    onChange={set("coverImage")}
                    placeholder="https://..."
                    className={styles.input}
                  />
                  {form.coverImage && (
                    <img src={form.coverImage} alt="" className={styles.imagePreview} />
                  )}
                </div>
              </div>

              <div className={styles.settingCard}>
                <h3 className={styles.settingTitle}>Author</h3>
                <div className={styles.authorInfo}>
                  {user.imageUrl && (
                    <img src={user.imageUrl} alt="" className={styles.authorAvatar} />
                  )}
                  <span className={styles.authorName}>{user.fullName || user.username}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
