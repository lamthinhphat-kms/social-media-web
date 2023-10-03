import React, { memo, useEffect, useRef } from "react";
import { IMessage } from "../models/IMessage";

type AlwaysScrollToBottomProps = {
  messages: IMessage[];
};
function AlwaysScrollToBottom(props: AlwaysScrollToBottomProps) {
  const elementRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.messages]);
  return <div ref={elementRef} />;
}

export default memo(AlwaysScrollToBottom);
