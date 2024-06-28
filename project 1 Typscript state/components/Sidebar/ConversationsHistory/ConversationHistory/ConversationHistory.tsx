import React from "react";
import "./conversation-history.css";
import { UserConversation } from "../../../../types";
import clsx from "clsx";
import { Tooltip } from "@mui/material";
import axios from "axios";

interface IUserConversation {
  conversation: UserConversation;
  index: number;
  storeID: string | null | undefined;
  onClick: (chatId: string) => void;
}

const ConversationHistory = (props: IUserConversation) => {
  const { conversation, index, storeID, onClick } = props;
  const handleClick = async () => {
    await onClick(conversation.id);
  };
  return (
    <Tooltip title={conversation.title}>
      <div
        onClick={handleClick}
        className={clsx(
          "conversation-container",
          index === 0 ? "first" : "",
          storeID === conversation.id ? "selected" : ""
        )}
      >
        <span className="conversation-title">{conversation.title}</span>
      </div>
    </Tooltip>
  );
};

export default ConversationHistory;
