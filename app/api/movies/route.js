import { NextResponse } from "next/server"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "search/movie"

  const apiKey = process.env.TMDB_API_KEY

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}?api_key=${apiKey}&query=${query}`
    )

    const data = await response.json()

    const horrorMovies = data.results?.filter((movie) =>
      movie.genre_ids?.includes(27)
    )

    return NextResponse.json({ ...data, results: horrorMovies || [] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
