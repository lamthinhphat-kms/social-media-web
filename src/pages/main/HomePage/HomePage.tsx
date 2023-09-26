import { Avatar, Card, Image, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useContext, useState } from "react";
import PostTile from "../../../components/PostTile/PostTile";
import { useQuery, useMutation } from "react-query";
import { AuthContext } from "../../../context/AuthContext";
import { IPost } from "../../../models/IPost";
import FollowingService from "../../../api/FollowingService";
import PostService from "../../../api/PostService";
import { ClipLoader } from "react-spinners";

const { Text } = Typography;

function HomePage() {
  const { user } = useContext(AuthContext);
  const [postList, setPostList] = useState<IPost[]>([]);
  const fetchFollowingListQuery = useQuery({
    queryKey: ["following-list", user?.id],
    queryFn: () => FollowingService.fetchFollowingList(user?.id!),
    onSuccess: (data) => {
      fetchPostFeedFollowingQuery.mutate(data);
    },
  });
  const fetchPostFeedFollowingQuery = useMutation({
    mutationKey: ["post-feed", user?.id],
    mutationFn: PostService.fetchFollowingPost,
    onSuccess: (data) => {
      setPostList(data);
    },
  });

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
        display: "flex",
        flex: 1,
        justifyContent: "center",
        padding: "12px",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {postList.map((item, index) => (
        <PostTile key={item.id} post={item} />
      ))}
    </div>
  );
}

export default HomePage;
