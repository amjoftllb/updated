import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {logoutUser} from "../../store/actions/auth.action.js"


function LogoutBtn() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

    const logoutHandler = async() => { 
        dispatch(logoutUser())
        navigate("/Login")
    }

  return (
    <button
    className='px-2 py-1 font-bold border text-white duration-200 hover:bg-blue-100  hover:text-black rounded-sm'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn