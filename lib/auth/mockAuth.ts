import { create } from "zustand"
import { persist } from "zustand/middleware"

// Mock user types - similar to Auth.js structure
export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  image?: string
}

// Mock session type - similar to Auth.js structure
export interface Session {
  user: User | null
  expires: string // ISO date string
}

// Auth store state
interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  signOut: () => void
}

// Mock admin credentials - in a real app, this would be in a database
const MOCK_ADMIN = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin" as const,
  password: "admin123", // In a real app, this would be hashed
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isAdmin: false,

      // Mock sign in function
      signIn: async (username: string, password: string) => {
        // Check if credentials match mock admin
        if (username === "admin" && password === MOCK_ADMIN.password) {
          const expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + 7) // Session expires in 7 days

          const user = { ...MOCK_ADMIN }
          delete (user as any).password

          const session = {
            user,
            expires: expiryDate.toISOString(),
          }

          set({
            user,
            session,
            isAuthenticated: true,
            isAdmin: user.role === "admin",
          })

          return { success: true, message: "Signed in successfully" }
        }

        return { success: false, message: "Invalid credentials" }
      },

      // Mock sign out function
      signOut: () => {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isAdmin: false,
        })
      },
    }),
    {
      name: "auth-store",
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    },
  ),
)

// Auth helper functions - similar to Auth.js API
export const getSession = async (): Promise<Session | null> => {
  const { session } = useAuthStore.getState()

  // Check if session is expired
  if (session && new Date(session.expires) < new Date()) {
    useAuthStore.getState().signOut()
    return null
  }

  return session
}

export const getUser = async (): Promise<User | null> => {
  const { user } = useAuthStore.getState()
  return user
}

export const isAdmin = async (): Promise<boolean> => {
  const { isAdmin } = useAuthStore.getState()
  return isAdmin
}

// Auth.js-like wrapper for easy replacement later
export const auth = {
  getSession,
  getUser,
  signIn: useAuthStore.getState().signIn,
  signOut: useAuthStore.getState().signOut,
  isAdmin,
}
