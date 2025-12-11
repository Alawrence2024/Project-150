"use client";

import styles from "@/styles/landing.module.css";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { DAL } from "../../dals/PersistentRedisDAL";
import { setUser } from "../lib/user";
import { fetchMangaDetails } from "../lib/mangadex";
import Link from "next/link";


export default function library() {
    const { userData, _ } = setUser()
    const [loading, setLoading] = useState(true)
    const [favorited, setFavorited] = useState([])
    const [ mangas, setMangas ] = useState([])


    useEffect(() => {

        async function getUserManga() {

        const favoriteResponses = await fetch(`/api/favorite?username=${userData}`)
        const data = await favoriteResponses.json()
        setFavorited(data.favorites)
    }
    getUserManga()
    // setLoading(false)
    }, [])

    useEffect(() => {
        async function fetchManga() {

            for (const mangaId of favorited) {
                const mangaDetails = await fetchMangaDetails(mangaId)
                setMangas(prev => [...prev, mangaDetails])
            }
            setLoading(false)
        }
        fetchManga()
    }, [favorited])

        return (
            <main>
                <section className={styles.popularSection}>
                    {loading ? (
                        <p>Loading your favs...</p>
                    ) : (
                        <div className={styles.mangaGrid}>

                            {mangas.map((manga) => (
                                <Link
                                    key={manga.id}
                                    href={`/reader/${manga.id}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div className={styles.mangaCard}>

                                        <div className={styles.coverImageContainer}>
                                            <img
                                                src={manga.coverUrl}
                                                alt={manga.title}
                                                className={styles.coverImage}
                                            />
                                        </div>

                                        <h4 className={styles.mangaTitle}>
                                            {manga.title}
                                        </h4>

                                        <p className={styles.mangaDescription}>
                                            {manga.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}

                        </div>
                    )}
                </section>
            </main>
        );

    }

