
"use client";

import React from 'react'
import SongCard from '@/components/SongCard'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";





function Home() {
  const latestSongs = useQuery(api.songs.getLatestSongs); // Fetch latest songs
  
const trendingSongs = useQuery(api.songs.getTrendingSongs);
  return (
    <div className='mt-9 flex flex-col gap-9 md:overflow-hidden'>
      <section className='flex flex-col gap-5'>
      <h1 className='text-20 font-bold text-white-1'>Trending Songs</h1>


    
    
    <div className='song_grid'>

    {trendingSongs?.map(({
      _id,songTitle, songDescription, imageUrl
    }) => (
      <SongCard 
      key={_id}
      imgUrl={imageUrl}
      title={songTitle}
      description={songDescription}
      songId={_id}
      />
    ))}
    </div>
    

      </section>

      {/* Latest Songs Section */}
      <section className='flex flex-col gap-5 mt-9'>
        <h1 className='text-20 font-bold text-white-1'>Latest Songs Posted</h1>
        <div className='song_grid'>
          {latestSongs?.map(({ _id, songTitle, songDescription, imageUrl }) => (
            <SongCard 
              key={_id}
              imgUrl={imageUrl}
              title={songTitle}
              description={songDescription}
              songId={_id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home