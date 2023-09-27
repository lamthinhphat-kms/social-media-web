import { memo } from "react";
import { IUser } from "../../models/IUser";
import { Avatar, Typography } from "antd";
import "./ProfileTile.css";
import { useNavigate } from "react-router-dom";

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
      className="profile_tile_container"
      onClick={() => {
        navigate(`/profile/${user.id}`);
        props.handleOnCloseDrawer();
      }}
    >
      <Avatar
        size={"large"}
        src={
          user.avatar
            ? `http://${user.avatar}`
            : require("../../../public/images/default_ava.png")
        }
      />
      <Text ellipsis={true} strong={true} style={{ flex: 1, fontSize: "24px" }}>
        {user.name}
      </Text>
    </div>
  );
}

export default memo(ProfileTile);
