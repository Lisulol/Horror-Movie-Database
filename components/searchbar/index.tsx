"use client"
import { IconCornerRightDownDouble, IconSearch } from "@tabler/icons-react"
import { use, useEffect, useState } from "react"
import { useMovieContext } from "@/porivders/context"
import { Slider } from "../ui/slider"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState<any[]>([])
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const { lists, setlists } = useMovieContext()
  const [selectedList, setSelectedList] = useState<string>("")
  const [menu, Setmenu] = useState(false)

  // Auto-select first available list when lists load
  useEffect(() => {
    const availableLists = Object.keys(lists)
    if (availableLists.length > 0 && !selectedList) {
      setSelectedList(availableLists[0])
    }
    // If current selected list doesn't exist anymore, switch to first available
    if (selectedList && !lists[selectedList] && availableLists.length > 0) {
      setSelectedList(availableLists[0])
    }
  }, [lists, selectedList])
  const [showalert, setShowAlert] = useState(false)
  const [message, setMessage] = useState("")
  const [Filtersopen, setFilterOpen] = useState(false)
  const [ratingvalue, setRatingValue] = useState<number>()
  const [yearRange, setYearRange] = useState<number[]>([
    1900,
    new Date().getFullYear(),
  ])
  const [listmoviesshow, setlistmoviesshow] = useState(false)
  const [allMovies, setAllMovies] = useState<any[]>([])
  const [selectedSubgenres, setSelectedSubgenres] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<string>("")
  function getSubgenres(movie: any): string[] {
    const subgenres: string[] = []
    const ids = movie.genre_ids || []

    if (ids.includes(27) && ids.includes(53)) {
      subgenres.push("slasher")
    }

    if (ids.includes(27) && ids.includes(14)) {
      subgenres.push("supernatural")
    }

    if (ids.includes(27) && ids.includes(9648)) {
      subgenres.push("psychological")
    }

    const text = `${movie.title || ""} ${movie.overview || ""}`.toLowerCase()

    if (text.includes("zombie")) {
      subgenres.push("zombies")
    }

    if (text.includes("vampire")) {
      subgenres.push("vampire")
    }

    if (text.includes("werewolf")) {
      subgenres.push("werewolf")
    }

    if (text.includes("found footage")) {
      subgenres.push("found footage")
    }

    return subgenres
  }
  function handleSortOption(option: string) {
    setSortOption(option)
  }
  function showalertmessage(message: string) {
    setShowAlert(true)
    setMessage(message)
    setTimeout(() => {
      setShowAlert(false)
    }, 3000)
  }
  function handleAdd() {
    if (!selectedMovie) return

    if (!lists[selectedList]) {
      console.error(`List "${selectedList}" does not exist!`)
      showalertmessage("Error: List not found")
      return
    }

    const currentListMovies = lists[selectedList]

    if (!Array.isArray(currentListMovies)) {
      console.error(
        `List "${selectedList}" is not an array:`,
        currentListMovies
      )
      showalertmessage("Error: Invalid list format")
      return
    }

    const movieExists = currentListMovies.some(
      (movie) => movie.id === selectedMovie.id
    )

    if (movieExists) {
      showalertmessage(`Movie is already in ${selectedList}`)
      setSelectedMovie(null)
      return
    }

    const updatedmovies = [...currentListMovies, selectedMovie]
    const updatedList = { ...lists, [selectedList]: updatedmovies }
    setlists(updatedList)
    console.log("Added to", selectedList, ":", updatedList)
    setSelectedMovie(null)
    showalertmessage(`Movie added to ${selectedList}`)
  }

  async function handleQuery() {
    if (!query.trim()) return
    const response = await fetch(`/api/movies?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    const results = data.results || []
    setAllMovies(results)
    setMovies(results)
    console.log(data.results)
  }

  function handleSearch(e: KeyboardEvent) {
    if (e.key === "Enter") {
      Setmenu(true)
    }
  }
  function handleslider(value: number[]) {
    setRatingValue(value?.[0] ?? 0)

    const filteredMovies = allMovies.filter((movie: any) => {
      return movie.vote_average >= (value?.[0] ?? 0)
    })
    setMovies(filteredMovies)
  }
  function handlesubgenre(subgenre: string) {
    if (selectedSubgenres.includes(subgenre)) {
      setSelectedSubgenres(selectedSubgenres.filter((s) => s !== subgenre))
    } else {
      setSelectedSubgenres([...selectedSubgenres, subgenre])
    }
  }
  useEffect(() => {
    handleQuery()
  }, [query])

  function handleClick(movie: any) {
    setSelectedMovie(movie)
  }
  function handlefilterreset() {
    setSelectedSubgenres([])
    setSortOption("")
    setRatingValue(undefined)
    setYearRange([1900, new Date().getFullYear()])
    setMovies(allMovies)
  }

  const getActiveFilterCount = () => {
    let count = 0

    const currentYear = new Date().getFullYear()
    if (yearRange[0] !== 1900 || yearRange[1] !== currentYear) {
      count++
    }

    if (selectedSubgenres.length > 0) {
      count++
    }

    if (ratingvalue && ratingvalue > 0) {
      count++
    }

    if (sortOption) {
      count++
    }

    return count
  }
  useEffect(() => {
    window.addEventListener("keydown", handleSearch)
    return () => {
      window.removeEventListener("keydown", handleSearch)
    }
  })

  function handleslideryear(value: number[]) {
    setYearRange(value)

    const minYear = value[0]
    const maxYear = value[1]

    const filteredMovies = allMovies.filter((movie: any) => {
      const releaseYear = movie.release_date
        ? parseInt(movie.release_date.split("-")[0], 10)
        : null
      return releaseYear && releaseYear >= minYear && releaseYear <= maxYear
    })

    setMovies(filteredMovies)
  }
  useEffect(() => {
    if (selectedSubgenres.length === 0) {
      setMovies(allMovies)
      return
    }

    const filteredMovies = allMovies.filter((movie: any) => {
      const movieSubgenres = getSubgenres(movie)
      return selectedSubgenres.some((selected) =>
        movieSubgenres.includes(selected)
      )
    })

    setMovies(filteredMovies)
  }, [selectedSubgenres, allMovies])

  useEffect(() => {
    if (!sortOption || movies.length === 0) return

    let sortedMovies = [...movies]

    if (sortOption === "Highest Rated") {
      sortedMovies.sort((a, b) => b.vote_average - a.vote_average)
    } else if (sortOption === "Newest First") {
      sortedMovies.sort(
        (a, b) => b.release_date?.localeCompare(a.release_date || "") || 0
      )
    } else if (sortOption === "Oldest First") {
      sortedMovies.sort(
        (a, b) => a.release_date?.localeCompare(b.release_date || "") || 0
      )
    } else if (sortOption === "Most Popular") {
      sortedMovies.sort((a, b) => b.popularity - a.popularity)
    }

    setMovies(sortedMovies)
  }, [sortOption])

  return (
    <>
      {showalert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-9999">
          {message}
        </div>
      )}
      <div className="z-90 flex flex-col gap-4">
        <div className="flex flex-row gap-5">
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
          <button
            onClick={() => setFilterOpen(!Filtersopen)}
            className="flex items-center justify-center  rounded-2xl text-xs m-2 text-white font-bold border border-[#8a8a8a] bg-[#474747]"
          >
            <p>
              Filters{" "}
              {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </p>
            <IconCornerRightDownDouble size={15} />
          </button>
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
        {Filtersopen && (
          <div className="rounded-2xl p-5 flex-col text-white bg-[#121212] flex gap-3 overflow-x-auto pb-2">
            <div className="flex flex-col border-b border-black w-full p-5">
              <p>Sort by:</p>
              <div className="flex flex-row gap-5">
                <input
                  type="radio"
                  name="sort"
                  className="ml-2"
                  checked={sortOption === "Highest Rated"}
                  onChange={() => handleSortOption("Highest Rated")}
                />
                <p>Highest Rated</p>
              </div>
              <div className="flex flex-row gap-5">
                <input
                  type="radio"
                  name="sort"
                  className="ml-2"
                  checked={sortOption === "Newest First"}
                  onChange={() => handleSortOption("Newest First")}
                />
                <p>Newest First</p>
              </div>
              <div className="flex flex-row gap-5">
                <input
                  type="radio"
                  name="sort"
                  className="ml-2"
                  checked={sortOption === "Oldest First"}
                  onChange={() => handleSortOption("Oldest First")}
                />
                <p>Oldest First</p>
              </div>
              <div className="flex flex-row gap-5">
                <input
                  type="radio"
                  name="sort"
                  className="ml-2"
                  checked={sortOption === "Most Popular"}
                  onChange={() => handleSortOption("Most Popular")}
                />
                <p>Most Popular</p>
              </div>
            </div>
            <div className="flex flex-col gap-y-4 border-b border-black w-full p-5">
              <p>Rating: </p>
              <div className="flex flex-row gap-x-3 ">
                <Slider
                  onValueChange={handleslider}
                  value={[ratingvalue ?? 0]}
                  max={10}
                  step={0.1}
                />

                <p>{ratingvalue}</p>
              </div>
            </div>
            <div className="flex flex-col gap-y-4 border-b border-black w-full p-5">
              <p>Subgenres: </p>
              <div>
                <div className="flex flex-row gap-5">
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selectedSubgenres.includes("slasher")}
                    onChange={() => handlesubgenre("slasher")}
                  />
                  <p>Slasher</p>
                </div>
                <div className="flex flex-row gap-5">
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selectedSubgenres.includes("supernatural")}
                    onChange={() => handlesubgenre("supernatural")}
                  />
                  <p>Supernatural</p>
                </div>
                <div className="flex flex-row gap-5">
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selectedSubgenres.includes("psychological")}
                    onChange={() => handlesubgenre("psychological")}
                  />
                  <p>Psychological</p>
                </div>
                <div className="flex flex-row gap-5">
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selectedSubgenres.includes("zombies")}
                    onChange={() => handlesubgenre("zombies")}
                  />
                  <p>Zombies</p>
                </div>
                <div className="flex flex-row gap-5">
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selectedSubgenres.includes("found footage")}
                    onChange={() => handlesubgenre("found footage")}
                  />
                  <p>Found Footage</p>
                </div>
                <div className="flex flex-row gap-5">
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selectedSubgenres.includes("vampire")}
                    onChange={() => handlesubgenre("vampire")}
                  />
                  <p>Vampire</p>
                </div>
                <div className="flex flex-row gap-5">
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selectedSubgenres.includes("werewolf")}
                    onChange={() => handlesubgenre("werewolf")}
                  />
                  <p>Werewolf</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-4 border-b border-black w-full p-5">
              <p>
                Release year: {yearRange[0]} - {yearRange[1]}
              </p>
              <div>
                <Slider
                  onValueChange={handleslideryear}
                  min={1900}
                  max={new Date().getFullYear()}
                  value={yearRange}
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <button
                onClick={handlefilterreset}
                className="p-1 flex items-center justify-center  rounded-2xl text-xs m-2 text-white font-bold border border-[#8a8a8a] bg-[#474747]"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {movies.length > 0 && !Filtersopen && query != "" && (
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
                <div className="flex flex-col">
                  <button
                    className="flex-col gap-x-2 flex w-full sm:w-auto px-6 py-2 bg-[#161616] rounded hover:bg-[#252525] transition-colors"
                    onClick={() => setlistmoviesshow(!listmoviesshow)}
                  >
                    <div className="flex flex-row">
                      <p>Add to your list</p>
                      <div className="flex px-2 border-black ">
                        <IconCornerRightDownDouble />
                      </div>
                    </div>
                  </button>
                  {listmoviesshow && (
                    <div className="flex flex-col bg-[#161616] p-3 rounded-lg mt-2 min-w-[250px]">
                      {Object.keys(lists).length === 0 ? (
                        <p className="text-gray-400 text-sm mb-2">
                          No lists yet!
                        </p>
                      ) : (
                        Object.keys(lists).map((listName: string) => (
                          <div
                            key={listName}
                            className="flex items-center justify-between gap-3 mb-2 p-2 hover:bg-[#252525] rounded"
                          >
                            <p>
                              {listName} ({lists[listName].length} movies)
                            </p>
                            <button
                              onClick={() => {
                                setSelectedList(listName)
                                handleAdd()
                                setlistmoviesshow(false)
                              }}
                              className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 transition-colors text-sm"
                            >
                              Add
                            </button>
                          </div>
                        ))
                      )}
                      <div className="border-t border-gray-600 mt-2 pt-2">
                        <button
                          onClick={() => {
                            const newListName = prompt("Enter new list name:")
                            if (newListName && newListName.trim()) {
                              const trimmedName = newListName.trim()
                              if (lists[trimmedName]) {
                                alert("A list with this name already exists!")
                                return
                              }
                              const newLists = { ...lists, [trimmedName]: [] }
                              setlists(newLists)
                              setSelectedList(trimmedName)
                            }
                          }}
                          className="w-full px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          + Create New List
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
