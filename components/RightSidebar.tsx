'use client';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Header from './Header';
import Carousel from './Carousel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import LoaderSpiner from './LoaderSpiner';
import { cn } from '@/lib/utils';
import { useAudio } from '@/providers/AudioProvider';

const RightSidebar = () => {



  const {user} = useUser(); 

  const topAuthors = useQuery(api.users.getTopUserBySongsCount);
  const router = useRouter();

  if(!topAuthors) return <LoaderSpiner />

  const { audio } = useAudio();


  return (
    <section className={cn("right_sidebar h-[calc(100vh-5px)]", {
      'h-[calc(100vh-140px)]': audio?.audioUrl
    })}>

      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">{user?.firstName} {user?.lastName}</h1>
            <Image 
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>

      <section>
        <Header headerTitle="Fans like you"/>
        <Carousel fansLikeDetail={topAuthors!}/>
      </section>

      <section className='flex flex-col gap-8 pt-12'>
      <Header headerTitle="Top unsgined artists"/>
      <div className='flex flex-col gap-6'>
        {topAuthors?.slice(0,4).map((artist)=>(
          <div key={artist._id} className='flex cursor-pointer justify-between ' onClick={() =>router.push(`/profile/${artist.clerkId}`)}>

            <figure className='flex items-center gap-2'>
            <Image src={artist.imageUrl} alt={artist.name} width={44} height={44} className='aspect-square rounded-lg'/>
            <h2 className='text-14 font-semibold text-white-1'>{artist.name}</h2>
            </figure>

            <div className='flex items-center'>
            <p className='text-12 font-normal text-white-1'>{artist.totalSongs} songs</p>

            </div>

          </div>
        )) }
      </div>

      </section>
    </section>
  )
}

export default RightSidebar