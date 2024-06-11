import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './componets/footer/Footer.jsx';
import NavigationBar from "./componets/header/NavigationBar.jsx"

function App() {

  return (
    <div >
      <NavigationBar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default App
