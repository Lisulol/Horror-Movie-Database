"use client"
import NavBar from "@/components/NavBar"
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars"
import { useMovieContext } from "@/porivders/context"
import { IconBrandGithub, IconMenu2 } from "@tabler/icons-react"
import { X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import jsPDF from "jspdf"

export default function YourList() {
  const [clicked, setClicked] = useState(false)
  const [currentList, setCurrentList] = useState<string>("List 1")
  const [MenuOpen, setMenuOpen] = useState(false)
  const { lists, setlists } = useMovieContext()

  const currentMovies = Array.isArray(lists[currentList])
    ? lists[currentList]
    : []

  function handleClick() {
    setClicked(!clicked)
  }
  function handleMenu() {
    setMenuOpen(!MenuOpen)
  }
  function handleexport() {
    if (!Array.isArray(currentMovies) || currentMovies.length === 0) {
      alert("No movies to export!")
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
            className="bg-[#131313]  items-center justify-center fixed h-screen w-full inset-0 z-999 flex "
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151515] rounded-2xl h-4/6 w-4/6 border border-black p-4 overflow-y-auto"
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
                currentMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex w-full p-2 border-b border-black items-center justify-between"
                  >
                    <span>{movie.title || movie.name}</span>
                    <button
                      onClick={() => handleRemove(movie.id)}
                      className="hover:bg-red-600 p-1 rounded transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))
              )}
              <div className="flex gap-5">
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
