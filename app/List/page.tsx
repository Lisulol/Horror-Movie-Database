"use client"
import NavBar from "@/components/NavBar"
import { useMovieContext } from "@/porivders/context"
import { IconBrandGithub, IconMenu2 } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

export default function YourList() {
  const [clicked, setClicked] = useState(false)
  const { listmovies, setListMovies } = useMovieContext()
  const [MenuOpen, setMenuOpen] = useState(false)

  function handleClick() {
    setClicked(!clicked)
  }
  function handleMenu() {
    setMenuOpen(!MenuOpen)
  }

  return (
    <div className="h-screen w-screen flex-col flex  font-mono text-white">
      <div className="w-full h-16 bg-[#161616] border-b border-[#000000] flex flex-row items-center gap-4 px-4">
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
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-50">
        {MenuOpen && <NavBar />}
      </div>
      <div className="w-full h-screen flex items-center justify-center">
        {clicked && (
          <div
            onClick={handleClick}
            className="bg-[#131313]  items-center justify-center fixed h-screen w-full inset-0 z-999 flex "
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151515] rounded-2xl h-4/6 w-4/6 border border-black"
            >
              <div className="flex w-full h-1/12 items-center justify-center font-bold">
                Your list:
              </div>
              {listmovies.map((movie) => (
                <div className="flex">{movie.title}</div>
              ))}
            </div>
          </div>
        )}
        <div
          onClick={handleClick}
          className="h-2/12 w-2/12 border flex items-center justify-center rounded-2xl hover:bg-[#141414] border-[#141414]"
        >
          <p>List 1</p>
        </div>
      </div>
    </div>
  )
}
