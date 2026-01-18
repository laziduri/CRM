'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface ClientData {
  id: string
  name: string
  email: string
  username?: string
  phone: string
  profilePicture?: string
  consultant?: {
    id: string
    name: string
    email: string
  }
}

interface AuthContextType {
  isAuthenticated: boolean
  client: ClientData | null
  isLoading: boolean
  login: (token: string, clientId: string) => void
  logout: () => void
  refreshClient: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [client, setClient] = useState<ClientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    const token = localStorage.getItem('client_token')
    const clientId = localStorage.getItem('client_id')

    if (!token || !clientId) {
      setIsAuthenticated(false)
      setClient(null)
      setIsLoading(false)
      return
    }

    // Verify token and fetch client data
    try {
      const response = await fetch(`/api/client/${clientId}`)
      if (response.ok) {
        const data = await response.json()
        setClient(data.client)
        setIsAuthenticated(true)
      } else {
        // Token invalid, clear storage
        localStorage.removeItem('client_token')
        localStorage.removeItem('client_id')
        setIsAuthenticated(false)
        setClient(null)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setIsAuthenticated(false)
      setClient(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (token: string, clientId: string) => {
    localStorage.setItem('client_token', token)
    localStorage.setItem('client_id', clientId)
    setIsAuthenticated(true)
    checkAuth()
  }

  const logout = () => {
    localStorage.removeItem('client_token')
    localStorage.removeItem('client_id')
    setIsAuthenticated(false)
    setClient(null)
    router.push('/client/login')
  }

  const refreshClient = async () => {
    const clientId = localStorage.getItem('client_id')
    if (!clientId) return

    try {
      const response = await fetch(`/api/client/${clientId}`)
      if (response.ok) {
        const data = await response.json()
        setClient(data.client)
      }
    } catch (error) {
      console.error('Error refreshing client data:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        client,
        isLoading,
        login,
        logout,
        refreshClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
