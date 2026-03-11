import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Save, Eye, ArrowLeft, X } from "lucide-react";
import styles from "./Write.module.css";

const CATEGORIES = ["Technology", "Design", "Culture", "Science", "Travel", "Food", "Health", "Business", "Other"];

function estimateReadTime(content) {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const updatePost = useMutation(api.posts.updatePost);

  const myPosts = useQuery(api.posts.getMyPosts, user ? { authorId: user.id } : "skip");

  const currentPost = myPosts?.find((p) => p._id === id);

  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentPost && !form) {
      setForm({
        title: currentPost.title,
        excerpt: currentPost.excerpt,
        content: currentPost.content,
        coverImage: currentPost.coverImage || "",
        category: currentPost.category,
        tags: currentPost.tags?.join(", ") || "",
        published: currentPost.published,
      });
    }
  }, [currentPost]);

  if (!form) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", paddingTop: "64px" }}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async (published) => {
    if (!form.title.trim()) return setError("Title is required");
    if (!form.content.trim()) return setError("Content is required");
    setSaving(true);
    setError("");
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      await updatePost({
        id: currentPost._id,
        title: form.title,
        slug: currentPost.slug,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage || undefined,
        category: form.category,
        tags,
        published,
        readTime: estimateReadTime(form.content),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={`container ${styles.toolbarInner}`}>
          <div className={styles.toolbarLeft}>
            <button onClick={() => navigate("/dashboard")} className={styles.backBtn} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              <ArrowLeft size={15} /> Dashboard
            </button>
          </div>
          <div className={styles.toolbarActions}>
            <button onClick={() => setPreview(!preview)} className={`${styles.toolbarBtn} ${preview ? styles.active : ""}`}>
              <Eye size={15} /> {preview ? "Edit" : "Preview"}
            </button>
            <button onClick={() => handleSave(false)} disabled={saving} className={styles.draftBtn}>
              <Save size={15} /> Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className={styles.publishBtn}>
              {saving ? "Saving..." : "Update & Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className={`container ${styles.formWrap}`}>
        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={() => setError("")}><X size={14} /></button>
          </div>
        )}

        {preview ? (
          <div className={styles.previewWrap}>
            <h1 className={styles.previewTitle}>{form.title}</h1>
            {form.coverImage && <img src={form.coverImage} alt="" className={styles.previewCover} />}
            <p className={styles.previewExcerpt}>{form.excerpt}</p>
            <div className="prose" dangerouslySetInnerHTML={{ __html: form.content }} />
          </div>
        ) : (
          <div className={styles.editor}>
            <div className={styles.mainEditor}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title</label>
                <input value={form.title} onChange={set("title")} className={styles.titleInput} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Excerpt</label>
                <textarea value={form.excerpt} onChange={set("excerpt")} rows={3} className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Content (HTML supported)</label>
                <textarea value={form.content} onChange={set("content")} rows={20} className={`${styles.input} ${styles.contentArea}`} />
              </div>
            </div>
            <aside className={styles.sideSettings}>
              <div className={styles.settingCard}>
                <h3 className={styles.settingTitle}>Settings</h3>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Category</label>
                  <select value={form.category} onChange={set("category")} className={styles.input}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tags (comma-separated)</label>
                  <input value={form.tags} onChange={set("tags")} className={styles.input} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Cover Image URL</label>
                  <input value={form.coverImage} onChange={set("coverImage")} className={styles.input} />
                  {form.coverImage && <img src={form.coverImage} alt="" className={styles.imagePreview} />}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
