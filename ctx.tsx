import { createContext, use, useContext, type PropsWithChildren } from "react"
import { useStorageState } from "./useStorageState"

const AuthContext = createContext<{
  signIn: (value: any) => void
  signOut: () => void
  session?: string | null
  isLoading: boolean
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
})

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext)
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />")
  }

  return value
}

export function SessionProvider({ children}: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session")

  return (
    <AuthContext
      value={{
        signIn: (value: any) => {
          // Perform sign-in logic here
          setSession(value)
        },
        signOut: () => {
          setSession(null)
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  )
}

export let useSessionContext = () => useContext(AuthContext)
