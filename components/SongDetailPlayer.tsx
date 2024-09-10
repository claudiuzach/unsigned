"use client";

import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";  // Import useUser from Clerk or your auth provider

import { api } from "@/convex/_generated/api";
import { SongDetailPlayerProps } from "@/types";

import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import LoaderSpiner from "./LoaderSpiner";
import { useAudio } from "@/providers/AudioProvider";

const SongDetailPlayer = ({
  audioUrl,
  songTitle,
  author,
  imageUrl,
  songId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
}: SongDetailPlayerProps) => {
  const router = useRouter();
  const { setAudio } = useAudio();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteSong = useMutation(api.songs.deleteSong);
  const incrementSongViews = useMutation(api.songs.updateViews);
  
  // Use useUser to get the current user
  const { user } = useUser();

  const handleDelete = async () => {
    try {
      // Ensure that imageStorageId and audioStorageId are passed only if they are not null or undefined.
      const args = {
        songId,
        ...(imageStorageId && { imageStorageId }),
        ...(audioStorageId && { audioStorageId }),
      };
  
      await deleteSong(args);
  
      toast({
        title: "Song deleted",
        description: "The song has been successfully deleted.",
        variant: "success",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting song", error);
      toast({
        title: "Error deleting song",
        description: "An error occurred while trying to delete the song.",
        variant: "destructive",
      });
    }
  };

  const handlePlay = async () => {
    setAudio({
      title: songTitle,
      audioUrl,
      imageUrl,
      author,
      songId,
    });

    // Increment the view count
    try {
      if (user) {  // Ensure user is defined
        const userId = user.id; // Get the user ID from the user object
        await incrementSongViews({ songId, userId });
      } else {
        console.warn("User not authenticated");
      }
    } catch (error) {
      console.error("Error incrementing song views", error);
    }
  };

  if (!imageUrl || !authorImageUrl) return <LoaderSpiner />;

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Song image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {songTitle}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                router.push(`/profile/${authorId}`);
              }}
            >
              <Image
                src={authorImageUrl}
                width={30}
                height={30}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </article>

          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play song
          </Button>
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-2">
          <Image
            src="/icons/three-dots.svg"
            width={20}
            height={30}
            alt="Three dots icon"
            className="cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          />
          {isDeleting && (
            <div
              className="absolute -left-32 -top-2 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2"
              onClick={handleDelete}
            >
              <Image
                src="/icons/delete.svg"
                width={16}
                height={16}
                alt="Delete icon"
              />
              <h2 className="text-16 font-normal text-white-1">Delete</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongDetailPlayer;
