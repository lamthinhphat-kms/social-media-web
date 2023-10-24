import { JitsiMeeting } from "@jitsi/react-sdk";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IUser } from "../../../models/IUser";
import { useQuery } from "react-query";
import { AuthContext } from "../../../context/AuthContext";
import UserService from "../../../api/UserService";
import Loading from "../../../components/Loading/Loading";
import { IJitsiMeetExternalApi } from "@jitsi/react-sdk/lib/types";

function MeetPage() {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState<IUser | undefined>(undefined);
  var api: IJitsiMeetExternalApi | undefined = undefined;

  useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => UserService.fetchUserProfile({ userId: user?.id! }),
    onSuccess(data) {
      setUserInfo(data.at(0));
    },
  });
  const handleVideoConferenceLeft = () => {
    window.close();
  };

  if (!userInfo) {
    return <Loading />;
  }

  return (
    <JitsiMeeting
      domain={"localhost:8443"}
      roomName={roomId!}
      configOverwrite={{
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: true,
        enableEmailInStats: false,
        prejoinPageEnabled: false,
      }}
      interfaceConfigOverwrite={{
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      }}
      userInfo={{
        displayName: userInfo.name,
        email: user?.email ?? "",
      }}
      onApiReady={(externalApi) => {
        // here you can attach custom event listeners to the Jitsi Meet External API
        // you can also store it locally to execute commands
        // externalApi.addListener(
        //   "videoConferenceLeft",
        //   handleVideoConferenceLeft
        // );
      }}
    />
  );
}

export default MeetPage;
