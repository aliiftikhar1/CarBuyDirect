import { NextResponse } from "next/server"

/**
 * Authenticates with the CarAPI and returns a JWT token
 */
async function getAuthToken() {
  const apiToken = "758d2b2c-2c0c-4385-85d1-23438c97a7db"
  const apiSecret = "d0dff6786389b5d52760dbdd2f804704"

  const response = await fetch("https://carapi.app/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_token: apiToken,
      api_secret: apiSecret,
    }),
  })

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status}`)
  }

  // The response is a JWT token
  const token = await response.text()
  return token
}

/**
 * Fetches data from a specific page of the CarAPI
 */
async function fetchPage(url, token) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      JSON.stringify({
        error: "Failed to fetch car models",
        status: response.status,
        details: errorData,
      }),
    )
  }

  return response.json()
}

export async function GET(request) {
  try {
    // First, authenticate and get a token
    const token = await getAuthToken()

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") || "1265"
    const fetchAllPages = searchParams.get("fetchAll") !== "false" // Default to true

    // Initial URL
    const initialUrl = `https://carapi.app/api/models?limit=${limit}`

    // Fetch the first page using the authentication token
    const firstPageData = await fetchPage(initialUrl, token)

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
      pagePromises.push(fetchPage(pageUrl, token))
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
      data: allData,
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
      return NextResponse.json({ error: error.message || "Failed to fetch car models" }, { status: 500 })
    }
  }
}

