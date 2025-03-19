import { NextResponse } from "next/server"

// Get the API token from environment variables
// You'll need to add this to your .env.local file
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjYXJhcGkuYXBwIiwic3ViIjoiMjQxY2FmNTAtYTBlYi00NGFiLTlhZDQtYWYyNmM4NjJiNjAyIiwiYXVkIjoiMjQxY2FmNTAtYTBlYi00NGFiLTlhZDQtYWYyNmM4NjJiNjAyIiwiZXhwIjoxNzQyOTczNjU0LCJpYXQiOjE3NDIzNjg4NTQsImp0aSI6Ijk3YjE0MDg2LWY2ZjktNDcyMS04MjJlLTQwNGVkZWI1ODg5MSIsInVzZXIiOnsic3Vic2NyaXB0aW9ucyI6WyJzdGFydGVyIl0sInJhdGVfbGltaXRfdHlwZSI6ImhhcmQiLCJhZGRvbnMiOnsiYW50aXF1ZV92ZWhpY2xlcyI6ZmFsc2UsImRhdGFfZmVlZCI6ZmFsc2V9fX0.8HSFyUvE36O3vVcxRp1cmq1IJN57hi8lpBNl9T7AzeA"
// process.env.CAR_API_TOKEN

/**
 * Fetches data from a specific page of the CarAPI
 */
async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(JSON.stringify({
      error: "Failed to fetch car models",
      status: response.status,
      details: errorData,
    }))
  }

  return response.json()
}

export async function GET(request) {
  try {
    // Check if we have the API token
    if (!API_TOKEN) {
      return NextResponse.json({ error: "API token not configured" }, { status: 500 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") || "1265"
    const fetchAllPages = searchParams.get("fetchAll") !== "false" // Default to true
    
    // Initial URL
    const initialUrl = `https://carapi.app/api/models?limit=${limit}`

    // Fetch the first page
    const firstPageData = await fetchPage(initialUrl)
    
    // If there's only one page or user doesn't want all pages, return the first page data
    if (firstPageData.collection.pages <= 1 || !fetchAllPages) {
      return NextResponse.json(firstPageData)
    }
    
    // If there are multiple pages, fetch all pages and combine the data
    const allData = [...firstPageData.data]
    const totalPages = firstPageData.collection.pages
    
    // Create an array of promises for fetching all remaining pages
    const pagePromises = []
    for (let page = 2; page <= totalPages; page++) {
      const pageUrl = `https://carapi.app/api/models?limit=${limit}&page=${page}`
      pagePromises.push(fetchPage(pageUrl))
    }
    
    // Wait for all page requests to complete
    const pagesData = await Promise.all(pagePromises)
    
    // Combine all data from all pages
    for (const pageData of pagesData) {
      allData.push(...pageData.data)
    }
    
    // Create a combined response with all data
    const combinedResponse = {
      collection: {
        ...firstPageData.collection,
        count: allData.length,
        pages: 1, // Since we're returning all data in one response
        next: "", // No next page since all data is included
        prev: "", // No previous page since all data is included
      },
      data: allData
    }
    
    return NextResponse.json(combinedResponse)
  } catch (error) {
    console.error("Error fetching car models:", error)
    
    // Try to parse error details if they exist
    try {
      const errorDetails = JSON.parse(error.message)
      return NextResponse.json(errorDetails, { status: errorDetails.status || 500 })
    } catch {
      // If error is not in the expected format
      return NextResponse.json({ error: "Failed to fetch car models" }, { status: 500 })
    }
  }
}
