"use client"

import NavBar from "@/components/NavBar"
import SearchBar from "@/components/searchbar"
import { Carousel } from "@/components/ui/carousel"
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars"
import { IconBrandGithub, IconMenu2 } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [MenuOpen, setMenuOpen] = useState(false)

  function handleMenu() {
    setMenuOpen(!MenuOpen)
  }
  return (
    <div className="h-screen w-screen flex flex-col">
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

      <div className="flex-1 flex items-center justify-center">
        <SearchBar />
      </div>
      <div className="pointer-events-none">
        <ShootingStars
          starColor="#9E00FF"
          trailColor="#2EB9DF"
          minSpeed={15}
          maxSpeed={35}
          minDelay={1200}
          maxDelay={4200}
        />
      </div>
    </div>
  )
}
