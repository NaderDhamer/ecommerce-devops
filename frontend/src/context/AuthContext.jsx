import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [userInfo, setUserInfo] = useState(null)

  // Load user from localStorage
  useEffect(() => {

    const storedUser = localStorage.getItem("userInfo")

    if (storedUser) {
      setUserInfo(JSON.parse(storedUser))
    }

  }, [])

  // Login
  const login = (data) => {

    localStorage.setItem(
      "userInfo",
      JSON.stringify(data)
    )

    setUserInfo(data)
  }

  // Logout
  const logout = () => {

    localStorage.removeItem("userInfo")

    setUserInfo(null)
  }

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}