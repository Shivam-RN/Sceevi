import { redirect } from "next/navigation";

import { getAllVideosByUser } from "@/lib/actions/video";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";


const ProfilePage = async ({ params, searchParams }: ParamsWithSearch) => {
  const { id } = await params;
  const { query, filter } = await searchParams;

  const { user, videos } = await getAllVideosByUser(id, query, filter);
  if (!user) redirect("/404");

  return (
    <main className="wrapper page">
      <Header
        subHeader={user?.email}
        title={user?.name}
        userImg={user?.image ?? ""}
      />

      {videos?.length > 0 ? (
        <section className="video-grid">
          {videos.map(({ video }) => (
            <VideoCard
              key={video.id}
              {...video}
              thumbnail={video.thumbnailUrl}
              userImg={user.image ?? ""}
              username={user.name ?? "Guest"}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon="/assets/icons/video.svg"
          title="No Videos Available Yet"
          description="Video will show up here once you upload them."
        />
      )}
    </main>
  );
};

export default ProfilePage;