import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLikes = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    return likes.length;
  },
});

export const getUserLike = query({
  args: { postId: v.id("posts"), userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("likes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userId", args.userId)
      )
      .unique();
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts"), userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userId", args.userId)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert("likes", { postId: args.postId, userId: args.userId });
      return true;
    }
  },
});
