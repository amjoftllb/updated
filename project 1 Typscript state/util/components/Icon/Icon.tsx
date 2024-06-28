import React from "react"
import "./icon.css"
import clsx from "clsx"

interface IIcon {
  src: string
  alt: string
  className?: string
  removeDefaultClassName?: boolean
}

const Icon = (props: IIcon) => {
  const { src, alt, removeDefaultClassName, className = "" } = props
  return (
    <img
      className={clsx(removeDefaultClassName ? "" : "f-icon", className)}
      src={src}
      alt={alt}
    />
  )
}

export default Icon
