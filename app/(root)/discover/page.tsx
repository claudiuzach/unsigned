"use client"

import EmptyState from '@/components/EmptyState'
import LoaderSpiner from '@/components/LoaderSpiner'
import Searchbar from '@/components/Searchbar'
import SongCard from '@/components/SongCard'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({ searchParams: { search} }: { searchParams : { search: string }}) => {
  const songsData = useQuery(api.songs.getSongBySearch, { search: search || '' })

  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? 'Discover' : 'Search results for '}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {songsData ? (
          <>
            {songsData.length > 0 ? (
              <div className="song_grid">
              {songsData?.map(({ _id, songTitle, songDescription, imageUrl }) => (
                <SongCard 
                  key={_id}
                  imgUrl={imageUrl!}
                  title={songTitle}
                  description={songDescription}
                  songId={_id}
                />
              ))}
            </div>
            ) : <EmptyState title="No results found" />}
          </>
        ) : <LoaderSpiner />}
      </div>
    </div>
  )
}

export default Discover