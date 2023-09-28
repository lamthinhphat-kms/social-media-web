import { useEffect, useRef } from "react";
import { canvasPreview } from "../../utils/CanvasPreview";
import { PixelCrop } from "react-image-crop";

type CropPreviewProps = {
  img: HTMLImageElement | null;
  crop: PixelCrop | undefined;
};
export default function CropPreview(props: CropPreviewProps) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (
      !props.crop?.width ||
      !props.crop?.height ||
      !props.img ||
      !canvasRef.current
    ) {
      return;
    }

    canvasPreview(props.img, canvasRef.current, props.crop, 1, 0);
  }, [props.img, props.crop]);

  if (!!props.crop && !!props.img) {
    return <canvas ref={canvasRef} />;
  }
}
