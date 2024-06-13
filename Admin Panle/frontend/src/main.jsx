import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login.jsx'
import store from "./store/store.js"
import Registration from "./pages/registration.jsx"
import UserUpdateDetails from "./pages/user/UserUpdateDetails.jsx"
import AdminHome from "./pages/admin/AdminHome.jsx"
import AdminUpdateDetails from "./pages/admin/AdminUpdateUser.jsx"
import UserHome from "./pages/user/UserHome.jsx"

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children:[
//       {path:"/Login" , element:<AuthLayout><Login /></AuthLayout>},
//       {path:"/RegisterUser" , element: <RegisterUser />},
//       {path:"/Home" , element: <Home />},
//       {path:"/UserUpdateDetails" , element: <AuthLayout><UserUpdateDetails /></AuthLayout>},
//       {path:"/AdminHome" , element: <AuthLayout><AdminHome /></AuthLayout>},
//       {path:"/AdminUpdateDetails" , element: <AuthLayout><AdminUpdateDetails /></AuthLayout>},
//     ]
//   }
// ])

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {path:"/Login" , element:<Login />},
      {path:"/Registration" , element: <Registration />},
      {path:"/UserHome" , element: <UserHome />},
      {path:"/UserUpdateDetails" , element: <UserUpdateDetails />},
      {path:"/AdminHome" , element: <AdminHome />},
      {path:"/AdminUpdateDetails" , element: <AdminUpdateDetails />},
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>
)