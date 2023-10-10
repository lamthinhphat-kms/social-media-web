import { useContext, useEffect, useMemo, useState } from "react";
import "./ProfilePage.css";
import { Avatar, Button, Divider, Typography } from "antd";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { AuthContext } from "../../../context/AuthContext";
import UserService from "../../../api/UserService";
import { IUser } from "../../../models/IUser";
import PostService from "../../../api/PostService";
import ImageContainer from "../../../components/ImageContainer/ImageContainer";
import { useNavigate, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";
import FollowingService from "../../../api/FollowingService";
import HeaderProfile from "../../../components/HeaderProfile/HeaderProfile";

const { Text } = Typography;
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
      <div className="profile_container" id="scrollableDiv">
        <HeaderProfile profileId={profileId} isMyProfile={isMyProfile} />
        <Divider />
        <div id="scrollableDiv">
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
            <div
              style={{
                display: "inline-grid",
                gap: "4px",
                gridTemplateColumns: "repeat(3,1fr)",
              }}
            >
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
