import React from "react";
import "./conversation.css";
import Message from "../Message";
import { MessageSide, MessageType } from "../../../types";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { useConversationContext } from "../../../providers/ConversationProvider";

interface IConversation {
  conversation: MessageType[];
  // addMessage: (type: MessageSide, content: string) => Promise<void>;
}

const Conversation = (props: IConversation) => {
  const { conversation } = props;
  const { status } = useConversationContext();

  return (
    <div
      className={clsx(
        "chat-conversation-container",
        conversation[0] ? "started" : ""
      )}
    >
      <div className="conversation">
        {conversation?.map((msg, index) => (
          <Message
            // key={msg.message_id}
            message={msg}
            index={index}
            // addMessage={addMessage}
          />
        ))}
        {status?.map((msg, index) => (
          <Message
            key={msg?.id}
            message={msg as MessageType}
            index={index}
            // addMessage={addMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default Conversation;
