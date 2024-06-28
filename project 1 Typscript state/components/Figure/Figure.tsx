import { Dispatch, SetStateAction, useState } from "react"
import Chat from "../Chat"
import DataFiles from "../DataFiles"
import Onboarding from "../Onboarding"
import GetStarted from "../Onboarding/GetStarted"
import OnboardingFlow from "../Onboarding/OnboardingFlow"
import Sidebar from "../Sidebar"
import "./figure.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { DataFileType } from "../../types"
import { DUMMY_DATA_FILES } from "../../consts"
import Login from "../Onboarding/LoginPage/Login"

function Figure() {
  const [dataFiles, setDataFiles] = useState<DataFileType[]>(DUMMY_DATA_FILES)
  return (
    <Router>
      <Routes>
        <Route path='/onboarding' element={<OnboardingView />} />
        <Route path='/onboarding-flow' element={<OnboardingFlowView />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<ChatView />} />
        <Route
          path='/data-files'
          element={
            <DataFilesView dataFiles={dataFiles} setDataFiles={setDataFiles} />
          }
        />
        <Route path='/get-started' element={<GetStartedView />} />
      </Routes>
    </Router>
  )
}

const ChatView = () => {
  return (
    <div className='figure-app'>
      <Sidebar />
      <Chat />
    </div>
  )
}

interface IDataFilesView {
  dataFiles: DataFileType[]
  setDataFiles: Dispatch<SetStateAction<DataFileType[]>>
}
const DataFilesView = (props: IDataFilesView) => {
  const { dataFiles, setDataFiles } = props

  return (
    <div className='figure-app'>
      <Sidebar />
      <DataFiles dataFiles={dataFiles} setDataFiles={setDataFiles} />
    </div>
  )
}

const OnboardingView = () => {
  return (
    <div className='figure-app'>
      <Onboarding />
    </div>
  )
}

const OnboardingFlowView = () => {
  return (
    <div className='figure-app'>
      <OnboardingFlow />
    </div>
  )
}

const GetStartedView = () => {
  return (
    <div className='figure-app'>
      <GetStarted />
    </div>
  )
}
export default Figure
