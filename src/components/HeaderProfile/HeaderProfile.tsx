import { Avatar, Button, Typography } from "antd";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import FollowingService from "../../api/FollowingService";
import PostService from "../../api/PostService";
import UserService from "../../api/UserService";
import { AuthContext } from "../../context/AuthContext";
import { IUser } from "../../models/IUser";
import { defaultAva } from "../../res";
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
    onSuccess() {},
    enabled: isMyProfile ? false : true,
  });

  const createHandleFollowMutation = useMutation({
    mutationFn: FollowingService.handleFollow,
    onSuccess: () => {
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
    <div className="flex flex-row items-center w-full p-3">
      <div className="flex flex-[2] justify-center">
        <Avatar
          size={{ xs: 54, sm: 62, md: 70, lg: 94, xl: 110, xxl: 130 }}
          src={
            profile?.avatar
              ? `http://${profile.avatar}${
                  profile.updated_at ? `?cache=${profile.updated_at}` : ""
                }`
              : defaultAva
          }
        />
      </div>
      <div className="flex flex-[5] flex-col gap-3">
        <div className="flex gap-2 items-center">
          <Text className="text-2xl">{profile?.name}</Text>
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
        <div className="flex gap-11">
          <Text className="text-2xl">
            <Text strong={true} className="text-2xl">
              {postLengthQuery.data ?? 0}
            </Text>{" "}
            posts
          </Text>
          <Text className="text-2xl">
            <Text strong={true} className="text-2xl">
              {followerCountQuery.data ?? 0}
            </Text>{" "}
            followers
          </Text>
          <Text className="text-2xl">
            <Text strong={true} className="text-2xl">
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
