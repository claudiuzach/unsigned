import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  songs: defineTable({
    audioStorageId: v.optional(v.id('_storage')),
    user: v.id('users'),
    songTitle: v.string(),
    songDescription: v.string(),
    audioUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id('_storage')),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    imagePrompt: v.string(),
    audioDuration: v.number(),
    views: v.number(),
    category: v.string(),
    userInteractions: v.optional(v.string()), // Store JSON as a string
    createdAt: v.optional(v.number()), // Make createdAt optional
    firstName: v.optional(v.string()), // New field for first name
    lastName: v.optional(v.string()), // New field for last name
  })
  .searchIndex('search_author', { searchField: 'author' })
  .searchIndex('search_title', { searchField: 'songTitle' })
  .searchIndex('search_body', { searchField: 'songDescription' }),

  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
    socialMedia: v.optional(v.array(v.object({
      platform: v.string(),  // Use 'platform' here
      url: v.string(),
    }))) // New field for social media links
  }),
});
