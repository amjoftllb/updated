import React, { ChangeEvent, useCallback, useState } from "react"

const useCsv = (file: File) => {
  const [csvData, setCsvData] = useState<Record<string, string>[]>([{}])

  const parseCSV = useCallback((csvText: string) => {
    const lines = csvText.split("\n")
    const headers = lines[0].split(",")
    const parsedData = []

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",")

      if (currentLine.length === headers.length) {
        const row: Record<string, string> = {}
        for (let j = 0; j < headers.length; j++) {
          row[headers[j].trim()] = currentLine[j].trim()
        }
        parsedData.push(row)
      }
    }

    setCsvData(parsedData)
  }, [])

  const handleParseCSV = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const reader = new FileReader()

      reader.onload = (e: any) => {
        const csvText: string = e.target.result
        console.log(csvText)
        parseCSV(csvText)
      }
      console.log(file)

      reader.readAsText(file)
    },
    [file, parseCSV]
  )

  return { parseCSV, handleParseCSV, csvData }
}

export default useCsv
