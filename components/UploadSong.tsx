import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from 'convex/react';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { api } from '@/convex/_generated/api';
import { UploadSongProps } from '@/types'; // Adjust the import path as necessary

const UploadSong: React.FC<UploadSongProps> = ({ setAudioUrl, setAudio, audio, setAudioStorageId, setAudioDuration }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const audioRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);
    const getAudioUrl = useMutation(api.songs.getUrl);

    const handleAudio = async (blob: Blob, fileName: string) => {
        setIsUploading(true);
        setFileName(fileName);

        try {
            const file = new File([blob], fileName, { type: 'audio/mpeg' });

            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;
            
            setAudioStorageId(storageId); // Correctly using the setter
            
            const audioUrl = await getAudioUrl({ storageId });
            setAudioUrl(audioUrl!); // Update the URL
            setAudioDuration(file.size / (1024 * 1024)); // Adjust duration as necessary
            setIsUploading(false);
            
            toast({ 
                title: 'Audio uploaded successfully',
                description: `File: ${fileName}`,
                variant: 'success'
            });
        } catch (error) {
            console.error(error);
            setIsUploading(false);
            toast({ 
                title: 'Error uploading audio', 
                variant: 'destructive' 
            });
        }
    };

    const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const files = e.target.files;
            if (!files) return;
            const file = files[0];
            const blob = await file.arrayBuffer()
                .then((ab) => new Blob([ab]));

            handleAudio(blob, file.name);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error uploading audio', variant: 'destructive' });
        }
    };

    return (
        <div className="upload-song">
            <div className="flex flex-col items-center">
                <Button
                    type="button"
                    onClick={() => audioRef?.current?.click()}
                    className="bg-black-6 text-white-1 py-2 px-4 rounded-md"
                >
                    {isUploading ? (
                        <div className="text-16 flex-center font-medium text-white-1">
                            Uploading
                            <Loader size={20} className="animate-spin ml-2" />
                        </div>
                    ) : (
                        'Upload Audio'
                    )}
                </Button>
                <Input
                    type="file"
                    accept=".mp3, .wav"
                    className="hidden"
                    ref={audioRef}
                    onChange={(e) => uploadAudio(e)}
                />
                <div className="flex flex-col items-center gap-1 mt-3">
                    <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
                    <p className="text-12 font-normal text-gray-1">MP3 or WAV file up to 4 MB</p>
                </div>
                {fileName && !isUploading && (
                    <div className="mt-3 text-16 font-medium text-white-1">
                        Uploaded File: {fileName}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadSong;
