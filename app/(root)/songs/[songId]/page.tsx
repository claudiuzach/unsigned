"use client";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import LoaderSpiner from "@/components/LoaderSpiner";
import SongCard from "@/components/SongCard";
import SongDetailPlayer from "@/components/SongDetailPlayer";
import EmptyState from "@/components/EmptyState";
import Image from "next/image";

// Define a type guard to check if the value is a valid Id
function isValidId(id: any): id is Id<"_storage"> {
  return id && typeof id === 'object' && '__tableName' in id;
}

// SongDescription component
const SongDescription = ({ params: { songId } }: { params: { songId: Id<'songs'> } }) => {
  const { user } = useUser();
  const [hasUpdatedView, setHasUpdatedView] = useState(false);
  const song = useQuery(api.songs.getSongById, { songId });
  const similarSongs = useQuery(api.songs.getSongsByCategory, { songId });
 

  const isOwner = user?.id === song?.authorId;

  

  if (!similarSongs || !song) return <LoaderSpiner />;

  const validImageStorageId = isValidId(song.imageStorageId) ? song.imageStorageId : null;
  const validAudioStorageId = isValidId(song.audioStorageId) ? song.audioStorageId : null;

  return (
    <section className='flex w-full flex-col'>
      <header className='mt-9 flex items-center justify-between'>
        <h1 className='text-20 font-bold text-white-1'>Currently Playing</h1>
        <figure className='flex gap-3'>
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt='Headphones'
          />
          <h2 className='text-16 font-bold text-white-1'>{song?.views}</h2>
        </figure>
      </header>
      <SongDetailPlayer
        isOwner={isOwner}
        songId={song._id}
        audioUrl={song.audioUrl || ''} // Ensure audioUrl is a valid string or empty
        songTitle={song.songTitle || 'Unknown Title'}
        author={song.author || 'Unknown Author'}
        imageUrl={song.imageUrl || ''} // Ensure imageUrl is a valid string or empty
        imageStorageId={validImageStorageId as Id<"_storage">} // Use type assertion if valid
        audioStorageId={validAudioStorageId as Id<"_storage">} // Use type assertion if valid
        authorImageUrl={song.authorImageUrl || ''}
        authorId={song.authorId || ''}
      />
      <p className='text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center'>{song?.songDescription}</p>

      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Similar songs</h1>
        {similarSongs && similarSongs.length > 0 ? (
          <div className='song_grid'>
            {similarSongs.map(({ _id, songTitle, songDescription, imageUrl }) => (
              <SongCard
                key={_id}
                imgUrl={imageUrl || ''}
                title={songTitle || 'Unknown Title'}
                description={songDescription || 'No Description'}
                songId={_id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No similar songs found"
            buttonLink="/discover"
            buttonText="Discover more songs"
          />
        )}
      </section>
    </section>
  );
};

export default SongDescription;
