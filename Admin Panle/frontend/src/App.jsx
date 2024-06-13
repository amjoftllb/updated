
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './components/footer/Footer.jsx';
import NavigationBar from "./components/header/NavigationBar.jsx"

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