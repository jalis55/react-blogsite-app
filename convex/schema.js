import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
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
    views: v.number(),
    readTime: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_author", ["authorId"])
    .index("by_published", ["published"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.string(),
    authorName: v.string(),
    authorImage: v.optional(v.string()),
    content: v.string(),
  }).index("by_post", ["postId"]),

  likes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_post_user", ["postId", "userId"]),
});
