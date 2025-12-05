"use server"

import { DAL } from "../../../dals/PersistentRedisDAL"
import { ENCRYPT } from "../../../encryption/encrypt"

export async function POST(request) {
    const { username, password } = await request.json()
    const encryptedPassword = await ENCRYPT.encrypt(password)
    await DAL.CreateUser(username, encryptedPassword)
    return new Response({success: "true"})
}