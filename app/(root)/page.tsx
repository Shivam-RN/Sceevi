
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import VideoCard from "@/components/VideoCard";
import { getAllVideos } from "@/lib/actions/video";

const page = async ({ searchParams }: SearchParams) => {
  const { query, filter, page } = await searchParams;

  const { videos, pagination } = await getAllVideos(
    query,
    filter,
    Number(page) || 1
  );

  return (
    <main className="wrapper page">
      <Header subHeader="Public Library" title="All Videos" />

      {videos?.length > 0 ? (
        <section className="video-grid">
          {videos.map(({ video, user }) => (
            <VideoCard
              key={video.id}
              {...video}
              thumbnail={video.thumbnailUrl}
              userImg={user?.image ?? ""}
              username={user?.name ?? "Guest"}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon="/assets/icons/video.svg"
          title="No Videos Found"
          description="Try adjusting your search."
        />
      )}

        {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          queryString={query}
          filterString={filter}
        />
      )}

    </main>
  );
};

export default page;