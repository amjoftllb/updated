import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react"
import "./onboarding-flow.css"
import { ONBOARDING_QUESTIONS, Question } from "../../../consts"
import { Close, Confirm, Csv, FigureLogo, Send, Upload } from "../../../assets"
import Icon from "../../../util/components/Icon"
import { FButton, formatBytes } from "../../../util"
import {
  FormControl,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography
} from "@mui/material"
import { useDropzone } from "react-dropzone"
import { useFetchData } from "../../../hooks"
import clsx from "clsx"
import useNavigation from "../../../hooks/useNavigation"

type UserResponse = string
type QuestionId = string

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className='onboarding-flow-container'>
      <div className='onboarding-flow-content-container'>
        <div className='onboarding-header-container'>
          <div className='onboarding-flow-figure-logo-container'>
            <Icon
              src={FigureLogo}
              alt='onboarding-flow-figure-logo'
              className='onboarding-flow-figure-logo'
            />
          </div>
          <div className='progress-bar-container'>
            <LinearProgress
              classes={{ bar: "fbar" }}
              className='progress-bar'
              variant='determinate'
              value={((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100}
            />
          </div>
        </div>
        <OnboardingQuestion
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </div>
  )
}

interface IQuestion {
  currentStep: number
  setCurrentStep: Dispatch<SetStateAction<number>>
}

const OnboardingQuestion = (props: IQuestion) => {
  const { currentStep, setCurrentStep } = props

  const { goToChat } = useNavigation()

  const [input, setInput] = useState("")
  const [response, setResponse] = useState()
  const [loading, setLoading] = useState(false)
  const [showTextField, setShowTextfield] = useState(false)
  const [userResponses, setUserResponses] = useState<
    Record<QuestionId, UserResponse>
  >({})

  const handleNext = useCallback(() => {
    setShowTextfield(false)
    if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission or transition to a different component
      goToChat()
      console.log("Final data:", userResponses)
    }
    setLoading(false)
  }, [currentStep, goToChat, setCurrentStep, userResponses])

  const currentQuestion: Question = useMemo(
    () => ONBOARDING_QUESTIONS[currentStep].getQuestion(),
    [currentStep]
  )

  const postAnswer = useCallback(async () => {}, [])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    const response = await postAnswer()
    setResponse(response as unknown as any) // fix when i get response
    handleNext()
  }, [handleNext, postAnswer])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter") {
      handleSubmit()
    }
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
    setUserResponses({
      ...userResponses,
      [currentQuestion.id]: event.target.value
    })
  }

  const { data } = useFetchData()

  return (
    <>
      <div className='question-content-container'>
        <Typography variant='h5' className='question-content'>
          {currentQuestion.content}
        </Typography>
        {currentQuestion.features.fetch && (
          <Typography variant='body1' className='question-fetch-content'>
            Respponse Content
          </Typography>
        )}
      </div>
      {currentQuestion.features.input && (
        <FormControl fullWidth>
          <TextField
            type='text'
            onKeyDown={handleKeyDown}
            onChange={handleChangeInput}
            className='onboarding-flow-input-container'
            value={userResponses[currentQuestion.id] || ""}
            variant='outlined'
            inputProps={{ className: "onboarding-flow-input" }}
          />
        </FormControl>
      )}
      {currentQuestion.features.upload && <FileUpload />}
      {currentQuestion.features.submit && (
        <FButton
          content={
            currentStep < ONBOARDING_QUESTIONS.length - 1 ? "Next" : "Start"
          }
          onClick={handleNext}
        />
      )}
      {showTextField && (
        <FormControl fullWidth className='onbaording-user-textfield-container'>
          <Typography variant='subtitle2' className='textfield-label'>
            What did I get wrong?
          </Typography>
          <TextField
            type='text'
            classes={{ root: "fieldset-container" }}
            onKeyDown={handleKeyDown}
            onChange={handleChangeInput}
            className='onboarding-flow-textfield-container'
            value={userResponses[currentQuestion.id] || ""}
            variant='standard'
            multiline
            minRows={6}
            inputProps={{ className: "onboarding-flow-textfield" }}
            InputProps={{
              disableUnderline: true,
              classes: { root: "base-root-container" },
              endAdornment: (
                <InputAdornment position='end' onClick={handleSubmit}>
                  <IconButton className='send-btn'>
                    <img src={Send} className='send-img' />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </FormControl>
      )}
      {!showTextField && currentQuestion.features.confirm && (
        <div className='confirmation-container'>
          <div className='confirmation-btn-container' onClick={handleNext}>
            <Icon src={Confirm} alt='confirm' className='confirmation-btn' />
          </div>
          <div
            className='confirmation-btn-container'
            onClick={() => setShowTextfield(true)}
          >
            <Icon src={Close} alt='close' className='confirmation-btn' />
          </div>
        </div>
      )}
    </>
  )
}

function FileUpload() {
  const [file, setFile] = useState<File>()
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    setFile(acceptedFiles[0])
    console.log(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const progressRef = useRef<NProgressRef>({ progress: 0 })

  const [shouldShowProgress, setShouldShowProgress] = useState(true)

  const handleProgressUpdate = (value: number) => {
    setShouldShowProgress(value < 100)
  }

  console.log(shouldShowProgress)
  return (
    <div className='file-upload-container'>
      <div
        {...getRootProps()}
        className={clsx("file-upload-content-container", { selected: file })}
      >
        <input {...getInputProps()} className='file-upload-input' />
        {isDragActive ? (
          <span className='file-upload-content'>Drop the files here ...</span>
        ) : (
          <>
            <Icon src={Upload} alt='upload' className='upload-icon' />
            <div className='file-upload-label-container'>
              <span className='file-upload-content'>
                Drag and Drop Files Here
              </span>
              <span className='file-upload-subtext'>
                We accept CSVs, XLSX, and TXT Files
              </span>
            </div>
            <FButton content='Select File' secondary className='file-btn' />
          </>
        )}
      </div>
      {file && (
        <div className='file-progress-container'>
          <div className='csv-icon-container'>
            <Icon src={Csv} alt='csv' className='csv' />
          </div>
          <div className='file-container'>
            <Typography variant='body1'>
              {file?.name || "Loading..."}
            </Typography>

            {shouldShowProgress && (
              <NProgressBar
                onUpdate={handleProgressUpdate}
                time={5}
                ref={progressRef}
              />
            )}
            {!shouldShowProgress && (
              <Typography variant='body2'>{formatBytes(file.size)}</Typography>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

type NProgressRef = { progress: number }

interface INProgressBar {
  time: number
  onUpdate?: (val: number) => void
}

const NProgressBar = forwardRef<NProgressRef, INProgressBar>(
  (props: INProgressBar, ref) => {
    const { time, onUpdate } = props
    const [progress, setProgress] = useState(10)
    const multiplier = 5

    useImperativeHandle(
      ref,
      () => ({
        progress
      }),
      [progress]
    )

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= 100 ? 100 : prevProgress + multiplier
        )
      }, (time * 1000) / (60 / multiplier))
      return () => {
        clearInterval(timer)
      }
    }, [time])

    useEffect(() => {
      if (onUpdate) onUpdate(progress)
    }, [onUpdate, progress])

    return (
      <LinearProgress
        variant='determinate'
        value={progress}
        sx={{ inlineSize: "100%" }}
        className='file-progress-bar-container'
      />
    )
  }
)

export default OnboardingFlow
