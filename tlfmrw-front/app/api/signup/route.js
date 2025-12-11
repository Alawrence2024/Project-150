export const dynamic = 'force-dynamic'
import { DAL } from "../../../dals/PersistentRedisDAL"
import { ENCRYPT } from "../../../encryption/encrypt"

// async function CreateCookie(username, response) {
// }

export async function POST(request) {
    const { username, password } = await request.json()
    const encryptedPassword = await ENCRYPT.encrypt(password)
    const result = await DAL.CreateUser(username, encryptedPassword)

    const response = new Response(
        JSON.stringify({ success: result }),
        { headers: { "Content-Type": "application/json" } }
    )

    // if (result) {
    //     await CreateCookie(username, response)
    // }

    return response
}
