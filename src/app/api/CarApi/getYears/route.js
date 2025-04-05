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

export async function GET(request) {
  try {
    // First, authenticate and get a token
    const token = await getAuthToken()

    // const searchParams = request.nextUrl.searchParams
    const limit =  "2000"

    const url = `https://carapi.app/api/years?limit=${limit}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        {
          error: "Failed to fetch car years",
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
    console.error("Error fetching car years:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch car years" }, { status: 500 })
  }
}

