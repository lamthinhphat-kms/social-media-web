import { Button, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { memo, useCallback, useContext, useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { useMutation, useQueryClient } from "react-query";
import PostService from "../../api/PostService";
import { AuthContext } from "../../context/AuthContext";
import SelectImage from "../SelectImage/SelectImage";

type PostModalProps = {
  open: boolean;
  handleCancel: () => void;
};

function PostModal(props: PostModalProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [caption, setCaption] = useState("");
  const { user } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const getImageCanva = async () => {
    previewCanvasRef.current?.toBlob(async function (blob) {
      createPostMutation.mutate({
        blob: blob!,
        caption: caption,
        userId: user?.id!,
      });
    });
  };

  const [haveImage, setHaveImage] = useState(false);
  const onRefChange = useCallback((e: HTMLCanvasElement | null) => {
    previewCanvasRef.current = e;
    if (e) {
      setHaveImage(true);
    } else {
      setHaveImage(false);
    }
  }, []);

  const createPostMutation = useMutation({
    mutationFn: PostService.uploadImagePost,
    onSuccess: (_) => {
      queryClient.invalidateQueries(["posts", user?.id], {
        exact: true,
      });
      props.handleCancel();
    },
  });

  return (
    <Modal
      title="Post"
      open={props.open}
      footer={null}
      onCancel={props.handleCancel}
      centered={true}
      width={"70vw"}
      maskClosable={false}
      bodyStyle={{
        height: "70vh",
      }}
    >
      <div className="flex flex-1 h-full flex-row">
        <SelectImage previewRef={previewCanvasRef} onChangeRef={onRefChange} />
        <div className="flex-1 flex flex-col gap-2">
          <TextArea
            placeholder="Write a caption"
            autoSize={{
              minRows: 4,
            }}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              type={haveImage ? "primary" : undefined}
              onClick={getImageCanva}
              disabled={!haveImage ? true : false}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default memo(PostModal);
