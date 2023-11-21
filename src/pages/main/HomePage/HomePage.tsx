import { Card, Skeleton } from "antd";
import { useContext, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery, useQuery } from "react-query";
import FollowingService from "../../../api/FollowingService";
import PostService from "../../../api/PostService";
import Loading from "../../../components/Loading/Loading";
import PostTile from "../../../components/PostTile/PostTile";
import { AuthContext } from "../../../context/AuthContext";
import supabase from "../../../supabase/supabaseClient";

function HomePage() {
  const { user } = useContext(AuthContext);
  const fetchFollowingListQuery = useQuery({
    queryKey: ["following-list", user?.id],
    queryFn: () => FollowingService.fetchFollowingList(user?.id!),
    onSuccess: () => {
      postFollowingInfiniteQuery.refetch();
    },
  });
  const followingList = useMemo(() => {
    return fetchFollowingListQuery.data;
  }, [fetchFollowingListQuery.data]);

  const postFollowingInfiniteQuery = useInfiniteQuery(
    ["postsFollowing", followingList],
    ({ pageParam }) =>
      PostService.fetchFollowingPostFromRange({
        followingIdList: followingList ?? [],
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 8 ? allPages.length : null;
      },
    }
  );

  useEffect(() => {
    const realtime = supabase
      .channel("testing")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
        },
        (_) => {
          postFollowingInfiniteQuery.refetch();
        }
      )
      .subscribe();

    return () => {
      realtime.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById("scrollableDiv");
    if (root) {
      if (
        !postFollowingInfiniteQuery.isLoading &&
        postFollowingInfiniteQuery.hasNextPage &&
        root.scrollHeight <= root.clientHeight
      ) {
        postFollowingInfiniteQuery.fetchNextPage();
      }
    }
  }, [
    postFollowingInfiniteQuery.isLoading,
    postFollowingInfiniteQuery.hasNextPage,
    postFollowingInfiniteQuery.data,
  ]);

  const posts = useMemo(() => {
    return postFollowingInfiniteQuery.data?.pages.reduce((acc, page) => {
      return [...acc, ...page];
    }, []);
  }, [postFollowingInfiniteQuery.data]);

  if (fetchFollowingListQuery.isLoading) {
    return <Loading />;
  }
  return (
    <div
      className="flex overflow-y-auto h-[100%] justify-center"
      id="scrollableDiv"
    >
      <InfiniteScroll
        dataLength={posts ? posts.length : 0}
        next={() => postFollowingInfiniteQuery.fetchNextPage()}
        hasMore={postFollowingInfiniteQuery.hasNextPage ?? true}
        loader={
          <Card
            className="mb-3"
            bodyStyle={{
              padding: "0",
            }}
          >
            <div className="px-4 pt-4 pb-3">
              <Skeleton avatar paragraph={{ rows: 0 }} active />
            </div>
            <div className="flex justify-center mb-2">
              <Skeleton.Image
                style={{ width: "35vw", height: "40vh" }}
                active
              />
            </div>

            <Skeleton className="py-2 px-4" paragraph={{ rows: 2 }} active />
          </Card>
        }
        scrollableTarget="scrollableDiv"
      >
        <div>
          {posts && posts.map((post) => <PostTile post={post} key={post.id} />)}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default HomePage;
