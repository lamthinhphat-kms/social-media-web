import { ClipLoader } from "react-spinners";
type LoadingProp = {
  isLoading?: boolean;
};
function Loading({ isLoading = true }: LoadingProp) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ClipLoader loading={isLoading} />
    </div>
  );
}

export default Loading;
