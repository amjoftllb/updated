// import React from "react"
import { useNavigate } from "react-router-dom"

const useNavigation = () => {
  const navigate = useNavigate()
  const goToRoot = () => {
    navigate("/")
  }
  const goToOnboarding = () => {
    navigate("/onbaording")
  }
  const goToDataFiles = () => {
    navigate("/data-files")
  }
  const goToChat = () => {
    navigate("/chat")
  }
  const goToGetStarted = () => {
    navigate("/login")
  }
  const goToOnboardingFlow = () => {
    navigate("/login")
  }

  return {
    goToGetStarted,
    goToChat,
    goToDataFiles,
    goToRoot,
    goToOnboarding,
    goToOnboardingFlow
  }
}

export default useNavigation
