'use client'; 

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/styles/landing.css'; // <-- 1. Import the CSS Module

// --- API Helper Function (Keep this here or move to a separate lib file) ---
async function getTrendingManga() {
  const params = new URLSearchParams({
    limit: 10,
    'includes[]': 'cover_art',
    'order[followedCount]': 'desc',
    'contentRating[]': 'safe', 
  });

  try {
    const response = await fetch(`https://api.mangadex.org/manga?${params}`);
    const data = await response.json();

    return data.data.map((manga) => {
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
    console.error(error);
    return [];
  }
}

export default function LandingPage() {
  const [trendingManga, setTrendingManga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrendingManga();
      setTrendingManga(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <header>
        <div className="headerContainer">
          <div className="headerNav">
            <Link href="/">
              <h1 className="logoTitle">TLFMRW</h1>
            </Link>
            <nav className="navLinks">
              <Link href="/library">Library</Link>
              <Link href="/search">Search</Link>
            </nav>
          </div>
          <div>
            <Link href="/login">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mainContent">
        {/* Hero Section */}
        <section className="heroSection">
          <h2>Welcome to MangaApp</h2>
          <p>Discover and read your favorite manga</p>
        </section>

        {/* --- POPULAR SECTION (5x2 GRID) --- */}
        <section className="popularSection">
          <h3>Popular This Week</h3>
          
          {loading ? (
            <p>Loading trending manga...</p>
          ) : (
            // Use className={styles.mangaGrid}
            <div className="mangaGrid">
              
              {trendingManga.map((manga) => (
                // Use className={styles.mangaCard}
                <div key={manga.id} className="mangaCard">
                  
                  {/* Image Container */}
                  <div className="coverImageContainer">
                    <img 
                      src={manga.coverUrl} 
                      alt={manga.title} 
                      className="coverImage" // Apply object-fit style here
                    />
                  </div>
                  
                  {/* Title */}
                  <h4 className="mangaTitle">
                    {manga.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="mangaDescription">
                    {manga.description}
                  </p>
                </div>
              ))}

            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footerContainer">
        <p>© 2024 TLFMRW. All rights reserved.</p>
      </footer>
    </div>
  );
}