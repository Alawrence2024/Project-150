import Link from 'next/link';
import styles from '@/styles/landing.module.css';

interface Manga {
  id: string;
  attributes: {
    title: { [key: string]: string };
    description: { [key: string]: string };
  };
  relationships?: Array<{
    type: string;
    attributes?: { fileName?: string };
  }>;
}

export function SearchResultsGrid({ mangaList }: { mangaList: Manga[] }) {
  if (mangaList.length === 0) {
    return <p className="text-gray-600">No manga found for this search term.</p>;
  }

  return (
    <div className={styles.mangaGrid}>
      {mangaList.map((manga) => {
        const title =
          manga.attributes.title.en ||
          Object.values(manga.attributes.title)[0] ||
          'Untitled Manga';

        const description =
          manga.attributes.description.en ||
          Object.values(manga.attributes.description)[0] ||
          'No description available';

        const coverRel = manga.relationships?.find((rel) => rel.type === 'cover_art');
        const coverUrl = coverRel
          ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes?.fileName}`
          : '/placeholder-cover.png';

        return (
          <Link key={manga.id} href={`/reader/${manga.id}`}>
            <div className={`${styles.mangaCard} cursor-pointer`}>
              <div className={styles.coverImageContainer}>
                <img src={coverUrl} alt={title} className={styles.coverImage} />
              </div>
              <h3 className={styles.mangaTitle}>{title}</h3>
              <p className={styles.mangaDescription}>{description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
