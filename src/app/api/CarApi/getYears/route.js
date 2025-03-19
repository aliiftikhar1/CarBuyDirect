import { NextResponse } from "next/server"

// Get the API token from environment variables
// You'll need to add this to your .env.local file
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjYXJhcGkuYXBwIiwic3ViIjoiMjQxY2FmNTAtYTBlYi00NGFiLTlhZDQtYWYyNmM4NjJiNjAyIiwiYXVkIjoiMjQxY2FmNTAtYTBlYi00NGFiLTlhZDQtYWYyNmM4NjJiNjAyIiwiZXhwIjoxNzQyOTczNjU0LCJpYXQiOjE3NDIzNjg4NTQsImp0aSI6Ijk3YjE0MDg2LWY2ZjktNDcyMS04MjJlLTQwNGVkZWI1ODg5MSIsInVzZXIiOnsic3Vic2NyaXB0aW9ucyI6WyJzdGFydGVyIl0sInJhdGVfbGltaXRfdHlwZSI6ImhhcmQiLCJhZGRvbnMiOnsiYW50aXF1ZV92ZWhpY2xlcyI6ZmFsc2UsImRhdGFfZmVlZCI6ZmFsc2V9fX0.8HSFyUvE36O3vVcxRp1cmq1IJN57hi8lpBNl9T7AzeA"
// process.env.CAR_API_TOKEN

export async function GET(request) {
  try {
    // Check if we have the API token
    if (!API_TOKEN) {
      return NextResponse.json({ error: "API token not configured" }, { status: 500 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") || "1000"
    
    const url = `https://carapi.app/api/years?limit=${limit}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
      
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        {
          error: "Failed to fetch car makes",
          status: response.status,
          details: errorData,
        },
        { status: response.status },
      )
    }

    // Parse and return the data
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching car makes:", error)
    return NextResponse.json({ error: "Failed to fetch car makes" }, { status: 500 })
  }
}

