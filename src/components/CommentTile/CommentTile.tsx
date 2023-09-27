import React, { memo } from "react";
import "./CommentTile.css";
import { IComment } from "../../models/IComment";
import { Avatar, Typography } from "antd";
import moment from "moment";

const { Text } = Typography;
type CommentTileProps = {
  comment: IComment;
};
function CommentTile(props: CommentTileProps) {
  const { comment } = props;
  const { users } = comment;
  return (
    <div className="comment_container">
      {users.avatar ? (
        <Avatar size={"large"} src={`http://${users.avatar}`} />
      ) : (
        <Avatar
          size={"large"}
          src={require("../../../public/images/default_ava.png")}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: "18px",
          }}
        >
          <Text strong={true}>{users.name}</Text> <Text>{comment.text}</Text>
        </Text>
        <Text
          style={{
            color: "gray",
          }}
        >
          {moment(comment.created_at).fromNow()}
        </Text>
      </div>
    </div>
  );
}

export default memo(CommentTile);
