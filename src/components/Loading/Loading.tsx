import { ClipLoader } from "react-spinners";
type LoadingProp = {
  isLoading?: boolean;
};
function Loading({ isLoading = true }: LoadingProp) {
  return (
    <div className="flex-1 flex justify-center items-center">
      <ClipLoader loading={isLoading} />
    </div>
  );
}

export default Loading;
