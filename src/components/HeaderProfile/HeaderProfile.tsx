import React, { useContext, useState } from "react";
import "./HeaderProfile.css";
import { Avatar, Button, Typography } from "antd";
import { useQuery, useMutation } from "react-query";
import FollowingService from "../../api/FollowingService";
import PostService from "../../api/PostService";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../models/IUser";
import UserService from "../../api/UserService";
import { AuthContext } from "../../context/AuthContext";

const { Text } = Typography;

type HeaderProfileProps = {
  profileId: string | undefined;
  isMyProfile: boolean;
};

function HeaderProfile(props: HeaderProfileProps) {
  const { user } = useContext(AuthContext);

  const { profileId, isMyProfile } = props;

  const [profile, setProfile] = useState<IUser | undefined>(undefined);

  useQuery({
    queryKey: ["user", profileId],
    queryFn: () => UserService.fetchUserProfile({ userId: profileId! }),
    onSuccess: (data) => {
      setProfile(data[0]);
    },
  });

  const navigate = useNavigate();

  const postLengthQuery = useQuery({
    queryKey: ["postLength", profileId],
    queryFn: () => PostService.fetchPostLength(profileId!),
  });

  const followingCountQuery = useQuery({
    queryKey: ["following-count", profileId],
    queryFn: () => FollowingService.fetchFollowingCount(profileId!),
  });

  const followerCountQuery = useQuery({
    queryKey: ["follower-count", profileId],
    queryFn: () => FollowingService.fetchFollowerCount(profileId!),
  });

  const fetchIsFollowingQuery = useQuery({
    queryKey: ["following-list", user?.id],
    queryFn: () => FollowingService.fetchFollowingList(user?.id!),
    onSuccess(data) {},
    enabled: isMyProfile ? false : true,
  });

  const createHandleFollowMutation = useMutation({
    mutationFn: FollowingService.handleFollow,
    onSuccess: (data) => {
      fetchIsFollowingQuery.refetch();
      followerCountQuery.refetch();
    },
  });

  const onHandleFollow = () => {
    if (
      !fetchIsFollowingQuery.data?.some(
        (following) => following.following_id === profileId
      )
    ) {
      createHandleFollowMutation.mutate({
        profileId: profileId!,
        currentUserId: user?.id!,
        isFollowing: false,
      });
    } else {
      createHandleFollowMutation.mutate({
        profileId: profileId!,
        currentUserId: user?.id!,
        isFollowing: true,
      });
    }
  };

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
    <div className="header_container">
      <div className="ava_container">
        <Avatar
          size={{ xs: 54, sm: 62, md: 70, lg: 94, xl: 110, xxl: 130 }}
          src={
            profile?.avatar
              ? `http://${profile.avatar}${
                  profile.updated_at ? `?cache=${profile.updated_at}` : ""
                }`
              : require("../../../public/images/default_ava.png")
          }
        />
      </div>
      <div className="info_container">
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <Text className="profile_text">{profile?.name}</Text>
          {!isMyProfile && (
            <>
              <Button type="primary" onClick={handleOnClickMessage}>
                Message
              </Button>

              <Button
                type="primary"
                onClick={
                  fetchIsFollowingQuery.isLoading ? () => {} : onHandleFollow
                }
              >
                {fetchIsFollowingQuery.isLoading
                  ? ""
                  : !fetchIsFollowingQuery.data?.some(
                      (following) => following.following_id === profileId
                    )
                  ? "Follow"
                  : "Following"}
              </Button>
            </>
          )}
        </div>
        <div className="following_statistic">
          <Text className="profile_text">
            <Text strong={true} className="profile_text">
              {postLengthQuery.data ?? 0}
            </Text>{" "}
            posts
          </Text>
          <Text className="profile_text">
            <Text strong={true} className="profile_text">
              {followerCountQuery.data ?? 0}
            </Text>{" "}
            followers
          </Text>
          <Text className="profile_text">
            <Text strong={true} className="profile_text">
              {followingCountQuery.data ?? 0}
            </Text>{" "}
            followings
          </Text>
        </div>
      </div>
    </div>
  );
}

export default HeaderProfile;
