import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    authorId: v.string(),
    authorName: v.string(),
    authorImage: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", args);
  },
});

export const deleteComment = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
