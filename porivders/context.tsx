"use client"
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"

interface MovieContextType {
  listmovies: any[]
  setListMovies: (movies: any[]) => void
}

const MovieContext = createContext<MovieContextType | null>(null)

export function MovieProvider({ children }: { children: ReactNode }) {
  const [listmovies, setListMovies] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("horrorMovieList")
    if (saved) {
      setListMovies(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (listmovies.length > 0) {
      localStorage.setItem("horrorMovieList", JSON.stringify(listmovies))
    }
  }, [listmovies])

  return (
    <MovieContext.Provider value={{ listmovies, setListMovies }}>
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
