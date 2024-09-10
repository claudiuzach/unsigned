'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import LoaderSpiner from "@/components/LoaderSpiner";
import ProfileCard from "@/components/ProfileCard";
import SongCard from "@/components/SongCard";
import { useToast } from "@/hooks/use-toast";
import EmptyState from "@/components/EmptyState";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const { userId } = useAuth();
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const songsData = useQuery(api.songs.getSongByAuthorId, {
    authorId: params.profileId,
  });
  const socialMediaLinks = useQuery(api.users.getSocialMediaByUserId, {
    userId: params.profileId,
  });

  const editUserMutation = useMutation(api.users.editUser);
  const updateProfilePictureMutation = useMutation(api.users.updateProfilePicture);
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (user?.name) {
      const [first, ...rest] = user.name.split(" ");
      setFirstName(first || "");
      setLastName(rest.join(" ") || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const fullName = `${firstName} ${lastName}`;
      await editUserMutation({
        clerkId: params.profileId,
        name: fullName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setIsImageLoading(true);
      try {
        // Assuming you have an endpoint in your backend to handle the image upload to Clerk
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch('https://upload.clerk.com/v1/upload', {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image to Clerk");
        }

        const data = await response.json();
        const newImageUrl = data.url;  // Adjust based on Clerk's API response

        // Update the image URL in Convex database
        await updateProfilePictureMutation({
          clerkId: params.profileId,
          imageUrl: newImageUrl,
        });

        toast({
          title: 'Profile picture updated successfully',
          variant: 'success',
        });
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast({
          title: 'Error updating profile picture',
          variant: 'destructive',
        });
      } finally {
        setIsImageLoading(false);
      }
    }
  };

  if (!user || !songsData || socialMediaLinks === undefined) return <LoaderSpiner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Artist Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          songData={songsData!}
          imageUrl={user?.imageUrl!}
          userName={`${firstName} ${lastName}`}
          isOwner={user?.clerkId === userId}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          handleUpdate={handleUpdate}
          handleProfilePictureChange={handleProfilePictureChange}
          isImageLoading={isImageLoading}
          socialMediaLinks={socialMediaLinks} // Pass social media links here
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Songs</h1>
        {songsData && songsData.songs.length > 0 ? (
          <div className="song_grid">
            {songsData?.songs
              ?.slice(0, 4)
              .map((song) => (
                <SongCard
                  key={song._id}
                  imgUrl={song.imageUrl!}
                  title={song.songTitle!}
                  description={song.songDescription}
                  songId={song._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not posted any songs yet"
            buttonLink="/create-song"
            buttonText="Post your song"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
