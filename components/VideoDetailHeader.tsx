'use client'

import { daysAgo } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const VideoDetailHeader = ({ title,
  createdAt,
  userImg,
  username, 
  videoId,
  ownerId,
  visibility,
  thumbnailUrl,id}:  VideoDetailHeaderProps) => {
    const router = useRouter()
     const [copied, setCopied] = useState(false);

     const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${id}`);
    setCopied(true);
  };

  useEffect(() =>{
    const changeChecked = setTimeout(() => {
        if (copied) setCopied(false);
    }, 2000);
    return ()=> clearTimeout(changeChecked);
  },[copied]);

  return (
     <header className="detail-header">
      <aside className="user-info">
        <h1>{title}</h1>
        <figure>
          <button onClick={() => router.push(`/user/${ownerId}`)}>
            <Image
              src={userImg || ""}
              alt="Jason"
              width={24}
              height={24}
              className="rounded-full"
            />
            <h2>{username ?? "Guest"}</h2>
          </button>
           <figcaption>
            <span className="mt-1">・</span>
            <p>{daysAgo(createdAt)}</p>
          </figcaption>
        </figure>
      </aside>

       <aside className="cta">
        <button onClick={copyLink}>
          <Image
            src={
              copied ? "/assets/images/checked.png" : "/assets/icons/link.svg"
            }
            alt="Copy Link"
            width={24}
            height={24}
          />
        </button>
        {/* {isOwner && (
          <div className="user-btn">
            <button
              className="delete-btn"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete video"}
            </button>
            <div className="bar" />
            {isUpdating ? (
              <div className="update-stats">
                <p>Updating...</p>
              </div>
            ) : (
              <DropdownList
                options={visibilities}
                selectedOption={visibilityState}
                onOptionSelect={handleVisibilityChange}
                triggerElement={TriggerVisibility}
              />
            )}
          </div>
        )} */}
      </aside>
    </header>
  )
}

export default VideoDetailHeader

