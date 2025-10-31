"use client"
import { IconSearch } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useMovieContext } from "@/porivders/context"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const { listmovies, setListMovies } = useMovieContext()

  function handleAdd() {
    if (selectedMovie) {
      setListMovies([...listmovies, selectedMovie])
      setSelectedMovie(null)
      console.log("added")
    }
  }

  async function handleQuery() {
    if (!query.trim()) return
    const response = await fetch(`/api/movies?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    setMovies(data.results || [])
    console.log(data.results)
  }

  function handleSearch(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleQuery()
    }
  }

  function handleClick(movie: any) {
    setSelectedMovie(movie)
  }

  useEffect(() => {
    window.addEventListener("keydown", handleSearch)
    return () => {
      window.removeEventListener("keydown", handleSearch)
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="h-10 text-[#252525] items-center flex-row flex bg-[#161616] border border-[#000000] rounded-full px-4">
        <div className="flex items-center justify-center">
          <IconSearch />
        </div>
        <div className="flex items-center flex-1">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-white outline-none bg-transparent px-2"
          />
        </div>
      </div>

      {movies.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {movies.slice(0, 3).map((movie: any) => (
            <div
              key={movie.id}
              onClick={() => handleClick(movie)}
              className="shrink-0 w-32 bg-[#161616] rounded-lg border border-[#000000] overflow-hidden cursor-pointer hover:border-gray-600 transition-colors"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "/assets/placeholder.png"
                }
                alt={movie.title || movie.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-2">
                <h3 className="text-white text-sm font-semibold truncate">
                  {movie.title || movie.name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {movie.release_date || movie.first_air_date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="bg-[#252525] border-2 border-[#3a3a3a] text-white p-8 rounded-lg max-w-6/12 max-h-8/12 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center items-center w-full h-2/12">
              <h2 className="text-2xl font-bold mb-4">
                {selectedMovie.title || selectedMovie.name}
              </h2>
            </div>

            <div className="flex gap-5 flex-row items-center justify-center">
              <div className="h-full p-3 bg-[#1f1f1f] border-black rounded-2xl border flex items-center justify-center">
                {selectedMovie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                    alt={selectedMovie.title || selectedMovie.name}
                    className="rounded-2xl size-100 border border-black"
                  />
                )}
              </div>
              <div className="flex flex-col gap-10 w-1/2">
                <div className="h-full p-5 gap-y-5 rounded-2xl  bg-[#1f1f1f] border-black border flex-col items-center justify-center">
                  {selectedMovie.description || selectedMovie.overview}
                  <br />
                </div>
                <div className="flex p-5 bg-[#1f1f1f] rounded-2xl border-black border w-full">
                  <p>First Realesed in : </p>

                  {selectedMovie.release_date || selectedMovie.first_air_date}
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-center items-center mt-4">
              <button
                className="mt-4 px-4 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
                onClick={handleAdd}
              >
                Add to your list
              </button>
            </div>

            <button
              onClick={() => setSelectedMovie(null)}
              className="mt-4 px-4 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
