import { useContext, createContext } from 'react'
import { IRootStore } from 'stores'

const StoreContext = createContext<IRootStore | undefined>(undefined)

export const useStore = () => useContext(StoreContext)!
export const StoreProvider = StoreContext.Provider
