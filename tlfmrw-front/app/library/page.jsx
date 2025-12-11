"use client";

import "@/styles/library.css";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import { DAL } from "../../dals/PersistentRedisDAL";
import { setUser } from "../lib/user";


export default function library() {

async function getUserManga() {
        const {userData, _} = setUser()
        const [favorited, setFavorited] = useState(null)
try {
          const favoriteResponses = await fetch('/api/favorite?username=${userData}')        
          const data = favoriteResponses.json()
          setFavorited(data.favorited)

          return favorited?.data.map((manga) => {
            const coverArt = manga.relationships.find((rel) => rel.type === 'cover_art');
            const fileName = coverArt ? coverArt.attributes.fileName : null;
            return {
                id: manga.id,
                title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                coverUrl: fileName
                    ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
                    : 'https://via.placeholder.com/200x300?text=No+Image',
                description: manga.attributes.description.en || 'No description available',
            };
        });
} catch (error) {
  
}

  return (
    <main>
          <section className={styles.popularSection}>                    
                    {loading ? (
                        <p>Loading your favs...</p>
                    ) : (
                        <div className={styles.mangaGrid}>
                            
                            {trendingManga.map((manga) => (
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

}}
