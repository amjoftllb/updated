import React, { useCallback, useEffect, useState } from "react"
import "./csv-table.css"
import { useTable } from "react-table"
import Papa from "papaparse"

interface ICSVTable {
  // data: Record<string, string>[]
  file: File
}
const CSVTable = (props: ICSVTable) => {
  const { file } = props
  const [columns, setColumns] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleParseCSV(file)
    }
  }

  const handleParseCSV = useCallback(
    (currentFile?: File) => {
      if (currentFile) {
        Papa.parse<string[]>(currentFile || file, {
          complete: (result) => {
            const rows = result.data
            if (rows.length > 0) {
              // Use the first row as the header names
              const headerNames = rows[0].map((header: string) => ({
                Header: header,
                accessor: header
              }))
              setColumns(headerNames)
              setData(
                rows.slice(1).map((row: any) => {
                  return row.reduce((obj: any, cell: any, index: number) => {
                    obj[headerNames[index].accessor] = cell
                    return obj
                  }, {})
                })
              )
            }
          },
          header: false
        })
      }
    },
    [file]
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  useEffect(() => {
    handleParseCSV()
  }, [handleParseCSV])

  return (
    <div className='csv-table-container'>
      {!columns.length && (
        <input type='file' accept='.csv' onChange={handleFileChange} />
      )}
      <table {...getTableProps()} className='table-container'>
        <thead className='headers-container'>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className='header'>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className='data-container'>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className='cell-row'>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className='cell'>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default CSVTable
