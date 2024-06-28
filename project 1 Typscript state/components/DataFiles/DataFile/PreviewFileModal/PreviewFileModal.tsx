import React, { Dispatch, SetStateAction, useCallback, useRef } from "react"
import "./preview-file-modal.css"
import useCsv from "../../../../hooks/useCsv"
import CSVTable from "../../../../util/components/CSVTable"
import { Dialog } from "@mui/material"
import { DUMMY_FILE } from "../../../../consts"

interface IPreviewFileModal {
  file: File
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
const PreviewFileModal = (props: IPreviewFileModal) => {
  const { file, open, setOpen } = props

  const previewFileModalRef = useRef<HTMLDivElement>(null)
  const handleClosePreviewModal = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  //   console.log(csvData)

  return (
    <Dialog
      classes={{ paper: "preview-file-modal-container" }}
      PaperProps={{ ref: previewFileModalRef }}
      onClose={handleClosePreviewModal}
      open={open}
    >
      <div className='preview-modal-content-container'>
        <CSVTable file={DUMMY_FILE} />
      </div>
    </Dialog>
  )
}

export default PreviewFileModal
