import "@/server/jobs/endAuction"

export async function GET(req) {
  return Response.json({ message: "Auction watcher is running" })
}
