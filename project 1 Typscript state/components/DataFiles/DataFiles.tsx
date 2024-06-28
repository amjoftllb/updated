import React, { Dispatch, SetStateAction, useState } from "react"
import "./data-files.css"
import { Typography } from "@mui/material"
import { FButton } from "../../util"
import { FigureLogo, Plus } from "../../assets"
import Icon from "../../util/components/Icon"
import { DUMMY_FILE } from "../../consts"
import DataFile from "./DataFile"
import UploadDataFileModal from "./UploadDataFileModal"
import { DataFileType, ToastType } from "../../types"
import { ToastsService } from "../../services"

interface IDataFiles {
  dataFiles: DataFileType[]
  setDataFiles: Dispatch<SetStateAction<DataFileType[]>>
}
const DataFiles = (props: IDataFiles) => {
  const { dataFiles, setDataFiles } = props
  const [uploadFileModalOpen, setUploadFileModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<ToastType | null>(null)

  const handleDeleteFile = (id: string) => {
    const filteredDataFiles = dataFiles.filter((dataFile) => dataFile.id !== id)
    setDataFiles(filteredDataFiles)
  }

  const onUpdateFile = (file: File, id: string) => {
    const files = dataFiles
    files.forEach((currentFile) => {
      if (currentFile.id === id) {
        currentFile.name = file.name
      }
    })

    setDataFiles(files)
  }

  const onUploadNewFile = (file: File) => {
    const dataFile: DataFileType = {
      id: "random",
      lastUpdated: new Date(),
      updatedBy: "Sagiv Mishaan",
      name: file.name,
      summary: "Arbitrary summary",
      originalFile: DUMMY_FILE
    }
    setDataFiles((prevDataFiles) => [...prevDataFiles, dataFile])
    newToast("Your data was added successfully!", "success")
  }

  const newToast = (message: string, type?: ToastType) => {
    if (type) setToastType(type)
    setToastMessage(message)
    setShowToast(true)
  }

  const clearToast = () => {
    setToastMessage("")
    setShowToast(false)
    setToastType(null)
  }

  return (
    <div className='data-files-container'>
      <ToastsService
        open={showToast}
        onClose={clearToast}
        message={toastMessage}
        setOpen={setShowToast}
        type={toastType}
      />

      <UploadDataFileModal
        open={uploadFileModalOpen}
        setOpen={setUploadFileModalOpen}
        onUpload={onUploadNewFile}
      />
      <div className='data-files-wrapper'>
        {/* <ChatHeader /> */}
        <div className='data-files-header'>
          <FButton content='Data Files' secondary className='header-btn' />
          <Icon
            src={FigureLogo}
            alt='figure-logo'
            className='data-files-figure-logo'
          />
          <FButton content='Contact Us' secondary className='header-btn' />
        </div>

        <div className='data-files-content'>
          <div className='data-files-top'>
            <Typography variant='h4'>Data Files</Typography>
            <FButton
              onClick={() => {
                setUploadFileModalOpen(true)
              }}
              className='upload-data-file-btn'
            >
              <div className='btn-content'>
                <span className='upload-data-file-btn-label'>
                  Upload Data File
                </span>
                <Icon src={Plus} alt='plus' className='upload-icon' />
              </div>
            </FButton>
          </div>
          <div className='data-files'>
            {dataFiles.map((dataFile) => (
              <DataFile
                file={dataFile}
                newToast={newToast}
                onDelete={handleDeleteFile}
                onUpdate={onUpdateFile}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataFiles
