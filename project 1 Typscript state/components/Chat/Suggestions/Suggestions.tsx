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
import {AppDispatch} from "../../../redux/store"
import {RootState} from "../../../redux/reducer/rootReducer"

interface ISuggestions {
  username: string;
  callback: (type: MessageSide, content: string) => void;
  suggestions?: string[];
  firstMessage: boolean;
}

interface ChatsState {
  singleChatData: string | any;
}

const Suggestions = (props: ISuggestions) => {
  const { username, callback, firstMessage, suggestions } = props;
  const dispatch = useDispatch<AppDispatch>();
  const singleChatData = useSelector((state : RootState) => state.Chats.singleChatData);
  const newChatData = useSelector((state : RootState) => state.Chats.newChatData);

  const suggestionList = suggestions || [];

  const handleSuggestionClick = async (suggestion: string) => {
    callback("user", suggestion);

    if (singleChatData.length === 0) {
      const response = await dispatch(
        sendNewMessage(suggestion, "ea199dcd-e972-499f-a9bf-0542ddc6ccad")
      );
      if (response?.type === "SEND_NEW_MESSAGE_SUCCESS") {
        dispatch(getChats());
        const newChatId = response.data.chat_id;
        dispatch(getChatsById(newChatId));
      }
    } else {
      const chatId = singleChatData[0].chat_id || newChatData.chat_id;
      const response = await dispatch(
        sendReply(suggestion, "ea199dcd-e972-499f-a9bf-0542ddc6ccad", chatId)
      );
      if (response.type === "SEND_REPLY_SUCCESS") {
        dispatch(getChats());
        dispatch(getChatsById(chatId));
      }
    }
  };
  return (
    <div className="chat-suggestions-container">
      {firstMessage && (
        <Typography variant="h6" className="user-greet">
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
