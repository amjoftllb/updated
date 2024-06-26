export const waitForNSeconds = (n = 5): Promise<{ data: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: "OK" })
    }, n * 1000)
  })
}

/**
send an object with the 
 */
export const extractVariableName = (elm: any) => Object.keys({ ...elm })[0]

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
