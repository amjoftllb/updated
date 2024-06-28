import React, { useCallback, useState } from "react"
import { Confirm, Upload } from "../../../assets"
import Icon from "../../../util/components/Icon"
import clsx from "clsx"
import { useDropzone } from "react-dropzone"
import "./file-upload.css"

interface IFileUpload {
  variant: "update" | "new"
  onDrop: (file: File) => void
}

function FileUpload(props: IFileUpload) {
  const { variant, onDrop } = props
  const [newFile, setNewFile] = useState<File>()
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      onDrop(acceptedFiles[0])
      setNewFile(acceptedFiles[0])
    },
    [onDrop]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop
  })

  return (
    <div className='data-file-upload-container'>
      <div
        {...getRootProps()}
        className={clsx("data-file-upload-content-container", {
          selected: newFile
        })}
      >
        <input {...getInputProps()} className='data-file-upload-input' />
        {isDragActive ? (
          <span className='data-file-upload-content'>
            Drop the files here ...
          </span>
        ) : (
          <>
            <Icon src={Upload} alt='upload' className='upload-icon' />
            <div className='data-file-upload-label-container'>
              {newFile ? (
                <Icon src={Confirm} alt='confirm' />
              ) : (
                <span className='data-file-upload-content'>
                  Drag and drop updated file here
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <span className='data-file-upload-subtext'>
        {variant === "new"
          ? "We accept CSVs, XLSX, and TXT Files"
          : "The file must have the same structure as the original file, we will take care of duplications."}
      </span>
    </div>
  )
}

export default FileUpload
