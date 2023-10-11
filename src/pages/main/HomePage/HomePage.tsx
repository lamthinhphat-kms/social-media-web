import { Card, Skeleton } from "antd";
import { useContext, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery, useQuery } from "react-query";
import FollowingService from "../../../api/FollowingService";
import PostService from "../../../api/PostService";
import Loading from "../../../components/Loading/Loading";
import PostTile from "../../../components/PostTile/PostTile";
import { AuthContext } from "../../../context/AuthContext";

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
        next={() => postFollowingInfiniteQuery.fetchNextPage()}
        hasMore={postFollowingInfiniteQuery.hasNextPage ?? true}
        loader={
          <Card
            style={{
              marginBottom: "12px",
            }}
            bodyStyle={{
              padding: "0",
            }}
          >
            <div
              style={{
                padding: "16px 16px 12px",
              }}
            >
              <Skeleton avatar paragraph={{ rows: 0 }} active />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              <Skeleton.Image
                style={{ width: "35vw", height: "40vh" }}
                active
              />
            </div>

            <Skeleton
              style={{
                padding: "8px 16px",
              }}
              paragraph={{ rows: 2 }}
              active
            />
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
