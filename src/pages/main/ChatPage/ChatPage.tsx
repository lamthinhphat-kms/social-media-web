import React, { useContext, useEffect, useState } from "react";
import { IMessage } from "../../../models/IMessage";
import { useLocation, useParams } from "react-router-dom";
import { socket } from "../../../utils/Socket";
import { Button, Input } from "antd";
import { IUser } from "../../../models/IUser";
import { useQuery } from "react-query";
import { AuthContext } from "../../../context/AuthContext";
import UserService from "../../../api/UserService";
import.meta.env;

function ChatPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { roomId } = useParams();
  const [chat, setChat] = useState("");

  const { state } = useLocation();
  const { currentProfile }: { currentProfile: IUser } = state;
  const { user } = useContext(AuthContext);
  useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => UserService.fetchUserProfile({ userId: user?.id! }),
    onSuccess: (data) => {},
  });

  useEffect(() => {
    console.log("123123");
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
  return (
    <div>
      {messages.map((item) => (
        <h5 key={item._id}>{item.message}</h5>
      ))}
      <Input
        placeholder="Enter your message"
        value={chat}
        onChange={(e) => setChat(e.target.value)}
      />
      <Button
        onClick={() => {
          socket.emit("chat", {
            message: chat,
            userId: user?.id,
            roomId: roomId,
          });
        }}
      >
        testing
      </Button>
    </div>
  );
}

export default ChatPage;
