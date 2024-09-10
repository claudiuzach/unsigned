import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAudio } from "@/providers/AudioProvider";
import { SongProps, ProfileCardProps } from "@/types";
import LoaderSpiner from "./LoaderSpiner";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const ProfileCard = ({
  songData,
  imageUrl,
  userName,
  isOwner,
  isEditing,
  setIsEditing,
  firstName,
  lastName,
  setFirstName,
  setLastName,
  handleUpdate,
  handleProfilePictureChange,
  isImageLoading,
  socialMediaLinks,
}: ProfileCardProps & {
  isOwner: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  firstName: string;
  lastName: string;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  handleUpdate: () => Promise<void>;
  handleProfilePictureChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isImageLoading: boolean;
  socialMediaLinks: { platform: string; url: string }[];
}) => {
  const [imageInputKey, setImageInputKey] = useState<number>(0);
  const { setAudio } = useAudio();
  const [randomSong, setRandomSong] = useState<SongProps | null>(null);

  const playRandomSong = () => {
    if (songData.songs.length === 0) return; // Prevent errors if there are no songs
    const randomIndex = Math.floor(Math.random() * songData.songs.length);
    setRandomSong(songData.songs[randomIndex]);
  };

  useEffect(() => {
    if (randomSong) {
      setAudio({
        title: randomSong.songTitle,
        audioUrl: randomSong.audioUrl || "",
        imageUrl: randomSong.imageUrl || "",
        author: randomSong.author,
        songId: randomSong._id,
      });
    }
  }, [randomSong, setAudio]);

  // Return a spinner if the image URL is not available
  if (!imageUrl) return <LoaderSpiner />;

  // Function to render the social media icon based on the platform
  const getSocialMediaIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <FaFacebook className="text-blue-600" />;
      case 'twitter':
        return <FaTwitter className="text-blue-400" />;
      case 'instagram':
        return <FaInstagram className="text-pink-500" />;
      case 'youtube':
        return <FaYoutube className="text-red-600" />;
      case 'linkedin':
        return <FaLinkedin className="text-blue-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Profile Picture */}
      <div className="relative w-[250px] h-[250px] flex-shrink-0">
        <Image
          src={imageUrl}
          layout="fill"
          objectFit="cover"
          alt="Profile Image"
          className="rounded-lg"
          onError={(e) => {
            console.error('Image failed to load:', e);
            // Optionally set a fallback image here
          }}
        />
      </div>

      {/* Content and Buttons */}
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-2.5">
          {/* Verified Creator Badge */}
          <figure className="flex items-center gap-2">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="Verified"
            />
            <h2 className="text-14 font-medium text-white-2">
              Verified Creator
            </h2>
          </figure>
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
            {userName}
          </h1>

          {/* Display Social Media Links */}
          {socialMediaLinks.length > 0 && (
            <div className="mt-4">
              <h2 className="text-20 font-bold text-white-1">Social Links</h2>
              <ul className="mt-2 space-y-2">
                {socialMediaLinks.map((link) => (
                  <li key={link.platform} className="flex items-center gap-2">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-1  hover:text-orange-500 ">
                      {getSocialMediaIcon(link.platform)}
                      <span>{link.platform}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conditional Buttons and Editing Form */}
      
        </div>

        {/* Play Random Song Button */}
        {!isEditing && (
          <div className="flex flex-col gap-2 mt-4 w-full max-w-[200px]">
            <Button
              className="bg-orange-500 text-white-1 flex items-center gap-2 w-full"
              size="sm"
              onClick={playRandomSong}
            >
              <Image
                src="/icons/play.svg"
                width={20}
                height={20}
                alt="Play Random Song"
              />
              Play Random Song
            </Button>
            {isImageLoading && <LoaderSpiner />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
