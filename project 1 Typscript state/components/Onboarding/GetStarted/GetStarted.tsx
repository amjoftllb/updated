import React from "react"
import "./get-started.css"
// import { GoogleLogin } from "react-google-login"
const clientId = "YOUR_CLIENT_ID.apps.googleusercontent.com" // Replace with your Google client ID

const GetStarted = () => {
  const onSuccess = (response: any) => {
    console.log("Login Success: currentUser:", response.profileObj)
    // You can handle user info and access token here
  }

  const onFailure = (response: any) => {
    console.log("Login Failed: res:", response)
  }
  return (
    <div className='get-started-container'>
      <div className='content-container'>
        <div className='get-started-content'>
          <span>Welcome! Let’s get started</span>
         
        </div>
      </div>
    </div>
  )
}

export default GetStarted
