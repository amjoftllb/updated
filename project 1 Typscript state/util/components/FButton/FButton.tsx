import React, { ReactNode, forwardRef } from "react"
import Button from "@mui/material/Button"
import "./fbutton.css"
import clsx from "clsx"

interface IFButton {
  content?: string
  onClick?: (event: any) => void
  className?: string
  primary?: boolean
  secondary?: boolean
  alert?: boolean
  disabled?: boolean
  children?: ReactNode | ReactNode[]
}
/**
 * in case of injecting children => prioritize over 'content'
 */
const FButton = forwardRef<HTMLButtonElement, IFButton>(
  (props: IFButton, ref) => {
    const {
      content,
      alert,
      className,
      onClick,
      primary = true,
      secondary = false,
      disabled = false,
      children
    } = props
    return (
      <Button
        className={clsx("fbtn-container", className, {
          primary,
          secondary,
          alert
        })}
        onClick={onClick}
        variant='outlined'
        ref={ref}
        disabled={disabled}
      >
        {children || content}
      </Button>
    )
  }
)

export default FButton
