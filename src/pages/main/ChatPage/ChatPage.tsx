import { SendOutlined, PhoneOutlined } from "@ant-design/icons";
import { Avatar, Input, Typography } from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import UserService from "../../../api/UserService";
import ChatTile from "../../../components/ChatTile/ChatTile";
import { AuthContext } from "../../../context/AuthContext";
import { IMessage } from "../../../models/IMessage";
import { IUser } from "../../../models/IUser";
import { defaultAva } from "../../../res";
import AlwaysScrollToBottom from "../../../utils/AlwaysScrollToBottom";
import { socket } from "../../../utils/Socket";
import.meta.env;

const { Text } = Typography;

function ChatPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { roomId } = useParams();
  const [chat, setChat] = useState("");

  const { state } = useLocation();
  const { currentProfile }: { currentProfile: IUser } = state;
  const { user } = useContext(AuthContext);
  const fetchUserQuery = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => UserService.fetchUserProfile({ userId: user?.id! }),
    onSuccess: (data) => {},
  });

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit(
        "hello",
        {
          roomId: roomId,
          socketId: socket.id,
        },
        (val: IMessage[]) => {
          setMessages(val);
        }
      );
    });

    socket.on("chat", (e) => {
      setMessages((prev) => [...prev, e]);
      setChat("");
    });

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat");
      socket.off("hello");

      socket.disconnect();
    };
  }, []);

  const openMeeting = useCallback(() => {
    window.open(`http://localhost:5173/meeting/${roomId}`, "_blank");
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-3">
      <div className="flex items-center gap-2 pb-2 border-solid border-0 border-b-[1px] border-gray-500">
        <Avatar
          size={"large"}
          src={
            currentProfile?.avatar
              ? `http://${currentProfile.avatar}${
                  currentProfile.updated_at
                    ? `?cache=${currentProfile.updated_at}`
                    : ""
                }`
              : defaultAva
          }
        />
        <Text strong className=" flex-1 text-2xl">
          {currentProfile.name}
        </Text>
        <PhoneOutlined className="text-xl" onClick={openMeeting} />
      </div>
      <div className="flex-1 overflow-scroll">
        {fetchUserQuery.isLoading ? (
          <></>
        ) : (
          <>
            {messages.map((item) => (
              <ChatTile
                chat={item}
                key={item._id}
                profile={
                  item.userId === currentProfile.id
                    ? currentProfile
                    : fetchUserQuery.data?.at(0)!
                }
                userId={fetchUserQuery.data?.at(0)?.id!}
              />
            ))}
            <AlwaysScrollToBottom messages={messages} />
          </>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <Input
          placeholder="Enter your message"
          value={chat}
          className="text-[17px] rounded-[15px]"
          onChange={(e) => setChat(e.target.value)}
        />
        <SendOutlined
          className={`text-[20px] ${
            chat.length !== 0 ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={
            chat.length !== 0
              ? () => {
                  socket.emit("chat", {
                    message: chat,
                    userId: user?.id,
                    roomId: roomId,
                    toUserId: currentProfile.id,
                    name: fetchUserQuery.data?.at(0)?.name,
                  });
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}

export default ChatPage;
