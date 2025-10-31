"use client"
import { createContext, useContext, useState, ReactNode } from "react"

interface MovieContextType {
  listmovies: any[]
  setListMovies: (movies: any[]) => void
}

const MovieContext = createContext<MovieContextType | null>(null)

export function MovieProvider({ children }: { children: ReactNode }) {
  const [listmovies, setListMovies] = useState<any[]>([])

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
