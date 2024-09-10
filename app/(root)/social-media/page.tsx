"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

import { useClerk } from '@clerk/nextjs';

const socialMediaPlatforms = ['Facebook', 'Twitter', 'Youtube', 'LinkedIn', 'Instagram'];

const socialMediaFormSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Invalid URL").min(1, "URL is required"),
  description: z.string().optional(),
});

const SocialMediaForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveSocialMediaLinks = useMutation(api.users.saveSocialMediaLinks);


    const { user } = useClerk();
    const clerkId = user?.id; // Clerk ID
  
 
  const form = useForm<z.infer<typeof socialMediaFormSchema>>({
    resolver: zodResolver(socialMediaFormSchema),
    defaultValues: {
      platform: "",
      url: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof socialMediaFormSchema>) {
    try {
      setIsSubmitting(true);
  
      if (!data.url) {
        toast({
          title: 'URL is required',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        throw new Error('URL is required');
      }
  
  
  
      if (!clerkId) {
        throw new Error('User is not authenticated');
      }
  
      await saveSocialMediaLinks({
        clerkId,
        socialMediaLinks: [{
          platform: data.platform,
          url: data.url,
        }],
      });
  
      toast({
        title: 'Social media link saved',
        variant: 'success',
        duration: 5000,
      });
  
      router.push('/');
    } catch (error) {
      console.error(error);
  
      toast({
        title: 'Error saving social media link',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Add Social Media Link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Select Platform</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="text-16 w-full border-none bg-black-1 text-gray-1">
                        <SelectValue placeholder="Select a social media platform" />
                      </SelectTrigger>
                      <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1">
                        {socialMediaPlatforms.map(platform => (
                          <SelectItem key={platform} value={platform} className="capitalize focus:bg-orange-1">
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">URL</FormLabel>
                  <FormControl>
                    <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="Enter the URL" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea className="input-class focus-visible:ring-offset-orange-1" placeholder="Add a description (optional)" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-10 w-full">
            <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1">
              {isSubmitting ? (
                <>
                  Saving
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                'Save & Post Your Social Link'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default SocialMediaForm;
