import { Avatar, Typography } from "antd";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../models/IUser";
import { defaultAva } from "../../res";
import "./ProfileTile.css";

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
        src={user.avatar ? `http://${user.avatar}` : defaultAva}
      />
      <Text ellipsis={true} strong={true} style={{ flex: 1, fontSize: "24px" }}>
        {user.name}
      </Text>
    </div>
  );
}

export default memo(ProfileTile);
