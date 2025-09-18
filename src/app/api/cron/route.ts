export async function GET(request: Request) {
    console.log("Cron job started")
    return new Response("Hello, world!")
    console.log("Cron job completed")
}