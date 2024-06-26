import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import "./user-input.css";
import { IconButton, InputAdornment } from "@mui/material";
import { Send } from "../../../assets";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatsById,
  sendNewMessage,
  sendReply,
} from "../../../redux/action/chat";
import { MessageType } from "../../../types";
import {AppDispatch} from "../../../redux/store"


interface IUserInput {
  onSubmit: (content: string | MessageType) => void;
  conversation: MessageType[];
}

const UserInput: React.FC<IUserInput> = (props) => {
  const { onSubmit, conversation } = props;
  const [input, setInput] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async () => {
    if (input.trim() === "") return;

    try {
      let response: any;
      let chatId: string | undefined;

      if (conversation.length > 0) {
        const lastMessage = conversation[conversation.length - 1];
        chatId = lastMessage.chat_id;
        if (!chatId) {
          throw new Error("Chat ID is undefined");
        }
        console.log("Sending reply:", input, chatId);
        response = await dispatch(
          sendReply(input, "ea199dcd-e972-499f-a9bf-0542ddc6ccad", chatId)
        );
      } else {
        console.log("Sending new message:", input);
        response = await dispatch(
          sendNewMessage(input, "ea199dcd-e972-499f-a9bf-0542ddc6ccad")
        );
        chatId = response.data.chat_id;
      }

      console.log("API response:", response);
      if (response.data.length > 0 || response.data.statusCode === 200) {
        const chatResponse = response.data;
        console.log(chatResponse, "chatResponsechatResponse");
        if (chatResponse && chatResponse.length > 0) {
          const { answer } = chatResponse[0];
          const systemMessage: MessageType = {
            id: `msg-${conversation.length}`,
            content: answer,
            date: new Date(),
            side: "system",
            type: "text",
          };
          onSubmit(systemMessage);
        }
        onSubmit(input);
        setInput("");
        if (response.data.length > 0 && chatId) {
          dispatch(getChatsById(chatId));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter") {
      handleSubmit();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    setInput("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation]);
  return (
    <div className="chat-user-input-container">
      <FormControl fullWidth>
        <TextField
          inputRef={inputRef}
          type="text"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          className="chat-user-input"
          value={input}
          variant="outlined"
          placeholder="Just ask me anything!"
          inputProps={{ className: "user-input" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" onClick={handleSubmit}>
                <IconButton className="send-btn">
                  <img src={Send} className="send-img" alt="send" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </div>
  );
};

export default UserInput;
