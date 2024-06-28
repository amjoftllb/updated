/* eslint-disable react-refresh/only-export-components */
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ConversationType,
  MessageSide,
  MessageType,
  ProviderProps,
  StatusType,
  UserConversation,
} from "../types";
import { waitForNSeconds } from "../util";
import { useDispatch, useSelector } from "react-redux";
import { DUMMY_USER_CONVERSATIONS_HISTORY } from "../consts";
import { getChats, getChatsById } from "../redux/action/chat";
import axios from "axios";
import {AppDispatch} from "../redux/store"

interface IConversationContext {
  conversation: ConversationType[];
  status: StatusType[];
  setConversation: Dispatch<SetStateAction<ConversationType[]>>;
  setStatus: Dispatch<SetStateAction<StatusType[]>>;
  handleAddMessage: (type: MessageSide, content: string) => Promise<void>;
  handleAddStatus: (type: MessageSide, content: string) => Promise<void>;
  userConversations: UserConversation[];
}

interface ChatEntry {
  id: string;
  title: string;
}
const defaultConversationContext: IConversationContext = {
  conversation: [],
  setConversation: () => [],
  status: [],
  setStatus: () => [],
  handleAddMessage: async () => {},
  handleAddStatus: async () => {},
  userConversations: [],
};

const ConversationContext = createContext<IConversationContext>(
  defaultConversationContext
);

export const ConversationProvider: React.FC<ProviderProps> = ({ children }) => {
  const [conversation, setConversation] = useState<ConversationType[]>([]);
  const [status, setStatus] = useState<StatusType[]>([]);
  const [userConversations, setUserConversations] = useState<
    UserConversation[]
  >(DUMMY_USER_CONVERSATIONS_HISTORY);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getChats());
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchData();
  }, [dispatch]);
  const addSkeletonAnswer = useCallback(async () => {
    setConversation((prevConversation) => [
      ...prevConversation,
      {
        content: "Getting your answer...",
        date: new Date(),
        id: "temp-message",
        side: "system",
        type: "text",
      },
    ]);
    // })
  }, []);

  const removeSkeleton = useCallback(() => {
    // either remove the prev message of temp or assign a new id and use it from there

    // setConversation((prevConversation) =>
    //   prevConversation.filter((msg) => msg.id !== "temp-message")
    // )

    const newConversation = conversation;
    newConversation?.forEach((msg) => {
      if (msg.id === "temp-message") {
        msg.id = "new-id";
      }
    });
    setConversation(newConversation);
  }, [conversation, setConversation]);

  const handleAddMessage = useCallback(
    async (type: MessageSide, content: string) => {
      const newConversation: ConversationType[] = [
        ...conversation,
        {
          id: `msg-${conversation?.length}`,
          content,
          date: new Date(),
          side: "user",
          type: "text",
        },
      ];
      setConversation(newConversation);

      await addSkeletonAnswer();

      waitForNSeconds(3).then(async (res) => {
        removeSkeleton();
        const message: MessageType = {
          id: `msg-${conversation?.length + 1}`,
          content: res.data,
          date: new Date(),
          side: "system",
          type: "column",
          message_id: ""
        };
        setConversation([...newConversation, message]);
      });
    },
    [addSkeletonAnswer, conversation, removeSkeleton]
  );
  const handleAddStatus = useCallback(
    async (type: MessageSide, content: string) => {
    const newConversation: StatusType[] = [
      {
        id: `msg-1`,
        message_content: content,
        date: new Date(),
        role: type,
        type: "column",
      },
      {
        message_content: "Getting your answer...",
        date: new Date(),
        id: "temp-message",
        role: "system",
        type: "text",
      }
    ];
    setStatus(newConversation);
  },[status]
);

  const providerMemo = useMemo(
    () => ({
      conversation,
      setConversation,
      status,
      setStatus,
      handleAddMessage,
      handleAddStatus,
      userConversations,
    }),
    [
      conversation,
      status,
      handleAddStatus,
      handleAddStatus,
      handleAddMessage,
      userConversations,
    ]
  );

  return (
    <ConversationContext.Provider value={providerMemo}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => useContext(ConversationContext);
