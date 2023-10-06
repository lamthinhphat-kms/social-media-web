import { useContext, useEffect, useMemo } from "react";
import PostTile from "../../../components/PostTile/PostTile";
import { useQuery, useInfiniteQuery } from "react-query";
import { AuthContext } from "../../../context/AuthContext";
import FollowingService from "../../../api/FollowingService";
import PostService from "../../../api/PostService";
import { ClipLoader } from "react-spinners";
import InfiniteScroll from "react-infinite-scroll-component";

function HomePage() {
  const { user } = useContext(AuthContext);
  const fetchFollowingListQuery = useQuery({
    queryKey: ["following-list", user?.id],
    queryFn: () => FollowingService.fetchFollowingList(user?.id!),
  });
  const followingList = useMemo(() => {
    return fetchFollowingListQuery.data;
  }, [fetchFollowingListQuery.data]);

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(
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
    const root = document.getElementById("scrollableDiv");
    if (root) {
      if (!isLoading && hasNextPage && root.scrollHeight <= root.clientHeight) {
        fetchNextPage();
      }
    }
  }, [isLoading, hasNextPage, data]);

  const posts = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page];
    }, []);
  }, [data]);

  if (fetchFollowingListQuery.isLoading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ClipLoader loading={true} />
      </div>
    );
  }
  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
      }}
      id="scrollableDiv"
    >
      <InfiniteScroll
        dataLength={posts ? posts.length : 0}
        next={() => fetchNextPage()}
        hasMore={hasNextPage ?? true}
        loader={
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ClipLoader loading={true} />
          </div>
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
