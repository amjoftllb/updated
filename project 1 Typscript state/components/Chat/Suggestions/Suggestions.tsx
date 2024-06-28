import React, { useState } from "react";
import "./suggestions.css";
import { Typography } from "@mui/material";
import Suggestion from "./Suggestion";
import { MessageSide, SuggestionType } from "../../../types";
import axios from "axios";
import { dummySuggestions } from "../../../consts";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getChats,
  getChatsById,
  sendNewMessage,
  sendReply,
} from "../../../redux/action/chat";
import { useConversationContext } from "../../../providers/ConversationProvider";
import {AppDispatch} from "../../../redux/store"

interface ISuggestions {
  username: string;
  callback: (type: MessageSide, content: string) => void;
  // handleAddStatus: (type: MessageSide, content: string) => void;
  suggestions?: string[];
  firstMessage: boolean;
}

interface ChatsState {
  singleChatData: string | any;
}

const Suggestions = (props: ISuggestions) => {
  const { username, firstMessage, suggestions } = props;
  const { setStatus, status, handleAddStatus } = useConversationContext();
  const dispatch = useDispatch<AppDispatch>();
  const singleChatData = useSelector(
    (state: any) => state.Chats.singleChatData
  );
  const newChatData = useSelector((state: any) => state.Chats.newChatData);

  const suggestionList = suggestions || [];
 
  const handleSuggestionClick = async (suggestion: string) => {
    handleAddStatus("user", suggestion);
    try {
      let response: any;

      if (singleChatData.length === 0) {
        response = await dispatch(
          sendNewMessage(suggestion, "ea199dcd-e972-499f-a9bf-0542ddc6ccad")
        );
        if (response?.type === "SEND_NEW_MESSAGE_SUCCESS") {
          dispatch(getChats());
          const newChatId = response.data.chat_id;
          dispatch(getChatsById(newChatId));
          setStatus([]);
        } else {
          throw new Error("Failed to send new message");
        }
      } else {
        const chatId = singleChatData[0].chat_id || newChatData.chat_id;
        response = await dispatch(
          sendReply(suggestion, "ea199dcd-e972-499f-a9bf-0542ddc6ccad", chatId)
        );
        if (response.type === "SEND_REPLY_SUCCESS") {
          dispatch(getChats());
          dispatch(getChatsById(chatId));
          setStatus([]);
        } else {
          throw new Error("Failed to send reply");
        }
      }
    } catch (error) {
      console.error("Error handling suggestion click:", error);
      setStatus([]);
    }
  };

  return (
    <div className="chat-suggestions-container">
      {status.length < 1 && firstMessage && (
        <Typography
          variant="h6"
          sx={{ textAlign: "center" }}
          className="user-greet "
        >
          Welcome {username}, choose a question or ask me anything:
        </Typography>
      )}

      <div
        className={clsx("suggestions", !firstMessage ? "clarifications" : "")}
      >
        {suggestionList.length > 0 &&
          suggestionList.map((suggestion, index) => (
            <Suggestion
              key={index}
              suggestion={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              clarification={!firstMessage}
            />
          ))}
      </div>
    </div>
  );
};

export default Suggestions;
