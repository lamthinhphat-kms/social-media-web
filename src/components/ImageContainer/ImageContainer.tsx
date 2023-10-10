import React, { memo, useEffect, useState } from "react";
import { Image } from "antd";
import { IPost } from "../../models/IPost";
import CommentModal from "../CommentModal/CommentModal";
import { EyeOutlined } from "@ant-design/icons";
import "./ImageContainer.css";
type ImageContainerProps = {
  post: IPost;
};
function ImageContainer(props: ImageContainerProps) {
  const [open, setOpen] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const { post } = props;
  return (
    <>
      <div
        onMouseEnter={() => setShowImage(true)}
        onMouseLeave={() => setShowImage(false)}
        onClick={() => setOpen(true)}
        style={{
          cursor: "pointer",
          position: "relative",
          overflowY: "hidden",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            aspectRatio: 1,
            objectFit: "contain",
          }}
          src={`http://${post.image_url}`}
        />

        {showImage && (
          <div className="eye_show_image">
            <EyeOutlined
              style={{
                color: "white",
                fontSize: "24px",
              }}
            />
          </div>
        )}
      </div>
      {open && (
        <CommentModal
          open={open}
          handleCancel={() => setOpen(false)}
          post={post}
          isMyPost={true}
        />
      )}
    </>
  );
}

export default memo(ImageContainer);
