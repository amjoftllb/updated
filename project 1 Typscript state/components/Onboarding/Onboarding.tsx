import React, { useState } from "react"
import "./onboarding.css"
import LogInScreen from "./LogInScreen"

const Onboarding = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  return (
    <div className='onboarding-container'>
      <div className='welcome-screen'></div>
    </div>
  )
}

export default Onboarding
