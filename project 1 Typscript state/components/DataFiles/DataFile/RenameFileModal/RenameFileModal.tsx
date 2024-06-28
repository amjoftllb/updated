import { FormControl, Modal, TextField, Typography } from "@mui/material"
import { FButton } from "../../../../util"
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react"
import { useOnClickOutside } from "usehooks-ts"
import './rename-file-modal.css'

interface IRenameFileModal {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const RenameFileModal = (props: IRenameFileModal) => {
  const { open, setOpen } = props

  const [renameInput, setRenameInput] = useState("")
  const renameModalRef = useRef<HTMLDivElement>(null)

  const handleClickOutsideRenameModal = () => {
    // Your custom logic here
    setOpen(false)
  }

  useOnClickOutside(renameModalRef, handleClickOutsideRenameModal)

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRenameInput(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter" && open) {
      setOpen(false)
      handleSubmitRename()
    }
  }

  const handleCloseRenameModal = useCallback(() => {
    setOpen(false)
    setRenameInput("")
  }, [setOpen])

  const handleSubmitRename = useCallback(async () => {
    // setLoading(true)
    handleCloseRenameModal()
    console.log(renameInput)
  }, [handleCloseRenameModal, renameInput])

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        handleCloseRenameModal()
      }}
      className='rename-modal-container'
      ref={renameModalRef}
    >
      <FormControl fullWidth className='rename-form-container'>
        <Typography>Please enter a new file name</Typography>
        <TextField
          type='text'
          onKeyDown={handleKeyDown}
          onChange={handleChangeInput}
          className='onboarding-flow-input-container'
          value={renameInput}
          variant='outlined'
          inputProps={{ className: "onboarding-flow-input" }}
        />
        <FButton content='Submit' onClick={handleSubmitRename} />
      </FormControl>
    </Modal>
  )
}

export default RenameFileModal
