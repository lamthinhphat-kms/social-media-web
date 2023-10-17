import { Avatar, Typography } from "antd";
import { memo } from "react";
import { IMessage } from "../../models/IMessage";
import { IUser } from "../../models/IUser";
import { defaultAva } from "../../res";

type ChatTileProps = {
  chat: IMessage;
  profile: IUser;
  userId: string;
};

const { Text } = Typography;

function ChatTile(props: ChatTileProps) {
  const { chat, profile, userId } = props;
  return (
    <div
      className={`flex my-3 gap-2 ${
        userId === profile.id ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar
        size={"large"}
        src={
          profile?.avatar
            ? `http://${profile.avatar}${
                profile.updated_at ? `?cache=${profile.updated_at}` : ""
              }`
            : defaultAva
        }
      />
      <div
        className={`px-4 py-2 rounded-[15px] max-w-[80%] ${
          userId === profile.id ? "bg-chatBlue" : "bg-black/[.1]"
        }`}
      >
        <Text
          className={`text-[17px] ${
            userId === profile.id ? "text-white" : "text-black"
          }`}
        >
          {chat.message}
        </Text>
      </div>
    </div>
  );
}

export default memo(ChatTile);
