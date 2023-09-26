import { Card, Avatar, Image, Typography, Modal } from "antd";
import Meta from "antd/es/card/Meta";
import React, { memo, useContext, useState } from "react";
import { IPost } from "../../models/IPost";
import { HeartOutlined, CommentOutlined, HeartFilled } from "@ant-design/icons";
import "./PostTile.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LikeService from "../../api/LikeService";
import { AuthContext } from "../../context/AuthContext";
import CommentModal from "../CommentModal/CommentModal";
import moment from "moment";

const { Text, Paragraph } = Typography;

type PostTileProps = {
  post: IPost;
};

function PostTile(props: PostTileProps) {
  const { user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const { post } = props;
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const createInsertLikeMutation = useMutation({
    mutationFn: LikeService.insertikePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["like", post.id, user?.id], {
        exact: true,
      });
      queryClient.invalidateQueries(["following-list", user?.id], {
        exact: true,
      });
    },
  });

  const createDeleteLikeMutation = useMutation({
    mutationFn: LikeService.deleteikePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["like", post.id, user?.id], {
        exact: true,
      });
      queryClient.invalidateQueries(["following-list", user?.id], {
        exact: true,
      });
    },
  });

  useQuery({
    queryKey: ["like", post.id, user?.id],
    queryFn: () =>
      LikeService.fetchIsLike({ postId: post.id, userId: user?.id! }),
    onSuccess: (data) => {
      setIsLiked(data.length !== 0);
    },
  });

  return (
    <>
      <Card
        className="card"
        bodyStyle={{
          padding: "0",
        }}
      >
        <Meta
          className="meta_user_info"
          avatar={
            post.users?.avatar ? (
              <Avatar src={`http://${post.users?.avatar}`} />
            ) : (
              <Avatar src={require("../../../public/images/default_ava.png")} />
            )
          }
          title={post.users?.name}
        />
        <Image
          style={{
            aspectRatio: 1,
          }}
          preview={false}
          src={`http://${post.image_url}`}
        />

        <div className="icon_container">
          {isLiked ? (
            <HeartFilled
              className="icon_click liked"
              onClick={() => {
                createDeleteLikeMutation.mutate({
                  postId: post.id,
                  userId: user?.id!,
                });
              }}
            />
          ) : (
            <HeartOutlined
              className="icon_click"
              onClick={() => {
                createInsertLikeMutation.mutate({
                  postId: post.id,
                  userId: user?.id!,
                });
              }}
            />
          )}

          <CommentOutlined
            className="icon_click"
            onClick={() => {
              setOpen(true);
            }}
          />
        </div>

        <Text className="like_text">
          {post.likes_count} likes ∙ {moment(post.created_at).fromNow()}
        </Text>

        <Paragraph
          className="paragraph"
          ellipsis={{
            rows: 2,
            expandable: true,
            symbol: "Show more",
          }}
        >
          <Text strong={true}>{post.users?.name}: </Text>
          {post.caption}
        </Paragraph>
      </Card>
      {open && (
        <CommentModal
          isLiked={isLiked}
          open={open}
          post={post}
          handleCancel={() => setOpen(false)}
          onLike={() => {
            createInsertLikeMutation.mutate({
              postId: post.id,
              userId: user?.id!,
            });
          }}
          onUnlike={() => {
            createDeleteLikeMutation.mutate({
              postId: post.id,
              userId: user?.id!,
            });
          }}
        />
      )}
    </>
  );
}

export default memo(PostTile);
