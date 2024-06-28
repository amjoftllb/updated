import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"
import "./update-file-modal.css"
import FileUpload from "../../FileUpload/FileUpload"
import { FButton, waitForNSeconds } from "../../../../util"
import { Dialog, ToggleButton, Typography } from "@mui/material"
import { useOnClickOutside } from "usehooks-ts"
import { DataFileType } from "../../../../types"

interface IUpdateFileModal {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  currentFile: DataFileType
  onUpdate: (file: File, id: string) => void
}
const UpdateFileModal = (props: IUpdateFileModal) => {
  const { open, setOpen, currentFile, onUpdate } = props
  const updateModalRef = useRef<HTMLDivElement>(null)

  const [updateResponse, setUpdateReponse] = useState({ recieved: false })
  const [loading, setLoading] = useState(false)
  const [newFile, setNewFile] = useState<File>()
  const [selectedUploadNew, setSelectedUploadNew] = useState(false)
  const [selectedAddColumn, setSelectedAddColumn] = useState(false)
  const [isSubmitUpdateFile, setIsSubmitUpdateFile] = useState(false)
  const [error, setError] = useState({
    title: "Incorrect File Structure",
    content:
      "We’ve detected some gaps between the original file and the uploaded file. The new file contains a column named “לורם איפסום” while the original file doesn’t. "
  })

  const handleCloseUpdateModal = useCallback(() => {
    setOpen(false)
    setTimeout(() => setNewFile(undefined), 200)
    setIsSubmitUpdateFile(false)
    setUpdateReponse({ recieved: false })
  }, [setOpen])

  const handleNewFile = useCallback((file: File) => {
    setNewFile(file)
  }, [])

  const handleSubmitErrorResponse = useCallback(async () => {
    if (newFile) {
      setLoading(true)
      console.log("init submit error response")
      await waitForNSeconds(2)
      handleCloseUpdateModal()
      console.log("submitted error response", {
        addColumn: selectedAddColumn,
        uploadNew: selectedUploadNew
      })
      onUpdate(newFile, currentFile.id)
      setLoading(false)
    }
  }, [
    currentFile.id,
    handleCloseUpdateModal,
    newFile,
    onUpdate,
    selectedAddColumn,
    selectedUploadNew
  ])

  const handleSubmitUpdateFile = useCallback(async () => {
    setLoading(true)
    setIsSubmitUpdateFile(true)
    console.log("init submit file")
    console.dir(newFile)
    await waitForNSeconds(4) // post to back
    // if(error) // trigger error confirmation window
    setUpdateReponse({ recieved: true })
    console.log("submitted file")
    setLoading(false)
  }, [newFile])

  const handleClickOutsideUpdateModal = () => {
    // Your custom logic here
    setOpen(false)
  }

  useOnClickOutside(updateModalRef, handleClickOutsideUpdateModal)

  useEffect(() => {
    if (updateResponse.recieved && !error) {
      setOpen(false)
    }
  }, [error, setOpen, updateResponse.recieved])

  return (
    <Dialog
      classes={{ paper: "update-file-modal-container" }}
      PaperProps={{ ref: updateModalRef }}
      onClose={handleCloseUpdateModal}
      open={open}
    >
      <div className='update-modal-content-container'>
        {newFile && loading && isSubmitUpdateFile && (
          <div className='loading-container'>Loading</div>
        )}
        {newFile && !loading && isSubmitUpdateFile && error ? (
          <div className='update-error-confirmation-container'>
            <div className='update-error-content'>
              <Typography variant='h5' className='confirmation-title'>
                {error.title}
              </Typography>
              <Typography variant='body1' className='confirmation-content'>
                {error.content}
              </Typography>
            </div>
            <div className='actions-container'>
              <ToggleButton
                classes={{ selected: "selected" }}
                value='check'
                selected={selectedUploadNew}
                className='confirm-action-btn'
                onChange={() => {
                  setSelectedUploadNew(!selectedUploadNew)
                  setSelectedAddColumn(false)
                }}
              >
                Upload new file
              </ToggleButton>
              <ToggleButton
                classes={{ selected: "selected" }}
                value='check'
                selected={selectedAddColumn}
                className='confirm-action-btn'
                onChange={() => {
                  setSelectedAddColumn(!selectedAddColumn)
                  setSelectedUploadNew(false)
                }}
              >
                Add Column to the original file
              </ToggleButton>
            </div>
            <FButton
              className='updpate-continue-btn'
              content='Continue'
              disabled={!selectedAddColumn && !selectedUploadNew}
              onClick={handleSubmitErrorResponse}
            />
          </div>
        ) : (
          <div className=''></div>
        )}
        {!isSubmitUpdateFile && (
          <>
            <Typography variant='h5' className='update-modal-title'>
              Update your data files
            </Typography>
            <Typography variant='h6' className='update-modal-title'>
              Upload a new data file in the same format as the “
              {currentFile.name}”
            </Typography>
            <FileUpload variant='update' onDrop={handleNewFile} />
            <FButton
              disabled={!newFile}
              content='Continue'
              onClick={handleSubmitUpdateFile}
            />
          </>
        )}
      </div>
    </Dialog>
  )
}

export default UpdateFileModal
