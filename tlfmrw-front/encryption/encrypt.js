import bcrypt from "bcrypt"
const SALT_ROUNDS = 12

export const ENCRYPT = {
    async encrypt(plainTextPassword) {
        return await bcrypt.hash(plainTextPassword, SALT_ROUNDS)
    },
    async compare(plainTextPassword, hashedPassword) {
        return await bcrypt.compare(plainTextPassword, hashedPassword)
    }
}