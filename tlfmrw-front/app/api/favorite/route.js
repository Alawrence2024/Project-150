import { use } from "react";
import { DAL } from "../../../dals/PersistentRedisDAL";

export async function GET(request) {
    const urlData = new URL(request.url)
    const { username } = urlData.searchParams
    const userFavorites = await DAL.GetUserFavorites(username)
    return new Response(JSON.stringify({favorites: userFavorites}))
}

export async function POST(request) {
    const { username, mangaId } = await request.json()
    await DAL.SetUserFavorite(username, mangaId)
    return new Response()
}

export async function DELETE(request) {
<<<<<<< HEAD
    const { username, mangaID } = await request.json()
    await DAL.RemoveUserFavorite(username, mangaID)
}
=======
<<<<<<< Updated upstream

}
=======
<<<<<<< HEAD
    const { username, mangaID } = await request.json()
    await DAL.RemoveUserFavorite(username, mangaID)
}
=======
    const { username, mangaId } = await request.json()
    await DAL.RemoveUserFavorite(username, mangaId)
    return new Response()
}
>>>>>>> a0e12388baf13224665be7ce6513aa2cdf260054
>>>>>>> Stashed changes
>>>>>>> 09a49e7 (library stuff)
