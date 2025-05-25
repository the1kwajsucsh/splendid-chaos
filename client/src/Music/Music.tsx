import { useEffect, useState } from 'react';
import ItemExplorer, { Item } from '../component/itemExplorer/ItemExplorer';
import { ResponsiveContainer } from '../component/ResponsiveContainer';

export type MusicType = {
  id: number;
  category: string;
  instruments: string;
  playtime: string;
  performance_ready: boolean;
  name: string;
  genre_mood: string;
  tempo: number;
  date_modified: Date;
  link: string;
};

export default function Music() {
  const [music, setMusic] = useState<MusicType[]>([]);
  const [loading, setLoading] = useState(true);

  const domain =
    process.env.NODE_ENV === 'production'
      ? 'https://splendid-chaos-server.vercel.app/'
      : '/';
  const apiUrl = 'music';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(domain + apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setMusic(json);
      } catch (e) {
        console.error('Failed to fetch music data:', e);
        setMusic([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [domain, apiUrl]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const items: Item[] = music.map((song) => {
    const item: Item = {
      id: song.id.toString(),
      title: song.name,
      subText: song.category,
      dateModified: new Date(song.date_modified),
    };
    return item;
  });

  return (
    <ResponsiveContainer>
      <ItemExplorer items={items} />
    </ResponsiveContainer>
  );
}
