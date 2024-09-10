import { SongCardProps } from '@/types'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'; // Ensure this import is correct



const SongCard = ({
    imgUrl, title, description, songId
}: SongCardProps) => {

    const router = useRouter(); // Call useRouter as a function

    const handleViews = () => {
        // Increase views
        
        router.push(`/songs/${songId}`);
    };


  return (
    <div className='cursor-pointer' onClick={handleViews}>

        <figure className='flex flex-col gap-2'>
            <Image
            src={imgUrl}
            width={174}
            height={174}
            alt={title}
            className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px]'
            />
            <div className='flex flex-col'>
                <h1 className='text-16 truncate font-bold text-white-1'>{title}</h1>
                <h2 className='text-12 truncate font-normal capitalize text-white-4'>{description}</h2>
            </div>
        </figure>
    </div>
  )
}

export default SongCard