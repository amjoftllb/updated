/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react"
import { ProviderProps } from "../types"

type User = {
  name: string
}

interface IUserDataContext {
  user: User
}
const defaultUserDataContext: IUserDataContext = { user: { name: "Idan" } }

const UserDataContext = createContext<IUserDataContext>(defaultUserDataContext)

export const UserDataProvider: React.FC<ProviderProps> = ({ children }) => {
  const [name, setName] = useState("Idan")

  const user: User = useMemo(() => ({ name }), [name])
  const providerMemo = useMemo(() => ({ user }), [user])

  return (
    <UserDataContext.Provider value={providerMemo}>
      {children}
    </UserDataContext.Provider>
  )
}

export const useUserDataContext = () => useContext(UserDataContext)
