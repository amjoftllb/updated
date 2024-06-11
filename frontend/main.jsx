import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Registration from './pages/Registration.jsx'
import UpdateDetails from './pages/UpdateDetails.jsx'
import AllUsers from './pages/AllUsers.jsx'
import store from "./store/store.js"
import AuthLayout from './componets/AuthLayout.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {path:"/Home" , element:<AuthLayout><Home /></AuthLayout>},
      {path:"/Login" , element: <Login />},
      {path:"/Registration" , element: <Registration />},
      {path:"/UpdateDetails" , element: <AuthLayout><UpdateDetails /></AuthLayout>},
      {path:"/AllUsers" , element: <AuthLayout><AllUsers /></AuthLayout>},
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>,
)
