import React, { useEffect } from "react";
import "./chat.css";
import ChatHeader from "./ChatHeader";
import Conversation from "./Conversation";
import Suggestions from "./Suggestions";
import UserInput from "./UserInput";
import { useConversationContext } from "../../providers/ConversationProvider";
import { useUserDataContext } from "../../providers/UserDataProvider";
import { useDispatch, useSelector } from "react-redux";
import { getChatsById } from "../../redux/action/chat";
import {AppDispatch} from "../../redux/store.tsx"


interface IChat {}
const Chat = (props: IChat) => {
  const { conversation, handleAddMessage, setStatus } =useConversationContext();
  const { user } = useUserDataContext();
  const dispatch = useDispatch<AppDispatch>();
  const singleChatData = useSelector(
    (state: any) => state?.Chats?.singleChatData
  );
  console.log("singleChatData",singleChatData);
  
  const newChatData = useSelector((state: any) => state.Chats.newChatData);
  let newChatId = null;
  if (newChatData && newChatData.body) {
    try {
      const parsedData = JSON.parse(newChatData.body);
      newChatId = parsedData.chat_id;
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
  const reversedChatData =
    singleChatData && singleChatData.length > 0
      ? [...singleChatData].reverse()
      : [];
  const lastMessage =
    reversedChatData.length > 0
      ? reversedChatData[reversedChatData.length - 1]
      : null;
  const chatId = lastMessage ? lastMessage.chat_id : newChatId;
  useEffect(() => {
    if (chatId) {
      setStatus([]);
      dispatch(getChatsById(chatId));
    }
  }, [dispatch, chatId]);
  return (
    <div className="chat-container">
      <ChatHeader />
      <Conversation
        conversation={reversedChatData}
      />
      {singleChatData.length === 0 && (
        <Suggestions
          username={user.name}
          callback={handleAddMessage}
          firstMessage={true}
        />
      )}
      <UserInput
        conversation={singleChatData}
        onSubmit={async (content: string) => {
          handleAddMessage("user", content);
        }}
        // chatId={chatId}
      />
    </div>
  );
};

export default Chat;


