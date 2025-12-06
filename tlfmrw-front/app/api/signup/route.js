import { DAL } from "@/app/dals/PersistentRedisDAL"
import { C_DAL } from "@/app/dals/CachingRedisDal"
import { ENCRYPT } from "@/app/encryption/encrypt"

export async function POST(request) {
    const { username, password } = await request.json()
    const encryptedPassword = await ENCRYPT.encrypt(password)
    await DAL.CreateUser(username, encryptedPassword)

    return new Response(
        JSON.stringify({ success: true }),
        { headers: { "Content-Type": "application/json" } }
    )
}

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
        return new Response(
            JSON.stringify({ success: false, error: "username is required" }),
            { status: 400 }
        )
    }

    const user = await DAL.GetUser(username)
    console.log(user)

    return new Response(
        JSON.stringify({ success: !!user }),
        { headers: { "Content-Type": "application/json" } }
    )
}