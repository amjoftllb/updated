import React from "react"
import "./chat-header.css"
import { FButton } from "../../../util/components"
import { FigureLogo } from "../../../assets"
import useNavigation from "../../../hooks/useNavigation"

const ChatHeader = () => {
  const { goToDataFiles } = useNavigation()
  return (
    <div className='chat-header-container'>
      <div className='left-actions-panel'>
        <FButton content='Data Files' onClick={goToDataFiles} secondary />
      </div>
      <div className='figure-logo'>
        <img src={FigureLogo} alt='logo' />
      </div>
      <div className='right-actions-panel'>
        <FButton content='Contact Us' secondary />
      </div>
    </div>
  )
}

export default ChatHeader
