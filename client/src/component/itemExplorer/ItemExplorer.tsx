import { useMemo, useState } from 'react';
import ItemList from './ItemList';
import './ItemExplorer.css';
import SearchBar from './SearchBar';
import SortOptions from './SortOptions';
import { useNavigate } from 'react-router';
import { Song } from '../../Music/Music';

export interface Item {
  id: string;
  title: string;
  subText: string;
  dateModified: Date;
  lastDateRehearsed: Date;
}

export type SortOption = 'title' | 'dateModified' | 'lastRehearsed';
export type SortDirection = 'asc' | 'desc';

interface ItemExplorerProps {
  items: Item[];
  onItemClick?: (item: Item) => void;
}

const domain =
  process.env.NODE_ENV === 'production'
    ? 'https://splendid-chaos-server.vercel.app/'
    : '/';
const apiUrl = 'music';

export default function ItemExplorer({
  items,
  onItemClick,
}: ItemExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  let navigate = useNavigate();

  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((file) =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dateModified':
          comparison = a.dateModified.getTime() - b.dateModified.getTime();
          break;
        case 'lastRehearsed': 
          comparison = a.lastDateRehearsed.getTime() - b.lastDateRehearsed.getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [items, searchQuery, sortBy, sortDirection]);

  async function createSong() {
    const response = await fetch(`${domain}${apiUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const newSong: Song = await response.json();
      navigate(`/music/${newSong.id}`);
    }
  }

  return (
    <div className="explorer-container">
      <div className="explorer-header">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search files..."
        />
        <SortOptions
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={setSortBy}
          onDirectionChange={setSortDirection}
          onAdd={() => createSong()}
        />
      </div>
      <ItemList items={filteredAndSortedItems} onItemClick={onItemClick} />
    </div>
  );
}
