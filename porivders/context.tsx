"use client"
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"

interface MovieContextType {
  lists: Record<string, any[]>
  setlists: (lists: Record<string, any[]>) => void
}

const MovieContext = createContext<MovieContextType | null>(null)

export function MovieProvider({ children }: { children: ReactNode }) {
  const [lists, setlists] = useState<Record<string, any[]>>({
    "List 1": [],
  })

  useEffect(() => {
    const saved = localStorage.getItem("horrorMovieLists")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Only use saved data if it's a valid object with at least one key
        if (
          parsed &&
          typeof parsed === "object" &&
          Object.keys(parsed).length > 0
        ) {
          // Filter out invalid list names (like "0", empty strings, etc.)
          const validLists: Record<string, any[]> = {}
          Object.keys(parsed).forEach((key) => {
            // Only keep lists with valid names (not "0", not empty)
            if (
              key &&
              key.trim() !== "" &&
              key !== "0" &&
              Array.isArray(parsed[key])
            ) {
              validLists[key] = parsed[key]
            }
          })

          // If we have valid lists, use them. Otherwise, use default "List 1"
          if (Object.keys(validLists).length > 0) {
            setlists(validLists)
          } else {
            setlists({ "List 1": [] })
          }
        }
      } catch (error) {
        console.error("Failed to parse saved lists:", error)
        // Keep default "List 1"
      }
    }
  }, [])

  useEffect(() => {
    if (Object.keys(lists).length > 0) {
      localStorage.setItem("horrorMovieLists", JSON.stringify(lists))
    } else {
      localStorage.removeItem("horrorMovieLists")
    }
  }, [lists])

  return (
    <MovieContext.Provider value={{ lists, setlists }}>
      {children}
    </MovieContext.Provider>
  )
}

export function useMovieContext() {
  const context = useContext(MovieContext)
  if (!context) {
    throw new Error("useMovieContext must be used within a MovieProvider")
  }
  return context
}
