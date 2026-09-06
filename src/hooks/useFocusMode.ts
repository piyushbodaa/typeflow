import { createContext, useContext } from 'react'

interface FocusModeValue {
  focused: boolean
  setFocused: (value: boolean) => void
}

export const FocusModeContext = createContext<FocusModeValue>({
  focused: false,
  setFocused: () => {},
})

export function useFocusMode() {
  return useContext(FocusModeContext)
}
