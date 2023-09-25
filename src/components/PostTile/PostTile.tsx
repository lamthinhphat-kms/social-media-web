import { Card, Avatar, Image, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import React, { memo } from "react";
import { IPost } from "../../models/IPost";

const { Text, Paragraph } = Typography;

type PostTileProps = {
  post: IPost;
};

function PostTile(props: PostTileProps) {
  const { post } = props;
  return (
    <Card
      style={{
        width: "35vw",
        marginBottom: "12px",
      }}
      bodyStyle={{
        padding: "0",
      }}
    >
      <Meta
        style={{
          padding: "16px 16px 12px",
        }}
        avatar={<Avatar src={`http://${post.users?.avatar}`} />}
        title={post.users?.name}
      />
      <Image
        style={{
          aspectRatio: 1,
        }}
        preview={false}
        src={`http://${post.image_url}`}
      />

      <Paragraph
        ellipsis={{
          rows: 2,
          expandable: true,
          symbol: "Show more",
          onEllipsis(ellipsis) {
            console.log("");
          },
        }}
      >
        {post.caption}
      </Paragraph>
    </Card>
  );
}

export default memo(PostTile);
