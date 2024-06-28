import React, { useState } from "react"

const useFetchData = () => {
  const [data, setData] = useState([])

  return { data }
}

export default useFetchData
