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
    <div className="flex flex-1 justify-center items-center flex-col h-full">
      {!image && (
        <input type="file" accept="image/*" onChange={onImageChange} />
      )}
      {image && (
        <div className="flex flex-col flex-1 justify-center items-center w-full h-full">
          <div className="relative w-full h-full">
            <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center">
              <ReactCrop
                className={`absolute min-w-full max-h-[90%] ${
                  !completedPreviewCrop ? "visible" : "invisible"
                }`}
                keepSelection={true}
                crop={crop}
                aspect={1}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => {
                  setCompletedCrop(c);
                }}
              >
                <img
                  className="w-full h-full object-contain"
                  src={image}
                  onLoad={onImageLoaded}
                  ref={imageRef}
                />
              </ReactCrop>
            </div>

            {completedPreviewCrop && (
              <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center">
                <canvas
                  ref={props.onChangeRef}
                  className="border-solid border-black border-[1px] object-contain w-full"
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
