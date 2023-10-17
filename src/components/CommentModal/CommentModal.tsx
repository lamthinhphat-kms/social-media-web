import { HeartFilled, HeartOutlined, SendOutlined } from "@ant-design/icons";
import { Avatar, Card, Divider, Input, Modal, Typography } from "antd";
import moment from "moment";
import { memo, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CommentService from "../../api/CommentService";
import { AuthContext } from "../../context/AuthContext";
import { IPost } from "../../models/IPost";
import { defaultAva } from "../../res";
import CommentTile from "../CommentTile/CommentTile";
import "./CommentModal.css";

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

  const [comment, setComment] = useState("");
  return (
    <Modal
      open={props.open}
      footer={null}
      onCancel={props.handleCancel}
      className="comment_modal"
      centered={true}
      afterClose={props.handleCancel}
      closeIcon={false}
      width={"80vw"}
      bodyStyle={{
        height: "80vh",
      }}
    >
      <div className="h-full w-full flex flex-row">
        <div className="flex items-center justify-center h-full bg-black w-[45%]">
          <img
            className="w-full h-full object-contain aspect-square"
            src={`http://${post.image_url}`}
          />
        </div>
        <div className="max-h-full flex flex-col w-[55%]">
          <div className="flex-1 overflow-y-scroll">
            <Card
              className="h-full rounded-none border-0"
              bodyStyle={{
                padding: "0px",
              }}
            >
              <div className="py-2 px-4 flex flex-row gap-2">
                {post.users?.avatar ? (
                  <Avatar size={"large"} src={`http://${post.users?.avatar}`} />
                ) : (
                  <Avatar size={"large"} src={defaultAva} />
                )}
                <Text className="flex-1 text-lg">
                  <Text strong={true}>{post.users?.name}</Text>{" "}
                  <Text>{post.caption}</Text>
                </Text>
              </div>
              <Divider className="m-1" />
              {fetchCommentsQuery.data?.map((item) => {
                return <CommentTile key={item.id} comment={item} />;
              })}
            </Card>
          </div>
          <div className="flex flex-col">
            <Divider className="m-0" />
            <div className="py-2 px-4 flex flex-row items-center">
              {!props.isMyPost ? (
                props.isLiked ? (
                  <HeartFilled
                    className="text-xl text-red-500"
                    onClick={props.onUnlike}
                  />
                ) : (
                  <HeartOutlined
                    className="text-xl text-gray-500"
                    onClick={props.onLike}
                  />
                )
              ) : undefined}

              <Text className="px-4">
                {post.likes_count} likes ∙ {moment(post.created_at).fromNow()}
              </Text>
            </div>
            <div className="flex flex-row gap-2 m-2">
              <Input
                className="flex-1"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <SendOutlined
                className={`text-sm ${
                  comment.length !== 0 ? "text-blue-500" : "text-gray-500"
                }`}
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
