import { useContext, useEffect, useMemo, useState } from "react";
import "./ProfilePage.css";
import { Avatar, Button, Divider, Typography } from "antd";
import { useInfiniteQuery, useQuery } from "react-query";
import { AuthContext } from "../../../context/AuthContext";
import UserService from "../../../api/UserService";
import { IUser } from "../../../models/IUser";
import PostService from "../../../api/PostService";
import ImageContainer from "../../../components/ImageContainer/ImageContainer";
import { useNavigate, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";

const { Text } = Typography;
function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<IUser | undefined>(undefined);

  const { id } = useParams();
  const navigate = useNavigate();

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

  useQuery({
    queryKey: ["user", profileId],
    queryFn: () => UserService.fetchUserProfile({ userId: profileId! }),
    onSuccess: (data) => {
      setProfile(data[0]);
    },
  });

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

  const handleOnClickMessage = () => {
    const roomId = [
      user?.id.substring(0, user.id.indexOf("-")),
      profileId?.substring(0, profileId.indexOf("-")),
    ]
      .sort()
      .join("");
    navigate(`/chat/${roomId}`, {
      state: {
        currentProfile: profile,
      },
    });
  };
  return (
    <>
      <div className="profile_container" id="scrollableDiv">
        <div className="header_container">
          <div className="ava_container">
            <Avatar
              size={{ xs: 54, sm: 62, md: 70, lg: 94, xl: 110, xxl: 130 }}
              src={
                profile?.avatar
                  ? `http://${profile.avatar}${
                      profile.updated_at ? `?cache=${profile.updated_at}` : ""
                    }`
                  : require("../../../../public/images/default_ava.png")
              }
            />
          </div>
          <div className="info_container">
            <div>
              <Text className="profile_text">{profile?.name}</Text>
              {!isMyProfile && (
                <Button type="primary" onClick={handleOnClickMessage}>
                  Message
                </Button>
              )}
            </div>
            <div className="following_statistic">
              <Text className="profile_text">
                <Text strong={true} className="profile_text">
                  {0}
                </Text>{" "}
                posts
              </Text>
              <Text className="profile_text">follower</Text>
              <Text className="profile_text">0 following</Text>
            </div>
          </div>
        </div>
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
