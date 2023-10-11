import { Button } from "antd";
import React, { memo, useRef, useState } from "react";
import ReactCrop, {
  PixelCrop,
  centerCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import { canvasPreview } from "../../utils/CanvasPreview";
import { useDebounceEffect } from "../../utils/useDebounceEffect";

type SelectImageProps = {
  previewRef: React.MutableRefObject<HTMLCanvasElement | null>;
  onChangeRef: (element: HTMLCanvasElement | null) => void;
};

function SelectImage(props: SelectImageProps) {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [completedPreviewCrop, setCompletedPreviewCrop] = useState<PixelCrop>();
  const imageRef = useRef(null);

  useDebounceEffect(
    async () => {
      if (
        completedPreviewCrop?.width &&
        completedPreviewCrop?.height &&
        imageRef.current &&
        props.previewRef.current
      ) {
        canvasPreview(
          imageRef.current,
          props.previewRef.current,
          completedPreviewCrop,
          1,
          0
        );
      }
    },
    100,
    [completedPreviewCrop]
  );

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        1,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  const clearImage = () => {
    setImage(null), setCrop(undefined), setCompletedCrop(undefined);
    setCompletedPreviewCrop(undefined);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {!image && (
        <input type="file" accept="image/*" onChange={onImageChange} />
      )}
      {image && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <div className="image_crop_select">
              <ReactCrop
                style={{
                  visibility: !completedPreviewCrop ? "visible" : "hidden",
                  position: "absolute",
                  minWidth: "100%",
                  maxHeight: "90%",
                }}
                keepSelection={true}
                crop={crop}
                aspect={1}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => {
                  setCompletedCrop(c);
                }}
              >
                <img
                  className="image_crop_container"
                  src={image}
                  onLoad={onImageLoaded}
                  ref={imageRef}
                />
              </ReactCrop>
            </div>

            {completedPreviewCrop && (
              <div className="image_crop_select">
                <canvas
                  ref={props.onChangeRef}
                  style={{
                    border: "1px solid black",
                    objectFit: "contain",
                    width: "100%",
                  }}
                />
              </div>
            )}
          </div>

          {image && !completedPreviewCrop && (
            <Button
              onClick={() => {
                setCompletedPreviewCrop(completedCrop);
              }}
            >
              Crop
            </Button>
          )}

          {image && completedPreviewCrop && (
            <Button
              onClick={() => {
                clearImage();
              }}
            >
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(SelectImage);
