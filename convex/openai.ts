import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from 'openai';

const openai = new OpenAI ({
    apiKey: process.env.OPENAI_API_KEY 
})

export const generateThumbnailAction = action({
    args: { prompt: v.string() },
    handler: async (_, { prompt }) => {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      })
  
      const url = response.data[0].url;
  
      if(!url) {
        throw new Error('Error generating thumbnail');
      }
  
      const imageResponse = await fetch(url);
      const buffer = await imageResponse.arrayBuffer();
      return buffer;
    }
  })