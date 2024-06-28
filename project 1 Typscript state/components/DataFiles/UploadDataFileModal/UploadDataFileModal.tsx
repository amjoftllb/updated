import { Dialog, TextField, Typography } from "@mui/material"
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState
} from "react"
import "./upload-data-file-modal.css"
import { FButton, waitForNSeconds } from "../../../util"
import FileUpload from "../FileUpload/FileUpload"
import { Close, Confirm } from "../../../assets"
import Icon from "../../../util/components/Icon"

interface IUploadDataFileModal {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onUpload?: (file: File) => void
}

const UploadDataFileModal = (props: IUploadDataFileModal) => {
  const { open, setOpen, onUpload } = props

  const [newFile, setNewFile] = useState<File>()
  const [loading, setLoading] = useState(false)
  const [isSubmitUploadFile, setIsSubmitUploadFile] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null)
  const [uploadResponse, setUploadReponse] = useState<{
    recieved: boolean
    data?: string
  }>({
    recieved: false,
    data: undefined
  })

  const uploadFileModalRef = useRef<HTMLDivElement>(null)

  const handleCloseUploadModal = useCallback(() => {
    setOpen(false)
    setTimeout(() => setNewFile(undefined), 200)
    setIsSubmitUploadFile(false)
    setUploadReponse({ recieved: false, data: undefined })
    setIsConfirmed(null)
  }, [setOpen])

  const handleSubmitResponseValidation = useCallback(async () => {
    if (newFile) {
      setLoading(true)
      console.log("init submit response validation")

      await waitForNSeconds(3)
      handleCloseUploadModal()
      onUpload && onUpload(newFile)
      console.log("submittted response validation")
      setLoading(false)
    }
  }, [handleCloseUploadModal, newFile, onUpload])

  const handleSubmitNewFile = useCallback(async () => {
    if (newFile) {
      setLoading(true)
      setIsSubmitUploadFile(true)
      console.log("init submit file")
      console.dir(newFile)

      await waitForNSeconds(4) // post to back

      setUploadReponse({
        recieved: true,
        data: `Each row in the table represents a lead.
    The columns are describing it’s properties
    The “סטטוס” column define the lead status, with terms like “נרשם”, and ״דרושה שיחה חוזרת״, is that accurate?`
      })
      console.log("submitted file")
      setLoading(false)
    }
  }, [newFile])

  const handleNewFile = useCallback((file: File) => {
    setNewFile(file)
  }, [])

  return (
    <Dialog
      classes={{ paper: "upload-file-modal-container" }}
      PaperProps={{ ref: uploadFileModalRef }}
      onClose={handleCloseUploadModal}
      open={open}
    >
      <div className='upload-modal-content-container'>
        {newFile &&
          loading &&
          isSubmitUploadFile &&
          !uploadResponse.recieved && (
            <div className='loading-container'>Loading</div>
          )}
        {newFile &&
        !loading &&
        isSubmitUploadFile &&
        uploadResponse.recieved ? (
          <div className='upload-error-confirmation-container'>
            <div className='upload-error-content'>
              <Typography variant='h5' className='upload-confirmation-title'>
                {isConfirmed === null
                  ? `Let’s make sure we’re on the same page.`
                  : `What did I get wrong?`}
              </Typography>
              <Typography
                variant='body1'
                className='upload-confirmation-content'
              >
                {isConfirmed === null && uploadResponse.data}
              </Typography>
            </div>
            <div className='actions-container'>
              {isConfirmed === null ? (
                <>
                  <span
                    className='action-btn-cotainer confirm'
                    onClick={handleSubmitResponseValidation}
                  >
                    <Icon
                      src={Confirm}
                      alt='confirm'
                      className='confirm-upload-img'
                    />
                  </span>
                  <span
                    className='action-btn-cotainer close'
                    onClick={() => setIsConfirmed(false)}
                  >
                    <Icon
                      src={Close}
                      alt='close'
                      className='close-upload-img'
                    />
                  </span>
                </>
              ) : (
                !isConfirmed && (
                  <div className='confirmation-io-container'>
                    <TextField multiline />

                    <FButton
                      content='Continue'
                      onClick={handleSubmitResponseValidation}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className=''></div>
        )}
        {!isSubmitUploadFile && (
          <>
            <Typography variant='h5' className='upload-modal-title'>
              Upload New Data Files
            </Typography>
            <Typography variant='h6' className='upload-modal-title'>
              Adding data files will allow you to question them and learn more
              about what you have in your data!
            </Typography>
            <FileUpload variant='new' onDrop={handleNewFile} />
            <FButton
              disabled={!newFile}
              content='Continue'
              onClick={handleSubmitNewFile}
            />
          </>
        )}
      </div>
    </Dialog>
  )
}

export default UploadDataFileModal
