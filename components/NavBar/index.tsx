export default function NavBar() {
  return (
    <div className="h-full w-3xs flex z-999 bg-[#161616] rounded-r-3xl border-2 flex-col border-[#2c2c2c]">
      <div className="w-full h-2/12 border-b border-black flex text-white font-bold items-center justify-center">
        <a href="/About" className="text-lg">
          <span>About</span>
        </a>
      </div>
      <div className="w-full h-2/12 border-b border-black flex text-white font-bold items-center justify-center">
        <a href="/List" className="text-lg">
          <span>Your List</span>
        </a>
      </div>
    </div>
  )
}
