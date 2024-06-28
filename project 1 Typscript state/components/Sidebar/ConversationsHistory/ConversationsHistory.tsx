import React, { useCallback, useState } from "react";
import "./conversations-history.css";
import Conversation from "./ConversationHistory";
import { Wand } from "../../../assets";
import { useConversationContext } from "../../../providers/ConversationProvider";
import useNavigation from "../../../hooks/useNavigation";
import Icon from "../../../util/components/Icon";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearConversation, getChatsById } from "../../../redux/action/chat";
import {AppDispatch} from "../../../redux/store"

export interface GraphData {
  graph_type: string;
  title: string;
  description: string;
  series: {
    name: string;
    type: string;
    data: number[];
  };
}

export interface ChatMessage {
  message_id: string;
  chat_id: string;
  message_content: ChatMessageContent | string;
  role: "assistant" | "user";
  internal_role: "assistant" | "user";
  time_of_message: string;
}

export interface ChatDetailsResponse {
  isBase64Encoded: boolean;
  headers: Record<string, any>;
  statusCode: number;
  body: any[];
}

export interface ChatMessageContent {
  answer: string;
  graph_data: GraphData;
  insights: string[];
  followup_suggestions: string[];
}

export interface ChatsState {
  chatData: {
    isBase64Encoded: boolean;
    statusCode: number;
    body: string;
  };
  singleChatData: ChatMessage[];
  newChatData: ChatMessage[];
  error: null | string;
}

export interface RootState {
  Chats: ChatsState;
}

const ConversationsHistory = () => {
  const { setConversation, userConversations } = useConversationContext();
  const dispatch = useDispatch<AppDispatch>();
  const [storeID, setStoreId] = useState<string | null | undefined>();
  const { goToRoot } = useNavigation();
  const sideBarData = useSelector(
    (state: RootState) => state?.Chats?.chatData.body
  );
  // const testData = useSelector(
  //   (state) => state?.Chats?.chatData
  // );
  let parsedData = [];
  if (sideBarData) {
    try {
      parsedData = JSON.parse(sideBarData);
      parsedData.reverse();
    } catch (error) {
      console.error("Failed to parse sideBarData:", error);
    }
  } else {
    console.warn("sideBarData is undefined or null");
  }
  const transformedData =
    parsedData?.length > 0 &&
    parsedData?.map((entry: any) => ({
      id: entry[0],
      title: entry[3],
    }));
  const handleNewConversation = useCallback(() => {
    goToRoot();
    setConversation([]);
    dispatch(clearConversation());
    setStoreId(null);
  }, [goToRoot, setConversation]);

  const handleConversationClick = async (id: string) => {
    try {
      setStoreId(id);
      dispatch(getChatsById(id));
      JSON.parse(sideBarData)?.map((item: any) => {
        const [
          message_id,
          chat_id,
          message_content,
          role,
          internal_role,
          time_of_message,
        ] = item;

        let parsedContent;
        try {
          const cleanedContent = message_content.replace(/```json|```/g, "");
          parsedContent = JSON.parse(cleanedContent);
        } catch (error) {
          parsedContent = message_content;
        }

        return {
          message_id,
          chat_id,
          message_content: parsedContent,
          role,
          internal_role,
          time_of_message,
        };
      });
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  return (
    <div className="user-conversations-container">
      <span className="user-conversations-title">Conversations</span>
      <div className="new-conversation-container">
        <div
          className="new-conversation new-chat"
          onClick={handleNewConversation}
        >
          <span className="user-conversation-label">Start a new Chat</span>
          <Icon src={Wand} alt="wand" className="wand-icon" />
        </div>
      </div>
      <div className="user-conversations">
        {/* Rendering transformed data or user conversations */}
        {transformedData && transformedData.length > 0 ? (
          transformedData.map((conversation: any) => (
            <Conversation
              storeID={storeID}
              onClick={handleConversationClick}
              index={conversation.id}
              conversation={conversation}
            />
          ))
        ) : (
          <div className="empty-history">
            <span className="empty-history-label">
              Your conversations will be shown here
            </span>
          </div>
        )}
      </div>
      {/* {!userConversations.length && (
        <div className="empty-history">
          <span className="empty-history-label">
            Your conversations will be shown here
          </span>
        </div>
      )} */}
    </div>
  );
};

export default ConversationsHistory;
