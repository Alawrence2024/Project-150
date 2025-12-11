export async function getSessionUser() {
    return await fetch("/api/cookie")
}