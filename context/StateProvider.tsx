import { useContext, useState, createContext } from 'react'

// typescriptの場合、createContextを使うときは、
// 今回の場合toggle, setToggleの型をcreateContextの引数に指定する必要がある
const StateContext = createContext(
  {} as {
    toggle: boolean
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
  }
)

export const StateProvider: React.FC = ({ children }) => {
  const [toggle, setToggle] = useState(false)

  return (
    // StateContext.Providerのvalueには、グローバルで管理したい値を渡す
    <StateContext.Provider value={{ toggle, setToggle }}>
      {children}
    </StateContext.Provider>
  )
}

// stateを取得するためのカスタムフック
export const useStateContext = () => useContext(StateContext)
