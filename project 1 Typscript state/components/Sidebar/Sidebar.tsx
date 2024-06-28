import React from "react"
import "./sidebar.css"
import { Typography } from "@mui/material"
import ConversationsHistory from "./ConversationsHistory"

const Sidebar = () => {
  return (
    <div className='sidebar-container'>
      <Typography variant='h4' className='sidebar-title'>
        Sidebar
      </Typography>
      <ConversationsHistory />
    </div>
  )
}

export default Sidebar
