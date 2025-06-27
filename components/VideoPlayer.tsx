import { createIframeLink } from '@/lib/utils'
import React from 'react'

const VideoPlayer = ({ videoId}: VideoPlayerProps) => {
  return (
    <div className='video-player'>
     <iframe
          src={createIframeLink(videoId)}
          loading="lazy"
          title="Video player"
          style={{ border: 0, zIndex: 50 }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        </div>
  )
}

export default VideoPlayer
