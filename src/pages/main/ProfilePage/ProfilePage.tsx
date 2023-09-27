import React, { useContext, useMemo, useState } from "react";
import "./ProfilePage.css";
import { Avatar, Divider, Image, Typography } from "antd";
import { useQuery } from "react-query";
import { AuthContext } from "../../../context/AuthContext";
import UserService from "../../../api/UserService";
import { IUser } from "../../../models/IUser";
import PostService from "../../../api/PostService";
import ImageContainer from "../../../components/ImageContainer/ImageContainer";
import { useParams } from "react-router-dom";

const { Text } = Typography;
function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<IUser | undefined>(undefined);
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

  const fetchUserQuery = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => UserService.fetchUserProfile({ userId: profileId! }),
    onSuccess: (data) => {
      console.log(data.at(0)?.avatar);
      console.log(data.at(0)?.id);

      setProfile(data[0]);
    },
  });

  const fetchPostQuery = useQuery({
    queryKey: ["posts", user?.id],
    queryFn: () => PostService.fetchProfilePosts({ profileId: profileId! }),
    onSuccess: (data) => {},
  });
  return (
    <>
      <div className="profile_container">
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
            </div>
            <div className="following_statistic">
              <Text className="profile_text">
                <Text strong={true} className="profile_text">
                  {fetchPostQuery.data?.length}
                </Text>{" "}
                posts
              </Text>
              <Text className="profile_text">follower</Text>
              <Text className="profile_text">0 following</Text>
            </div>
          </div>
        </div>
        <Divider />
        <div
          style={{
            display: "inline-grid",
            gap: "4px",
            gridTemplateColumns: "repeat(3,1fr)",
          }}
        >
          {fetchPostQuery.data?.map((item, index) => (
            <ImageContainer key={item.id} post={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
