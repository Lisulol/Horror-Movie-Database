"use client"
import { IconSearch } from "@tabler/icons-react"
import { use, useEffect, useState } from "react"
import { useMovieContext } from "@/porivders/context"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const { listmovies, setListMovies } = useMovieContext()
  const [menu, Setmenu] = useState(false)
  const [showalert, setShowAlert] = useState(false)
  const [message, setMessage] = useState("")

  function showalertmessage(message: string) {
    setShowAlert(true)
    setMessage(message)
    setTimeout(() => {
      setShowAlert(false)
    }, 3000)
  }
  function handleAdd() {
    if (selectedMovie) {
      const movieExists = listmovies.some(
        (movie) => movie.id === selectedMovie.id
      )

      if (movieExists) {
        showalertmessage("Movie is already in your list")
        setSelectedMovie(null)
        return
      }

      const updatedList = [...listmovies, selectedMovie]
      setListMovies(updatedList)
      console.log("added", updatedList)
      setSelectedMovie(null)
      showalertmessage("Movie added to your list")
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
      Setmenu(true)
    }
  }
  useEffect(() => {
    handleQuery()
  }, [query])

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
    <>
      {showalert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-9999">
          {message}
        </div>
      )}
      <div className="z-90 flex flex-col gap-4">
        <div className="h-10 text-[#252525] items-center flex-row flex bg-[#161616] border border-[#000000] rounded-full px-4 cursor-pointer hover:border-gray-700 transition-colors">
          <div className="flex items-center justify-center">
            <IconSearch />
          </div>
          <div className="flex items-center flex-1">
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-white outline-none bg-transparent px-2 cursor-pointer"
            />
          </div>
        </div>
        {menu && (
          <div
            onClick={() => Setmenu(false)}
            className="fixed inset-0 bg-black/95 w-full h-screen z-50 flex items-start justify-center pt-20"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl px-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-white text-2xl font-bold">
                    {movies.length} horror movies found
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Search results for "{query}"
                  </p>
                </div>
                <button
                  onClick={() => Setmenu(false)}
                  className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#252525] transition-colors border border-gray-700"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {movies.map((movie: any) => (
                  <div
                    key={movie.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClick(movie)
                      Setmenu(false)
                    }}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:bg-[#252525] hover:border-gray-600 transition-all cursor-pointer overflow-hidden group min-h-40"
                  >
                    <div className="flex gap-4 p-4 h-full">
                      <div className="shrink-0">
                        <img
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                              : "/assets/placeholder.png"
                          }
                          alt={movie.title || movie.name}
                          className="w-24 h-36 object-cover rounded-md border border-gray-800 group-hover:border-gray-600 transition-all flex items-center justify-center 0"
                        />
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h3 className="text-white font-bold text-base mb-1">
                          {movie.title || movie.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {movie.release_date?.split("-")[0] ||
                            movie.first_air_date?.split("-")[0] ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedMovie(null)}
          >
            <div
              className="bg-[#252525] border-2 border-[#3a3a3a] text-white p-4 md:p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center items-center w-full mb-4">
                <h2 className="text-xl md:text-2xl font-bold">
                  {selectedMovie.title || selectedMovie.name}
                </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-5 items-start">
                <div className="w-full md:w-auto shrink-0 p-3 bg-[#1f1f1f] border-black rounded-2xl border flex items-center justify-center">
                  {selectedMovie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                      alt={selectedMovie.title || selectedMovie.name}
                      className="rounded-2xl w-full md:w-64 h-auto border border-black"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-4 md:gap-6 flex-1 min-w-0">
                  <div className="p-4 md:p-5 rounded-2xl bg-[#1f1f1f] border-black border">
                    <p className="text-sm md:text-base mb-3">
                      {selectedMovie.description || selectedMovie.overview}
                    </p>
                    <p className="text-yellow-400 font-semibold">
                      ⭐ TMDb rating:{" "}
                      {selectedMovie.vote_average?.toFixed(1) || "N/A"}/10
                    </p>
                  </div>
                  <div className="p-4 md:p-5 bg-[#1f1f1f] rounded-2xl border-black border">
                    <p className="text-sm md:text-base">
                      First Released in:{" "}
                      {selectedMovie.release_date?.split("-")[0] ||
                        selectedMovie.first_air_date?.split("-")[0] ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
                  onClick={handleAdd}
                >
                  Add to your list
                </button>
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="w-full sm:w-auto px-6 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
