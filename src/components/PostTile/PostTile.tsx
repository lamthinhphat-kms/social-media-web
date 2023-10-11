import { CommentOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import moment from "moment";
import { memo, useContext, useState } from "react";
import Lottie from "react-lottie-player";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LikeService from "../../api/LikeService";
import { AuthContext } from "../../context/AuthContext";
import { IPost } from "../../models/IPost";
import { defaultAva } from "../../res";
import CommentModal from "../CommentModal/CommentModal";
import "./PostTile.css";

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
    onSuccess: () => {
      queryClient.invalidateQueries(["like", post.id, user?.id], {
        exact: true,
      });
      queryClient.invalidateQueries(["following-list", user?.id], {
        exact: true,
      });
    },
  });

  const [play, setPlay] = useState(false);

  const createDeleteLikeMutation = useMutation({
    mutationFn: LikeService.deleteikePost,
    onSuccess: () => {
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
      setPlay(true);
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
              <Avatar src={defaultAva} />
            )
          }
          title={post.users?.name}
        />
        <img
          style={{
            aspectRatio: 1,
            objectFit: "contain",
            height: "100%",
            width: "100%",
          }}
          src={`http://${post.image_url}`}
        />

        <div className="icon_container">
          {/* {isLiked ? (
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
          )} */}

          <Lottie
            segments={isLiked ? [0, 80] : [80, 181]}
            onClick={
              isLiked
                ? () => {
                    createDeleteLikeMutation.mutate({
                      postId: post.id,
                      userId: user?.id!,
                    });
                  }
                : () => {
                    createInsertLikeMutation.mutate({
                      postId: post.id,
                      userId: user?.id!,
                    });
                  }
            }
            play={play}
            onComplete={() => setPlay(false)}
            style={{
              width: "70px",
            }}
            animationData={require("../../../public/animations/like.json")}
            loop={false}
          />

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
