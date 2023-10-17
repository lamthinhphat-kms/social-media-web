import { Divider } from "antd";
import { useContext, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useParams } from "react-router-dom";
import PostService from "../../../api/PostService";
import HeaderProfile from "../../../components/HeaderProfile/HeaderProfile";
import ImageContainer from "../../../components/ImageContainer/ImageContainer";
import Loading from "../../../components/Loading/Loading";
import { AuthContext } from "../../../context/AuthContext";

function ProfilePage() {
  const { user } = useContext(AuthContext);

  const { id } = useParams();

  const profileId = useMemo(() => {
    if (id === user?.id) {
      return user?.id;
    } else {
      return id;
    }
  }, []);

  const isMyProfile = useMemo(() => {
    if (id === user?.id) {
      return true;
    } else {
      return false;
    }
  }, []);

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ["posts", profileId],
    ({ pageParam }) =>
      PostService.fetchPostByRange({
        userId: profileId!,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 9 ? allPages.length : null;
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

  return (
    <>
      <div
        className="flex p-3 items-center flex-col w-full h-full overflow-y-auto"
        id="scrollableDiv"
      >
        <HeaderProfile profileId={profileId} isMyProfile={isMyProfile} />
        <Divider />
        <div id="scrollableDiv">
          <InfiniteScroll
            dataLength={posts ? posts.length : 0}
            next={() => fetchNextPage()}
            hasMore={hasNextPage ?? true}
            loader={<Loading />}
            scrollableTarget="scrollableDiv"
          >
            <div className="grid gap-1 grid-cols-3">
              {posts &&
                posts.map((item) => (
                  <ImageContainer key={item.id} post={item} />
                ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
