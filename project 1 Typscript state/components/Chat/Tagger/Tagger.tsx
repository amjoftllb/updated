import React, { useCallback, useState } from "react"
import { Like, Dislike } from "../../../assets"
import Icon from "../../../util/components/Icon"
import { extractVariableName } from "../../../util"
import "./tagger.css"
import { TagButton, TagType } from "../../../types"

const DEFAULT_BTNS: TagButton[] = [
  { image: Like, name: "like" },
  { image: Dislike, name: "dislike" }
]

interface ITagger {
  btns?: TagButton[]
}

const Tagger = (props: ITagger) => {
  const { btns = DEFAULT_BTNS } = props
  const [currentButtons, setCurrentButtons] = useState(btns)

  const handleTag = useCallback((type: TagType) => {
    console.log(`${type} tag`)
  }, [])

  return (
    <div className='tagger-container'>
      {currentButtons.map((btn) => (
        <div className='tag-btn-container' onClick={() => handleTag(btn.name)}>
          <Icon src={btn.image} alt={btn.name} className='tag' />
        </div>
      ))}
    </div>
  )
}

export default Tagger
