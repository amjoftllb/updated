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
import { ConversationType, MessageSide, MessageType } from "../../../types";
import { useConversationContext } from "../../../providers/ConversationProvider";
import {AppDispatch} from "../../../redux/store"

interface IUserInput {
  onSubmit: any;
  conversation: any;
  // handleAddStatus: (type: MessageSide, content: string) => void;
}

const UserInput: React.FC<IUserInput> = (props) => {
  const { onSubmit, conversation } = props;
  const [input, setInput] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { setStatus, handleAddStatus } = useConversationContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async () => {
    setInput("");
    if (input.trim() === "") return;
    handleAddStatus("user", input);

    try {
      let response: any;
      let chatId: string | undefined;

      if (conversation.length > 0) {
        const lastMessage = conversation[conversation.length - 1];
        chatId = lastMessage?.chat_id;
        if (!chatId) {
          throw new Error("Chat ID is undefined");
        }
        response = await dispatch(
          sendReply(input, "ea199dcd-e972-499f-a9bf-0542ddc6ccad", chatId)
        );
      } else {
        response = await dispatch(
          sendNewMessage(input, "ea199dcd-e972-499f-a9bf-0542ddc6ccad")
        );
        chatId = response.data.chat_id;
      }

      if (response.data.length > 0 || response.data.statusCode === 200) {
        setStatus([]);
        const chatResponse = response.data;
        if (chatResponse && chatResponse.length > 0) {
          const { answer } = chatResponse[0];
          const systemMessage: ConversationType = {
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
      setStatus([]);
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
