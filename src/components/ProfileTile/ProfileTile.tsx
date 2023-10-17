import { Avatar, Typography } from "antd";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../models/IUser";
import { defaultAva } from "../../res";

type ProfileTileProps = {
  user: IUser;
  handleOnCloseDrawer: () => void;
};

const { Text } = Typography;

function ProfileTile(props: ProfileTileProps) {
  const { user } = props;
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-row gap-2 items-center px-6 py-3 cursor-pointer hover:bg-black/[.1]"
      onClick={() => {
        navigate(`/profile/${user.id}`);
        props.handleOnCloseDrawer();
      }}
    >
      <Avatar
        size={"large"}
        src={user.avatar ? `http://${user.avatar}` : defaultAva}
      />
      <Text ellipsis={true} strong={true} style={{ flex: 1, fontSize: "24px" }}>
        {user.name}
      </Text>
    </div>
  );
}

export default memo(ProfileTile);
