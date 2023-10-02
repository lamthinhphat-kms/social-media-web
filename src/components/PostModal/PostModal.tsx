import { Button, Modal } from "antd";
import "react-image-crop/dist/ReactCrop.css";
import "./PostModal.css";
import SelectImage from "../SelectImage/SelectImage";
import { memo, useCallback, useContext, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import PostService from "../../api/PostService";
import { AuthContext } from "../../context/AuthContext";
import TextArea from "antd/es/input/TextArea";

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
      <div
        style={{
          display: "flex",
          flex: 1,
          height: "100%",
          flexDirection: "row",
        }}
      >
        <SelectImage previewRef={previewCanvasRef} onChangeRef={onRefChange} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <TextArea
            placeholder="Write a caption"
            autoSize={{
              minRows: 4,
            }}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
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
