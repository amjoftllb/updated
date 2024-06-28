import React from "react"
import "./login.css"
import { FigureLogo, OnboardingBackground } from "../../../assets"
import { Link } from "react-router-dom"
import Icon from "../../../util/components/Icon"
import { Typography } from "@mui/material"
import { FButton } from "../../../util"
import useNavigation from "../../../hooks/useNavigation"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

const LogInScreen = () => {
  const { goToGetStarted, goToOnboardingFlow } = useNavigation()

  return (
    <div className='log-in-screen-container'>
      <div className='login-background-container'>
        <LoginHeader />
        <div className='sign-register-container'>
          <div className='sign-resiter-content'>
            <Typography variant='h4'>Your new AI Assistant</Typography>
            <Typography variant='subtitle1'>
              Get AI-Generated Data Solutions in Seconds
            </Typography>
            <div className='action-btns'>
              <FButton
                content='Sign in'
                secondary
                onClick={goToOnboardingFlow}
              />
              <FButton content='Get Started' onClick={goToGetStarted} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const LoginHeader = () => {
  return (
    <>
      <Icon
        src={FigureLogo}
        alt='onboarding-figure-logo'
        className='onboarding-figure-logo'
      />
      <nav className='navigation-container'>
        <span className='navigation-link'>
          <Link to='/#'>About</Link>
          {/* <Link to='/about'>About</Link> */}
        </span>
        <span className='navigation-link'>
          <Link to='/#'>FAQ</Link>
          {/* <Link to='/faq'>FAQ</Link> */}
        </span>
        <span className='navigation-link'>
          <Link to='/#'>Contact</Link>
          {/* <Link to='/contact'>Contact</Link> */}
        </span>
      </nav>
    </>
  )
}

export default LogInScreen
