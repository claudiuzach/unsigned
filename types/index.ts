/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";

import { Id } from "@/convex/_generated/dataModel";


export interface UploadSongProps {
  setAudioUrl: (url: string) => void;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface TopSongsProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  song: {
    songTitle: string;
    songId: Id<"songs">;
  }[];
  totalSongs: number;
}

export interface SongProps {
  _id: Id<"songs">;
  _creationTime: number;
  audioStorageId: Id<"_storage"> | null;
  user: Id<"users">;
  songTitle: string;
  songDescription: string;
  audioUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voiceType: string;
  audioDuration: number;
  views: number;
  category: string; // Add this line

}

export interface ProfileSongProps {
  songs: SongProps[];
  listeners: number;
}

export interface GeneratePodcastProps {
  voiceType: string;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}

export interface GenerateThumbnailProps {
  
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}

export interface LatestSongCardProps {
  imgUrl: string;
  title: string;
  duration: string;
  index: number;
  audioUrl: string;
  author: string;
  views: number;
  songId: Id<"songs">;
}

export interface SongDetailPlayerProps {
  audioUrl: string;
  songTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string;
  songId: Id<"songs">;
  imageStorageId: Id<"_storage">;
  audioStorageId: Id<"_storage">;
  authorImageUrl: string;
  authorId: string;
}

export interface AudioProps {
  title: string;
  audioUrl: string;
  author: string;
  imageUrl: string;
  songId: string;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}

export interface SongCardProps {
  imgUrl: string;
  title: string;
  description: string;
  songId: Id<"songs">;
}

export interface CarouselProps {
  fansLikeDetail: TopSongsProps[];
}

export interface ProfileCardProps {
  songData: ProfileSongProps;
  imageUrl: string;
  userName: string;
  socialPlatform:string;
  socialUrl:string;

}

export type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

// Add to your types file
export interface SocialMediaLink {
  type: string;
  url: string;
}