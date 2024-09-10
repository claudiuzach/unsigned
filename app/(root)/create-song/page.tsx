"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import UploadSong from "@/components/UploadSong"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Loader } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const voiceCategories = ['alloy', 'shimmer', 'nova', 'echo', 'fable', 'onyx'];

const formSchema = z.object({
  songTitle: z.string().min(2),
  songDescription: z.string().min(2),
})

const uploadSong = () => {
  const router = useRouter()
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null)
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');

  const [audioUrl, setAudioUrl] = useState('');
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null)
  const [audioDuration, setAudioDuration] = useState(0);
  

  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSong = useMutation(api.songs.createSong)

  const { toast } = useToast()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      songTitle: "",
      songDescription: "",
    },
  })
 
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if(!audioUrl || !imageUrl) {
        toast({
          title: 'Please generate audio and image',
        })
        setIsSubmitting(false);
        throw new Error('Please generate audio and image')
      }

      const song = await createSong({
        songTitle: data.songTitle,
        songDescription: data.songDescription,
        audioUrl,
        imageUrl,
        imagePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
        category,
      })
      toast({ title: 'Song created', variant:"success",       duration: 5000,  // Set duration to 5 seconds
      })
      setIsSubmitting(false);
      router.push('/')
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        variant: 'destructive',
        duration: 5000,  // Set duration to 5 seconds

      })
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Song</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="songTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
                  <FormControl>
                    <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="Title of your song" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select Category
              </Label>

              <Select onValueChange={(value) => {
    setCategory(value); // Set the selected category
    console.log('Selected category:', value); // Debugging line
  }}>
    <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1')}>
      <SelectValue placeholder="Select the category of the song" className="placeholder:text-gray-1" />
    </SelectTrigger>
    <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
      {['Pop', 'Rock', 'Electronic', 'Country', 'Blues', 'Jazz', 'Hip-Hop', 'Reggae', 'Dance', 'Folk', 'Indie', 'Latino', 'Disco',
        'K-pop', 'Afro Beats', 'Flamenco', 'Classic Rock', 'House Music', 'Other category'].map((category) => (
          <SelectItem key={category} value={category} className="capitalize focus:bg-orange-1">
            {category}
          </SelectItem>
        ))}
    </SelectContent>
  </Select>
            </div>

            <FormField
              control={form.control}
              name="songDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea className="input-class focus-visible:ring-offset-orange-1" placeholder="Write a short song description" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
          <UploadSong 
  setAudioUrl={setAudioUrl}        // Make sure to pass this
  setAudio={setAudioUrl}           // Correctly use setAudio for audio state
  audio={audioUrl}
  setAudioStorageId={setAudioStorageId}
  setAudioDuration={setAudioDuration}
/>

              <GenerateThumbnail 
               setImage={setImageUrl}
               setImageStorageId={setImageStorageId}
               image={imageUrl}
               imagePrompt={imagePrompt}
               setImagePrompt={setImagePrompt}
              />

              <div className="mt-10 w-full">
                <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1">
                  {isSubmitting ? (
                    <>
                      Submitting
                      <Loader size={20} className="animate-spin ml-2" />
                    </>
                  ) : (
                    'Submit & Publish Podcast'
                  )}
                </Button>
              </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default uploadSong