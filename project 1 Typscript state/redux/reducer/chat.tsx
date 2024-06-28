import * as Types from "../constants/actionType";

const initialState = {
  chatData: [],
  singleChatData:  [],
  newChatData: [],
  error: null,
};
export const Chats = (state = initialState, action: any) => {
  switch (action.type) {
    case Types.GET_CHATS:
      return {
        ...state,
        chatData: action.data,
        error: null,
      };
    case Types.GET_SINGLE_CHAT_DETAILS:
      const chatDetails = JSON.parse(action?.data?.body)?.map((item: any) => {
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
          const cleanedContent = message_content.replace(/```json|```/g,"");
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

      return {
        ...state,
        singleChatData: chatDetails,
        error: null,
      };
    case Types.SEND_REPLY_SUCCESS:
      return {
        ...state,
        singleChatData: [...state.singleChatData, action.data],
        error: null,
      };
    case Types.SEND_NEW_MESSAGE_SUCCESS:
      return {
        ...state,
        newChatData: action.data,
        error: null,
      };
    case Types.CLEAR_CONVERSATION:
      return {
        ...state,
        singleChatData: [],
      };
    case Types.GET_CHATS_FAILURE:
    case Types.SEND_NEW_MESSAGE_FAILURE:
    case Types.SEND_REPLY_FAILURE:
      return {
        ...state,
        error: action.data,
      };
    default:
      return state;
  }
};
