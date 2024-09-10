'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { sidebarLinks } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { Button } from './ui/button';
import { useAudio } from '@/providers/AudioProvider';
import { useToast } from '@/hooks/use-toast';

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useClerk();
  const { audio } = useAudio();
  const { toast } = useToast(); // Initialize the toast
  const prevUserRef = useRef(user);

  // Show toast when the user signs in
  useEffect(() => {
    if (prevUserRef.current === null && user) {
      toast({
        title: "Success",
        description: "You've successfully logged in.",
        variant: "success",
      });
    }
    prevUserRef.current = user;
  }, [user, toast]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
    toast({
      title: "Logged Out",
      description: "You have successfully logged out.",
      variant: "success",
    });
  };

  return (
    <section
      className={cn('left_sidebar h-[calc(100vh-5px)]', {
        'h-[calc(100vh-140px)]': audio?.audioUrl,
      })}
    >
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo_unsigned.svg" alt="logo" width={35} height={30} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">Unsigned</h1>
        </Link>

        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive = pathname === route || pathname.startsWith(`$(route)/`);
          return (
            <Link
              href={route}
              key={label}
              className={cn(
                'flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start',
                { 'bg-nav-focus border-r-4 border-orange-1': isActive }
              )}
            >
              <Image src={imgURL} alt="label" width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>
      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button className="text-16 w-full bg-orange-1 font-extrabold" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
