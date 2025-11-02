"use client"
import NavBar from "@/components/NavBar"
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars"
import { useMovieContext } from "@/porivders/context"
import { IconBrandGithub, IconMenu2 } from "@tabler/icons-react"
import { X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import jsPDF from "jspdf"
import { DndContext } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { arrayMove } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"

export default function YourList() {
  const [clicked, setClicked] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [currentList, setCurrentList] = useState<string>("List 1")
  const [MenuOpen, setMenuOpen] = useState(false)
  const { lists, setlists } = useMovieContext()
  const [showalert, setShowAlert] = useState(false)
  const [isAlertClosing, setIsAlertClosing] = useState(false)
  const [message, setMessage] = useState("")
  const currentMovies = Array.isArray(lists[currentList])
    ? lists[currentList]
    : []
  const movieIds = currentMovies.map((movie) => movie.id)
  const [simmilarMovies, setSimmilarMovies] = useState<any[]>([])
  const [showSimmilar, setShowSimmilar] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<any>(null)

  async function fetchSimilarMovies() {
    if (currentMovies.length === 0) {
      showalertmessage("No movies in the current list!")
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

    try {
      const allSimilarMovies = await Promise.all(
        currentMovies.map(async (movie) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${apiKey}`
          )
          const data = await response.json()
          return data.results || []
        })
      )

      const flattenedMovies = allSimilarMovies.flat()
      const uniqueMovies = flattenedMovies.filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
      )

      // Filter for horror movies only (genre ID 27)
      const horrorMovies = uniqueMovies.filter((movie) =>
        movie.genre_ids?.includes(27)
      )

      const newRecommendations = horrorMovies.filter(
        (movie) => !currentMovies.some((m) => m.id === movie.id)
      )

      setSimmilarMovies(newRecommendations)
    } catch (error) {
      console.error("Error fetching similar movies:", error)
      showalertmessage("Failed to fetch similar movies")
    }
  }

  function handlesimmilar() {
    if (currentMovies.length === 0) {
      showalertmessage("No movies in the current list to find similar movies!")
      return
    } else {
      setShowSimmilar(true)
      fetchSimilarMovies()
    }
  }

  function showalertmessage(message: string) {
    setShowAlert(true)
    setIsAlertClosing(false)
    setMessage(message)
    setTimeout(() => {
      setIsAlertClosing(true)
      setTimeout(() => {
        setShowAlert(false)
        setIsAlertClosing(false)
      }, 300)
    }, 2700)
  }
  function handleClick() {
    if (clicked) {
      setIsClosing(true)
      setTimeout(() => {
        setClicked(false)
        setIsClosing(false)
      }, 300)
    } else {
      setClicked(true)
    }
  }
  function handlerename() {
    const newName = prompt("Enter new name for the list:", currentList)
    if (newName && newName.trim() !== "" && newName !== currentList) {
      if (lists.hasOwnProperty(newName)) {
        showalertmessage("A list with that name already exists!")
        return
      }
      const newLists = { ...lists }
      newLists[newName] = newLists[currentList]
      delete newLists[currentList]
      setlists(newLists)
      setCurrentList(newName)
      showalertmessage(`List renamed to ${newName}`)
    }
  }
  function handleMenu() {
    setMenuOpen(!MenuOpen)
  }
  function handleDragEnd(event: any) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = currentMovies.findIndex((m) => m.id === active.id)
    const newIndex = currentMovies.findIndex((m) => m.id === over.id)

    const reordered = arrayMove(currentMovies, oldIndex, newIndex)
    const newLists = { ...lists, [currentList]: reordered }
    setlists(newLists)
  }
  function SortableMovie({
    movie,
    onRemove,
  }: {
    movie: any
    onRemove: (id: number) => void
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: movie.id })
    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition,
    }
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex w-full p-2 border-b border-black items-center justify-between"
      >
        <span>{movie.title || movie.name}</span>
        <div className="flex flex-row">
          <div
            className="cursor-grab active:cursor-grabbing pr-2"
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </div>
          <button
            onClick={() => onRemove(movie.id)}
            className="hover:bg-red-600 p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    )
  }
  function handledelete() {
    if (Object.keys(lists).length > 1) {
      const newLists = Object.keys(lists).reduce((acc, key) => {
        if (key !== currentList) {
          acc[key] = lists[key]
        }
        return acc
      }, {} as Record<string, any[]>)
      setlists(newLists)
      setIsClosing(true)
      setTimeout(() => {
        setClicked(false)
        setIsClosing(false)
      }, 300)
    } else {
      showalertmessage("You must have at least one list!")
    }
  }
  function calculate_stats(movies: any[]) {
    if (!movies || movies.length === 0) {
      return { avgRating: 0, minYear: null, maxYear: null }
    }

    let totalRating = 0
    movies.forEach((movie) => {
      totalRating += movie.vote_average || 0
    })
    const avgRating = (totalRating / movies.length).toFixed(1)

    const years = movies
      .map((movie) => {
        const year = movie.release_date?.split("-")[0]
        return year ? parseInt(year) : null
      })
      .filter((year) => year !== null)

    const minYear = years.length > 0 ? Math.min(...years) : null
    const maxYear = years.length > 0 ? Math.max(...years) : null

    return { avgRating, minYear, maxYear }
  }
  function handleexport() {
    if (!Array.isArray(currentMovies) || currentMovies.length === 0) {
      showalertmessage("No movies to export in this list!")
      return
    }

    const document = new jsPDF()
    document.text("My Movie List", 10, 10)

    let yPosition = 40
    currentMovies.forEach((movie, index) => {
      document.setFontSize(12)
      document.text(`${index + 1}. ${movie.title}`, 20, yPosition)
      document.setFontSize(10)
      document.text(
        `Released: ${movie.release_date?.split("-")[0]}`,
        30,
        yPosition + 5
      )
      yPosition += 15
    })
    document.save("movie-list.pdf")
  }
  function handleRemove(movieId: number) {
    if (!Array.isArray(lists[currentList])) {
      console.error("Current list is not an array!")
      return
    }

    const updatedList = lists[currentList].filter(
      (movie) => movie.id !== movieId
    )
    const newLists = { ...lists, [currentList]: updatedList }
    setlists(newLists)
  }

  return (
    <div className="h-screen w-screen flex-col flex font-mono text-white">
      {showSimmilar && (
        <div
          onClick={() => setShowSimmilar(false)}
          className="flex h-screen w-screen items-center justify-center inset-0 fixed z-9999 bg-black/80"
        >
          <div
            className="bg-[#151515] rounded-2xl h-4/5 w-4/5 border border-black p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              Similar Horror Movies ({simmilarMovies.length} found)
            </h2>
            {simmilarMovies.length === 0 ? (
              <p className="text-gray-400">Loading similar movies...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {simmilarMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => {
                      setSelectedMovie(movie)
                      setShowSimmilar(false)
                    }}
                    className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    {movie.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-64 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h3 className="font-bold text-sm mb-1">
                        {movie.title || movie.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {movie.release_date?.split("-")[0] || "N/A"} • ⭐{" "}
                        {movie.vote_average?.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowSimmilar(false)}
              className="mt-6 px-6 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedMovie && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="bg-[#252525] border-2 border-[#3a3a3a] text-white p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              {selectedMovie.title || selectedMovie.name}
            </h2>

            <div className="flex flex-col md:flex-row gap-5 items-start">
              {selectedMovie.poster_path && (
                <div className="w-full md:w-auto shrink-0 p-3 bg-[#1f1f1f] border-black rounded-2xl border flex items-center justify-center">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                    alt={selectedMovie.title || selectedMovie.name}
                    className="rounded-2xl w-full md:w-64 h-auto border border-black"
                  />
                </div>
              )}

              <div className="flex flex-col gap-4 flex-1">
                <div className="p-5 rounded-2xl bg-[#1f1f1f] border-black border">
                  <p className="text-base mb-3">
                    {selectedMovie.overview || "No description available."}
                  </p>
                  <p className="text-yellow-400 font-semibold">
                    ⭐ TMDb rating:{" "}
                    {selectedMovie.vote_average?.toFixed(1) || "N/A"}/10
                  </p>
                </div>

                <div className="p-5 bg-[#1f1f1f] rounded-2xl border-black border">
                  <p className="text-base">
                    Released:{" "}
                    {selectedMovie.release_date?.split("-")[0] ||
                      selectedMovie.first_air_date?.split("-")[0] ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  const movieExists = currentMovies.some(
                    (m) => m.id === selectedMovie.id
                  )
                  if (movieExists) {
                    showalertmessage(`Movie is already in ${currentList}`)
                  } else {
                    const newLists = {
                      ...lists,
                      [currentList]: [...currentMovies, selectedMovie],
                    }
                    setlists(newLists)
                    showalertmessage(`Added to ${currentList}`)
                    setSelectedMovie(null)
                  }
                }}
                className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
              >
                Add to {currentList}
              </button>

              <button
                onClick={() => setSelectedMovie(null)}
                className="px-6 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-9999 transition-all duration-300 ${
          showalert && !isAlertClosing
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {message}
      </div>
      <div className="w-full h-16 z-999 bg-[#161616] border-b border-[#000000] flex flex-row items-center gap-4 px-4">
        <div onClick={handleMenu} className="cursor-pointer">
          <IconMenu2 color={"white"} />
        </div>
        <a
          className="text-white w-50  items-center justify-center p-2 font-bold text-2xl"
          href="/"
        >
          <div>H-M-D</div>
        </a>
        <div className="text-white flex w-full justify-end">
          <Link target={"_blank"} href="https://github.com/Lisulol">
            <IconBrandGithub />
          </Link>
        </div>
      </div>
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-999">
        {MenuOpen && <NavBar />}
      </div>
      <div className="z-99 w-full h-screen flex items-center justify-center">
        {clicked && (
          <div
            onClick={handleClick}
            className={`bg-[#131313] items-center justify-center fixed h-screen w-full inset-0 z-999 flex transition-opacity duration-300 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`bg-[#151515] rounded-2xl h-4/6 w-4/6 border border-black p-4 overflow-y-auto transition-all duration-300 ${
                isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
              }`}
            >
              <div className="flex w-full h-1/12 items-center justify-center font-bold mb-4">
                {currentList} (
                {Array.isArray(currentMovies) ? currentMovies.length : 0}{" "}
                movies)
              </div>
              {!Array.isArray(currentMovies) || currentMovies.length === 0 ? (
                <div className="text-center text-gray-400">
                  No movies added yet. Go search and add some horror movies!
                </div>
              ) : (
                <DndContext onDragEnd={handleDragEnd}>
                  <SortableContext items={movieIds}>
                    {currentMovies.map((movie) => (
                      <SortableMovie
                        key={movie.id}
                        movie={movie}
                        onRemove={handleRemove}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
              <div className="flex flex-col gap-5">
                <div className="gap-x-5 flex flex-row">
                  <button
                    className="mt-4 px-4 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
                    onClick={() => {
                      const newLists = { ...lists, [currentList]: [] }
                      setlists(newLists)
                    }}
                  >
                    Clear List
                  </button>
                  <button
                    className="mt-4 px-4 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
                    onClick={handleexport}
                  >
                    Export List
                  </button>
                  <button
                    className="mt-4 px-4 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
                    onClick={handledelete}
                  >
                    Delete List
                  </button>
                  <button
                    className="mt-4 px-4 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
                    onClick={handlesimmilar}
                  >
                    Show simmilar
                  </button>
                  <button
                    className="mt-4 px-4 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
                    onClick={handlerename}
                  >
                    Rename
                  </button>
                </div>
                <div className="w-full flex gap-5 border-t border-black p-5">
                  {calculate_stats(currentMovies).avgRating}
                  {Object.keys(lists).map((listName) => {
                    const stats = calculate_stats(lists[listName])

                    return (
                      <div className="flex gap-x-5  " key={listName}>
                        <p className="border-r px-2 border-black">{listName}</p>
                        <p className="border-r px-2 border-black">
                          {lists[listName].length} movies
                        </p>
                        <p className="border-r px-2 border-black">
                          ⭐ {stats.avgRating} avg
                        </p>
                        <p className="border-r px-2 border-black">
                          {stats.minYear}-{stats.maxYear}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {Object.keys(lists).map((listName) => (
          <div
            key={listName}
            onClick={() => {
              setCurrentList(listName)
              setClicked(true)
            }}
            className="h-2/12 w-2/12 border flex flex-col items-center justify-center rounded-2xl hover:bg-[#141414] border-[#141414] cursor-pointer m-2"
          >
            <p className="font-bold">{listName}</p>
            <p className="text-sm text-gray-400">
              ({Array.isArray(lists[listName]) ? lists[listName].length : 0}{" "}
              movies)
            </p>
          </div>
        ))}
      </div>
      <ShootingStars
        starColor="#9E00FF"
        trailColor="#2EB9DF"
        minSpeed={15}
        maxSpeed={35}
        minDelay={1200}
        maxDelay={4200}
      />
    </div>
  )
}
