export const dynamic = 'force-dynamic'
import { DAL } from "../../../dals/PersistentRedisDAL"

export async function POST(request) {
    const { username } = await request.json()
    const result = await DAL.GetUser(username)
    const success = !!result
    const response = new Response( {success: success} )
    response.headers.append(
        "Set-Cookie",
        `session_user=${success ? username : ""}; Path=/; HttpOnly; SameSite-Lax; MaxAge=${success ? 2592000 : 0}`
    )
    return response
}

export async function GET(request) {
    const cookie = request.headers.get("cookie") || ""
    const cookies = Object.fromEntries(
        cookie.split("; ").map(c => c.split("="))
    )

    const username = cookies.session_user

    if (!username) {
        return new Response("Unauthorized", { status: 401 })
    }

    const data = await DAL.GetUser(username)
    return Response.json( {user: data} )
}

export async function DELETE(request) {
    const response = new Response(
        JSON.stringify({ success: true }),
        { headers: { "Content-Type" : "application/json" }}
    )

    response.headers.append(
        "Set-Cookie",
        `session_user=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
    )

    return response
}