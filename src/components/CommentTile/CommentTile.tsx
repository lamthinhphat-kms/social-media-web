import { Comment } from "@ant-design/compatible";
import { Avatar, Typography } from "antd";
import moment from "moment";
import { memo } from "react";
import { IComment } from "../../models/IComment";
import { defaultAva } from "../../res";
import "./CommentTile.css";

const { Text } = Typography;
type CommentTileProps = {
  comment: IComment;
};
function CommentTile(props: CommentTileProps) {
  const { comment } = props;
  const { users } = comment;
  return (
    <Comment
      style={{
        padding: "0px 12px",
      }}
      author={
        <Text strong style={{ color: "black" }}>
          {users.name}
        </Text>
      }
      avatar={
        users.avatar ? (
          <Avatar size={"large"} src={`http://${users.avatar}`} />
        ) : (
          <Avatar size={"large"} src={defaultAva} />
        )
      }
      content={<Text>{comment.text}</Text>}
      datetime={
        <Text style={{ color: "gray" }}>
          {moment(comment.created_at).fromNow()}
        </Text>
      }
    />
  );
}

export default memo(CommentTile);
