import React, { ReactNode } from "react"
import "./icon-button.css"
import FButton from "../FButton"
import Icon from "../Icon/Icon"
import clsx from "clsx"

interface IIconButton {
  src?: string
  alt?: string
  content?: string
  className?: string
  iconClassName?: string
  removeDefaultClassName?: boolean
  removeDefaultIconClassName?: boolean
  onClick?: (event: any) => void
  children?: ReactNode | ReactNode[]
}

/**
 * in case of injecting children => prioritize over 'content'
 */
const IconButton = (props: IIconButton) => {
  const {
    alt,
    src,
    iconClassName,
    removeDefaultIconClassName,
    className,
    removeDefaultClassName,
    children,
    onClick,
    content
  } = props
  return (
    <FButton
      className={clsx(
        !removeDefaultClassName && "icon-button-container",
        className
      )}
      onClick={onClick}
      content={content}
    >
      {children ||
        (alt && src && (
          <Icon
            src={src}
            alt={alt}
            className={iconClassName}
            removeDefaultClassName={removeDefaultIconClassName}
          />
        ))}
    </FButton>
  )
}

export default IconButton
