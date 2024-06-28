import { Dialog, Typography } from "@mui/material"
import React, { Dispatch, SetStateAction, useCallback, useRef } from "react"
import { FButton } from "../../../../util"
import "./delete-file-modal.css"

interface IDeleteFileModal {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onDelete?: () => void
}
const DeleteFileModal = (props: IDeleteFileModal) => {
  const { open, setOpen, onDelete } = props
  const deleteFileModalRef = useRef<HTMLDivElement>(null)

  const handleCloseDeleteModal = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog
      classes={{ paper: "delete-file-modal-container" }}
      PaperProps={{ ref: deleteFileModalRef }}
      onClose={handleCloseDeleteModal}
      open={open}
    >
      <div className='delete-modal-content-container'>
        <Typography variant='h5' className='delete-file-title'>
          Are you sure you want to delete this data file?
        </Typography>
        <FButton alert secondary content='Delete' onClick={onDelete} />
      </div>
    </Dialog>
  )
}

export default DeleteFileModal
