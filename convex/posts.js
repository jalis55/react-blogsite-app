import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all published posts
export const getPublishedPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();
  },
});

// Get posts by category
export const getPostsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();
    return posts.filter((p) => p.category === args.category);
  },
});

// Get single post by slug
export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// Get posts by author
export const getMyPosts = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();
  },
});

// Create post
export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    authorId: v.string(),
    authorName: v.string(),
    authorImage: v.optional(v.string()),
    published: v.boolean(),
    readTime: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", { ...args, views: 0 });
  },
});

// Update post
export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
    readTime: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

// Delete post
export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Increment views
export const incrementViews = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post) {
      await ctx.db.patch(args.id, { views: post.views + 1 });
    }
  },
});

// Search posts
export const searchPosts = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    const term = args.searchTerm.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.excerpt.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
    );
  },
});
