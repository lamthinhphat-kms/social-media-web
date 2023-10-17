import { memo, useState } from "react";
import { IPost } from "../../models/IPost";
import CommentModal from "../CommentModal/CommentModal";
import { EyeOutlined } from "@ant-design/icons";
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
        className="cursor-pointer relative overflow-y-hidden"
      >
        <img
          className="w-full h-full aspect-square object-contain"
          src={`http://${post.image_url}`}
        />

        {showImage && (
          <div className="absolute left-0 right-0 top-0 bottom-0 bg-black/[.5] justify-center flex items-center">
            <EyeOutlined className="text-white text-2xl" />
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
