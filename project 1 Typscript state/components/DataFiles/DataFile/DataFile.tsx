import React, { useRef, useState } from "react"
import { DataFileType, ToastType } from "../../../types"
import { useOnClickOutside } from "usehooks-ts"
import { FButton, Icon } from "../../../util"
import { Popper, Typography } from "@mui/material"
import moment from "moment"
import "./data-file.css"
import UpdateFileModal from "./UpdateFileModal"
import DeleteFileModal from "./DeleteFileModal"
import PreviewFileModal from "./PreviewFileModal/PreviewFileModal"
import RenameFileModal from "./RenameFileModal"
import { Reload } from "../../../assets"

interface IDataFile {
  file: DataFileType
  newToast: (message: string, type?: ToastType) => void
  onDelete: (id: string) => void
  onUpdate: (file: File, id: string) => void
}

const DataFile = (props: IDataFile) => {
  const { file, newToast, onDelete, onUpdate } = props
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [deleteFileModalOpen, setDeleteFileModalOpen] = useState(false)
  const [previewFileModalOpen, setPreviewFileModalOpen] = useState(false)
  const [updateFileModalOpen, setUpdateFileModalOpen] = useState(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const anchorRef = useRef<HTMLDivElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClickOutsidePopper = () => {
    // Your custom logic here
    setAnchorEl(null)
  }

  useOnClickOutside(anchorRef, handleClickOutsidePopper)

  return (
    <div className='data-file-container'>
      <div className='file-info'>
        <Typography variant='h5'>{file.name}</Typography>
        <Typography variant='h6'>{file.summary}</Typography>
      </div>
      <div className='update-info'>
        <Typography variant='body1'>{file.updatedBy}</Typography>
        <Typography variant='body1'>
          {moment(file.lastUpdated).format("D MMM, YYYY")}
        </Typography>
      </div>
      <div className='data-file-control-container'>
        <FButton
          content='Update'
          secondary
          className='data-file-btn'
          onClick={() => {
            setUpdateFileModalOpen(true)
          }}
        >
          <div className='btn-content'>
            <Icon
              src={Reload}
              alt='update-file-icon'
              className='update-file-icon btn-icon'
            />
            <span className='upload-file-icon-label btn-label'>Update</span>
          </div>
        </FButton>
        <DeleteFileModal
          open={deleteFileModalOpen}
          setOpen={setDeleteFileModalOpen}
          onDelete={() => {
            setDeleteFileModalOpen(false)
            onDelete(file.id)
            newToast("Deleted successfully", "success")
          }}
        />
        <PreviewFileModal
          file={file.originalFile}
          open={previewFileModalOpen}
          setOpen={setPreviewFileModalOpen}
        />
        <UpdateFileModal
          open={updateFileModalOpen}
          setOpen={setUpdateFileModalOpen}
          currentFile={file}
          onUpdate={onUpdate}
        />
        <Popper
          className='data-file-popper-container'
          open={open}
          anchorEl={anchorEl}
          placement='top'
        >
          <div className='data-file-popper-content' ref={anchorRef}>
            <span
              className='popper-option'
              onClick={() => {
                setPreviewFileModalOpen(true)
              }}
            >
              Preview
            </span>
            <span
              className='popper-option'
              onClick={() => setRenameModalOpen(true)}
            >
              Rename
            </span>
            <span
              className='popper-option alert'
              onClick={() => setDeleteFileModalOpen(true)}
            >
              Delete
            </span>
          </div>
        </Popper>
        <FButton
          content='•••'
          secondary
          onClick={handleClick}
          className='data-file-btn options'
        ></FButton>
        <RenameFileModal open={renameModalOpen} setOpen={setRenameModalOpen} />
      </div>
    </div>
  )
}

export default DataFile
