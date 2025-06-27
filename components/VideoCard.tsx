"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const VideoCard = ({
  id,
  videoId,
  title,
  thumbnail,
  userImg,
  username,
  createdAt,
  views,
  visibility,
  duration,
}: VideoCardProps) => {
  

  return (
    <Link href={`/video/${videoId}`} className="video-card">
      <Image
        src={thumbnail}
        width={290}
        height={160}
        alt="thumbnail"
        className="thumbnail"
      />
      <article>
        <div>
          <figure>
            <Image
              src={userImg || "/assets/images/jason.jpg"}
              width={34}
              height={34}
              alt="avatar"
              className="rounded-full aspect-square"
            />
            <figcaption>
              <h3>{username}</h3>
              <p>{visibility}</p>
            </figcaption>
          </figure>
          <aside>
            <Image
              src="/assets/icons/eye.svg"
              alt="views"
              width={16}
              height={16}
            />
            <span>{views}</span>
          </aside>
        </div>
        <h2>
          {title} -{" "}
          {createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </h2>
      </article>
      <button onClick={() =>{}} className="copy-btn">
        <Image
          src= "/assets/icons/link.svg"
          
          alt="Copy Link"
          width={18}
          height={18}
        />
      </button>
      {duration && (
        <div className="duration">{Math.ceil(duration / 60)}min</div>
      )}
    </Link>
  );
};

export default VideoCard;