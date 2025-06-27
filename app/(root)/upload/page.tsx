'use client'
import FileInput from '@/components/FileInput'
import FormField from '@/components/FormField'
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from '@/constants'
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from '@/lib/actions/video'
import { useFileInput } from '@/lib/hooks/useFileInput'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useEffect, useState } from 'react'

const page = () => {
   const router = useRouter();
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false);
     const [videoDuration, setVideoDuration] = useState<number | null>(null);

    const [formData, setFormData] = useState<VideoFormValues>({
            title: "",
            description: "",
            tags: "",
            visibility: "public",
  });

  const video = useFileInput(MAX_VIDEO_SIZE)
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

  useEffect(() => {
    if (video.duration !== null) {
      setVideoDuration(video.duration);
    }
  }, [video.duration]);

  
  useEffect(() => {
    const checkForRecordedVideo = async () => {
      try {
        const stored = sessionStorage.getItem("recordedVideo");
        if (!stored) return;

        const { url, name, type, duration } = JSON.parse(stored);
        const blob = await fetch(url).then((res) => res.blob());
        const file = new File([blob], name, { type, lastModified: Date.now() });

        if (video.inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          video.inputRef.current.files = dataTransfer.files;

          const event = new Event("change", { bubbles: true });
          video.inputRef.current.dispatchEvent(event);

          video.handleFileChange({
            target: { files: dataTransfer.files },
          } as ChangeEvent<HTMLInputElement>);
        }

        if (duration) setVideoDuration(duration);

        sessionStorage.removeItem("recordedVideo");
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error loading recorded video:", err);
      }
    };

    checkForRecordedVideo();
  }, [video]);

  const uploadFileToBunny = (file: File,uploadUrl: string,accessKey: string): Promise<void> =>
              fetch(uploadUrl, {
                method: "PUT",
                headers: {
                  "Content-Type": file.type,
                  AccessKey: accessKey,
                },
                body: file,
              }).then((response) => {
                if (!response.ok)
                  throw new Error(`Upload failed with status ${response.status}`);
              });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!video.file || !thumbnail.file) {
        setError("Please upload video and thumbnail files.");
        return;
      }
      
      if (!formData.title || !formData.description) {
        setError("Please fill in all required fields.");
        return;
      }

       const {
        videoId,
        uploadUrl: videoUploadUrl,
        accessKey: videoAccessKey,
      } = await getVideoUploadUrl();

      if (!videoUploadUrl || !videoAccessKey)
        throw new Error("Failed to get video upload credentials");

        await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey);

         const {
        uploadUrl: thumbnailUploadUrl,
        cdnUrl: thumbnailCdnUrl,
        accessKey: thumbnailAccessKey,
      } = await getThumbnailUploadUrl(videoId);

      if (!thumbnailUploadUrl || !thumbnailCdnUrl || !thumbnailAccessKey)
        throw new Error("Failed to get thumbnail upload credentials");

      await uploadFileToBunny(
        thumbnail.file,
        thumbnailUploadUrl,
        thumbnailAccessKey
      );

        await saveVideoDetails({
        videoId,
        thumbnailUrl: thumbnailCdnUrl,
        ...formData,
        duration: videoDuration,
      });

      router.push(`/`);

    } catch (error) {
        console.log("Error submitting form:", error);
    } finally{
        setIsSubmitting(false);
    }
  }

  return (
    <main className='wrapper-md upload-page"'>
        <h1 className='text-3xl font-bold text-dark-100;'>Upload a video</h1>
        {error && <div className='error-field'>{error}</div>}
               
            <form className="rounded-20 gap-6 w-full flex flex-col shadow-10 px-5 py-7.5" onSubmit={handleSubmit}>
        <FormField
          id="title"
          label="Title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter a clear and concise video title"
        />

        <FormField
          id="description"
          label="Description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Briefly describe what this video is about"
          as="textarea"
        />

        <FileInput
          id="video"
          label="Video"
          accept="video/*"
          file={video.file}
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          type="video"
        />

        <FileInput
          id="thumbnail"
          label="Thumbnail"
          accept="image/*"
          file={thumbnail.file}
          previewUrl={thumbnail.previewUrl}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          type="image"
        />
        
        <FormField
          id="visibility"
          label="Visibility"
          value={formData.visibility}
          onChange={handleInputChange}
          as="select"
          options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
          ]}
        />
         <button type="submit" disabled={isSubmitting} className=" bg-pink-500 text-white px-4 py-3 rounded-4xl cursor-pointer text-base font-semibold hover:bg-pink-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
">
          {isSubmitting ? "Uploading..." : "Upload Video"}
        </button>

      </form>


    </main>
  )
}

export default page
