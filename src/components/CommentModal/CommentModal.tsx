import { Modal, Typography, Card, Avatar, Input, Divider } from "antd";
import { memo, useContext, useState } from "react";
import { IPost } from "../../models/IPost";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CommentService from "../../api/CommentService";
import CommentTile from "../CommentTile/CommentTile";
import { HeartOutlined, HeartFilled, SendOutlined } from "@ant-design/icons";
import "./CommentModal.css";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";

const { Text } = Typography;

type CommentModalProps = {
  isLiked?: boolean;
  open: boolean;
  handleCancel: () => void;
  post: IPost;
  onLike?: () => void;
  onUnlike?: () => void;
  isMyPost?: boolean;
};
function CommentModal(props: CommentModalProps) {
  const { post } = props;
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  const fetchCommentsQuery = useQuery({
    queryKey: ["comment", post.id],
    queryFn: () => CommentService.fetchComments(post.id),
    onSuccess: (_) => {},
  });

  const createInsertCommentMutation = useMutation({
    mutationFn: CommentService.inserComment,
    onSuccess: (_) => {
      setComment("");
      queryClient.invalidateQueries(["comment", post.id], {
        exact: true,
      });
    },
  });
  console.log(post.users?.id);
  console.log(post.users?.avatar);

  const [comment, setComment] = useState("");
  return (
    <Modal
      open={props.open}
      footer={null}
      onCancel={props.handleCancel}
      centered={true}
      afterClose={props.handleCancel}
      closeIcon={false}
      width={"90vw"}
      bodyStyle={{
        height: "70vh",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div className="left_container">
          <img className="image" src={`http://${post.image_url}`} />
        </div>
        <div className="right_container">
          <div
            style={{
              flex: 1,
              overflowY: "scroll",
            }}
          >
            <Card
              style={{
                height: "100%",
                borderRadius: "0px",
                borderWidth: "0",
              }}
              bodyStyle={{
                padding: "0px",
              }}
            >
              <div className="comment_container">
                {post.users?.avatar ? (
                  <Avatar size={"large"} src={`http://${post.users?.avatar}`} />
                ) : (
                  <Avatar
                    size={"large"}
                    src={require("../../../public/images/default_ava.png")}
                  />
                )}
                <Text
                  style={{
                    flex: 1,
                    fontSize: "18px",
                  }}
                >
                  <Text strong={true}>{post.users?.name}</Text>{" "}
                  <Text>{post.caption}</Text>
                </Text>
              </div>
              <Divider
                style={{
                  margin: "4px",
                }}
              />
              {fetchCommentsQuery.data?.map((item) => {
                return <CommentTile key={item.id} comment={item} />;
              })}
            </Card>
          </div>
          <div className="comment_section">
            <Divider
              style={{
                margin: "0px",
              }}
            />
            <div
              style={{
                padding: "8px 16px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {!props.isMyPost ? (
                props.isLiked ? (
                  <HeartFilled
                    className="icon_click liked"
                    onClick={props.onUnlike}
                  />
                ) : (
                  <HeartOutlined
                    className="icon_click"
                    onClick={props.onLike}
                  />
                )
              ) : undefined}

              <Text className="like_text">
                {post.likes_count} likes ∙ {moment(post.created_at).fromNow()}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                margin: "8px",
              }}
            >
              <Input
                className="input_comment"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <SendOutlined
                style={{
                  fontSize: "14px",
                  color: comment.length !== 0 ? "blue" : "gray",
                }}
                onClick={
                  comment.length !== 0
                    ? () => {
                        createInsertCommentMutation.mutate({
                          postId: post.id,
                          userId: user?.id!,
                          text: comment,
                        });
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default memo(CommentModal);
