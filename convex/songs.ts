import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const createSong = mutation({
  args: {
    songTitle: v.string(),
    songDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imagePrompt: v.string(),
    views: v.number(),
    audioDuration: v.number(),
    audioStorageId: v.id("_storage"),
    imageStorageId: v.id("_storage"),
    category: v.string(),
    createdAt: v.optional(v.number()), // Marking as optional here
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Use the provided createdAt or default to current timestamp
    const createdAt = args.createdAt ?? Date.now();

    await ctx.db.insert("songs", {
      ...args,
      user: user._id,
      author: user.name,
      authorId: user.clerkId,
      authorImageUrl: user.imageUrl,
      createdAt, // Ensure createdAt is included
    });
  },
});


export const getTrendingSongs = query({
  handler: async (ctx ) =>{
    const songs =  await ctx.db.query('songs').collect();

    return songs;
  }
})


export const getSongById = query({
  args:{songId: v.id('songs')},
  handler: async (ctx, args) =>{
    return await ctx.db.get(args.songId)
  }
})



// this query will get all the podcasts based on the voiceType of the podcast , which we are showing in the Similar Podcasts section.


// this query will get all the podcasts.
export const getAllSongs = query({
  handler: async (ctx) => {
    return await ctx.db.query("songs").order("desc").collect();
  },
});

export const getSongsByCategory = query({
  args: {
    songId: v.id("songs"),
  },
  handler: async (ctx, args) => {
    const song = await ctx.db.get(args.songId);

    return await ctx.db
      .query("songs")
      .filter((q) =>
        q.and(
          q.eq(q.field("category"), song?.category),
          q.neq(q.field("_id"), args.songId)
        )
      )
      .collect();
  },
});


// this query will get the podcast by the authorId.
export const getSongByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const songs = await ctx.db
      .query("songs")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = songs.reduce(
      (sum, song) => sum + song.views,
      0
    );

    return { songs, listeners: totalListeners };
  },
});

// this query will get the podcast by the search query.
export const getSongBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("songs").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("songs")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("songs")
      .withSearchIndex("search_title", (q) =>
        q.search("songTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("songs")
      .withSearchIndex("search_body", (q) =>
        q.search("songDescription" || "songTitle", args.search)
      )
      .take(10);
  },
});

// this mutation will update the views of the podcast.
export const updateSongView = mutation({
  args: {
    songId: v.id("songs"),
  },
  handler: async (ctx, args) => {
    const song = await ctx.db.get(args.songId);

    if (!song) {
      throw new ConvexError("Song not found");
    }

    return await ctx.db.patch(args.songId, {
      views: song.views + 1,
    });
  },
});

// this mutation will delete the podcast.
export const deleteSong = mutation({
  args: {
    songId: v.id("songs"),
    imageStorageId: v.optional(v.id("_storage")),
    audioStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const song = await ctx.db.get(args.songId);

    if (!song) {
      throw new ConvexError("Song not found");
    }

    if (args.imageStorageId) {
      await ctx.storage.delete(args.imageStorageId);
    }

    if (args.audioStorageId) {
      await ctx.storage.delete(args.audioStorageId);
    }

    return await ctx.db.delete(args.songId);
  },
});



// Define the mutation to update views
export const updateViews = mutation({
  args: {
    songId: v.id("songs"),
    userId: v.string(),  // User ID to identify the user
  },
  handler: async (ctx, args) => {
    const { songId, userId } = args;
    const song = await ctx.db.get(songId);

    if (!song) {
      throw new ConvexError("Song not found");
    }

    // Parse userInteractions from string to object
    const userInteractions = song.userInteractions ? JSON.parse(song.userInteractions) : {};
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const userInteractionDate = userInteractions[userId];

    if (userInteractionDate === today) {
      // User has already interacted today
      return;
    }

    // Increment the view count
    const newViews = (song.views || 0) + 1;

    try {
      // Update the song document with the new view count and record the interaction
      await ctx.db.patch(songId, {
        views: newViews,
        userInteractions: JSON.stringify({
          ...userInteractions,
          [userId]: today
        }) // Convert object to string
      });
    } catch (error) {
      console.error("Error updating view count:", error);
      throw new ConvexError("Failed to update view count");
    }
  },
});


// Fetch latest songs
export const getLatestSongs = query({
  handler: async (ctx) => {
    return await ctx.db.query("songs")
      .order("desc")  // Order by created time, assuming you have a created_at field
      .take(10);  // Get the 10 latest songs
  }
});

