import VideoDetailHeader from '@/components/VideoDetailHeader';
import VideoPlayer from '@/components/VideoPlayer';
import { getVideoById } from '@/lib/actions/video';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: Params) => {
  const { videoId } = await params;

  console.log("videoId", videoId);

  const videoRecord = await getVideoById(videoId);
if (!videoRecord) redirect("/404");

const { video, user } = videoRecord;


  return (
    <main className='wrapper page'>
      <VideoDetailHeader {...video} userImg={user?.image} username={user?.name} ownerId={video.userId}/>

       <section className="video-details">
         <div className="content">
        <VideoPlayer videoId={video.videoId} />
        </div>

        </section>
    </main>
  )
}

export default page
