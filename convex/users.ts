import { ConvexError, v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v4 as uuidv4 } from 'uuid';

export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

export const getTopUserBySongsCount = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").collect();

    const userData = await Promise.all(
      user.map(async (u) => {
        const songs = await ctx.db
          .query("songs")
          .filter((q) => q.eq(q.field("authorId"), u.clerkId))
          .collect();

        const sortedSongs = songs.sort((a, b) => b.views - a.views);

        return {
          ...u,
          totalSongs: songs.length,
          song: sortedSongs.map((p) => ({
            songTitle: p.songTitle,
            songId: p._id,
          })),
        };
      })
    );

    return userData.sort((a, b) => b.totalSongs - a.totalSongs);
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
    });
  },
});


export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl || user.imageUrl,
      email: args.email || user.email,
    });

    const song = await ctx.db
      .query("songs")
      .filter((q) => q.eq(q.field("authorId"), args.clerkId))
      .collect();

    await Promise.all(
      song.map(async (p) => {
        await ctx.db.patch(p._id, {
          authorImageUrl: args.imageUrl || p.authorImageUrl,
        });
      })
    );
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);
  },
});



export const editUser = mutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.optional(v.string()), // Include 'imageUrl' as optional
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl || user.imageUrl,
      email: args.email || user.email,
      name: args.name || user.name,
    });

    const songs = await ctx.db
      .query("songs")
      .filter((q) => q.eq(q.field("authorId"), args.clerkId))
      .collect();

    await Promise.all(
      songs.map(async (song) => {
        await ctx.db.patch(song._id, {
          authorImageUrl: args.imageUrl || song.authorImageUrl,
          author: args.name || song.author,
        });
      })
    );
  },
});


export const updateProfilePicture = mutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),  // The final image URL from Clerk
  },
  async handler(ctx, args) {
    const { clerkId, imageUrl } = args;

    if (!clerkId || !imageUrl) {
      throw new ConvexError("clerkId and imageUrl are required");
    }

    const user = await ctx.db.query("users").filter((q) => q.eq(q.field("clerkId"), clerkId)).unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Store the imageUrl (from Clerk) in the database
    await ctx.db.patch(user._id, { imageUrl });
  },
});


export const saveSocialMediaLinks = mutation({
  args: {
    clerkId: v.string(),
    socialMediaLinks: v.array(v.object({
      platform: v.string(),
      url: v.string(),
    })),
  },
  async handler(ctx, args) {
    console.log("Received clerkId:", args.clerkId); // Log clerkId for debugging

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Update the user's social media links
    await ctx.db.patch(user._id, {
      socialMedia: args.socialMediaLinks,
    });
  },
});



export const getSocialMediaByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").filter((q) => q.eq(q.field("clerkId"), args.userId)).first();

    if (!user) {
      throw new Error("User not found");
    }

    return user.socialMedia || [];
  },
});


