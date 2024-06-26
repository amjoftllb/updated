import React from "react";
import ReactDOM from "react-dom/client";
import Figure from "./components/Figure/Figure.tsx";
import "./index.css";
import { ConversationProvider } from "./providers/ConversationProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./redux/store.tsx";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || ""}>
      <Provider store={store}>
        <ConversationProvider>
          <Figure />
        </ConversationProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
