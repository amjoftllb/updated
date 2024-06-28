import axios from "axios";
import * as Types from "../constants/actionType";
import baseUrl from "../../util/baseUrl";
import createHeaders from "../../util/headers";

export const getChats = () => {
  return async (dispatch: any) => {
    try {
      const headers = createHeaders();
      console.log(headers)
      const response = await axios.get(
        `${baseUrl}/api/v1/user/chats/ea199dcd-e972-499f-a9bf-0542ddc6ccad`,
      );
      console.log(response.data);
      return dispatch({
        type: Types.GET_CHATS,
        data: response.data,
      });
    } catch (err) {
      console.log(err)
      return dispatch({
        type: Types.GET_CHATS_FAILURE,
        data: err,
      });
    }
  };
};

// export const getChatsById = (id: string) => {
//   return async (dispatch: any) => {
//     try {
//       const response: AxiosResponse<any> = await axios.get(`${baseUrl}/api/v1/chat/get/${id}`);
//       dispatch({
//         type: Types.GET_SINGLE_CHAT_DETAILS,
//         data: response.data,
//       });
//       return response; // Return the entire response for further processing if needed
//     } catch (err) {
//       dispatch({
//         type: Types.GET_CHATS_FAILURE,
//         data: err,
//       });
//       throw err; // Rethrow the error to handle it in the caller function
//     }
//   };
// };

export const getChatsById = (id: string) => {
  return async (dispatch: any) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/chat/get/${id}`
        
      );
      return dispatch({
        type: Types.GET_SINGLE_CHAT_DETAILS,
        data: response.data,
      });
    } catch (err) {
      return dispatch({
        type: Types.GET_CHATS_FAILURE,
        data: err,
      });
    }
  };
};

export const sendNewMessage = (messageContent: string, userId: string) => {
  return async (dispatch: any) => {
    try {
      const headers = createHeaders();
      const response = await axios.post(
        `${baseUrl}/api/v1/chat/new`,
        {
          message_content: messageContent,
          user_id: userId,
        },
        {
          headers,
        }
      );
      console.log(response, "response");
      dispatch({
        type: Types.SEND_NEW_MESSAGE_SUCCESS,
        data: response.data,
      });

      await dispatch(getChats());

      return response;
    } catch (err) {
      dispatch({
        type: Types.SEND_NEW_MESSAGE_FAILURE,
        payload: err,
      });
      throw err;
    }
  };
};

export const sendReply = (
  messageContent: string,
  userId: string,
  chatId: string
) => {
  return async (dispatch: any, getState: any) => {
    try {
      const headers = createHeaders();
      const response = await axios.post(
        `${baseUrl}/api/v1/chat/reply`,
        {
          message_content: messageContent,
          user_id: userId,
          chat_id: chatId,
        },
        {
          headers,
        }
      );

      return dispatch({
        type: Types.SEND_REPLY_SUCCESS,
        data: response.data.body.chat_response,
      });
    } catch (err) {
      dispatch({
        type: Types.SEND_REPLY_FAILURE,
        payload: err,
      });
      throw err;
    }
  };
};

export const clearConversation = () => {
  return {
    type: Types.CLEAR_CONVERSATION,
  };
};

// export const sendReply = (
//   messageContent: string,
//   userId: string,
//   chatId: string
// ) => {
//   return async (dispatch: any, getState: any) => {
//     try {
//       const headers = createHeaders();
//       const response = await axios.post(
//         `${baseUrl}/sandbox/api/v1/chat/reply`,
//         {
//           message_content: messageContent,
//           user_id: userId,
//           chat_id: chatId,
//         },
//         {
//           headers,
//         }
//       );
//       const currentState = getState();
//       const previousChatData = currentState.chats.singleChatData;

//       const updatedChatData = [
//         ...previousChatData,
//         response.data.body.chat_response,
//       ];

//       return dispatch({
//         type: Types.SEND_REPLY_SUCCESS,
//         data: updatedChatData,
//       });
//     } catch (err) {
//       dispatch({
//         type: Types.SEND_REPLY_FAILURE,
//         payload: err
//       });
//       throw err;
//     }
//   };
// };
// export const sendNewMessage = (messageContent: string, userId: string) => {
//   return async (dispatch: any) => {
//     try {
//       const headers = createHeaders();
//       const response = await axios.post(
//         `${baseUrl}/api/v1/chat/new`,
//         {
//           message_content: messageContent,
//           user_id: userId,
//         },
//         {
//           headers,
//         }
//       );

//       dispatch({
//         type: Types.SEND_NEW_MESSAGE_SUCCESS,
//         data: response.data,
//       });
//     } catch (error) {
//       dispatch({
//         type: Types.SEND_NEW_MESSAGE_FAILURE,
//         payload: error.response.data,
//       });
//     }
//   };
// };
