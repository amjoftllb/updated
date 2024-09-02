import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { SocketProvider } from './SocketContext.jsx'; 

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import Chat from "./pages/Chat.jsx";
import AllContact from "./pages/AllContact.jsx";
import AuthLayout from "./pages/AuthLayout.jsx";
import App from "./App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/Home", element: <AuthLayout><Home /></AuthLayout> },
      { path: "/Login", element: <Login /> },
      { path: "/Registration", element: <Registration /> },
      { path: "/Chat", element: <AuthLayout><Chat /></AuthLayout> },
      { path: "/AllContact", element: <AuthLayout><AllContact /></AuthLayout> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </ChakraProvider>
    </Provider>
  </StrictMode>
);

