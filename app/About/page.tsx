"use client"
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars"
import { IconBrandGithub, IconMenu2 } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

export default function About() {
  const [MenuOpen, setMenuOpen] = useState(false)

  function handleMenu() {
    setMenuOpen(!MenuOpen)
  }
  return (
    <div className="h-screen w-screen flex flex-col bg-[#161616] text-white p-4">
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
      <div className="flex-col flex w-full h-screen items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">About H-M-D</h1>
        <p className="text-lg max-w-2xl text-center">
          H-M-D is a movie search application that allows users to search for
          movies, view details about them and create your own watchlists.
        </p>
        <Link
          href="/"
          className="flex z-99 p-5 border-2 rounded-2xl border-[#141414] hover:bg-[#131313]"
        >
          <div>
            <p>Return</p>
          </div>
        </Link>
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
