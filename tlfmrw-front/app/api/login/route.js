export const dynamic = 'force-dynamic'
import { DAL } from "../../../dals/PersistentRedisDAL"
import { ENCRYPT } from "../../../encryption/encrypt"

export async function POST(request) {
    const { username, password } = await request.json()
    if (!username || !password) {
        return new Response(JSON.stringify({ success: "false"}),
        {
            headers: {"Content-Type" : "application/json"}
        })
    }
    const user = await DAL.GetUser(username)
    console.log(user.password)
    const successfulLogin = await ENCRYPT.compare(password, user.password)
    return new Response(
        JSON.stringify({ 
            success: !!user,
            loginSuccess: successfulLogin
        }),
        { 
            headers: { "Content-Type": "application/json" } ,
        }
    )
}