import { DAL } from "../../../dals/PersistentRedisDAL";

export async function GET(request) {
    const urlData = new URL(request.url)
    const { username } = urlData.searchParams
    const userFavorites = await DAL.GetUserFavorites(username)
    return new Response(JSON.stringify({favorites: userFavorites}))
}

export async function POST(request) {
    const { username, chapterId } = await request.json()
    await DAL.SetUserFavorite(username, chapterId)
    return new Response()
}

export async function DELETE(request) {

}