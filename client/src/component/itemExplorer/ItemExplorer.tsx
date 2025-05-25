import { useMemo, useState } from 'react';
import ItemList from './ItemList';
import './ItemExplorer.css';

export interface Item {
  id: string;
  title: string;
  subText: string;
  dateModified: Date;
}

export type SortOption = 'title' | 'dateModified';
export type SortDirection = 'asc' | 'desc';

interface ItemExplorerProps {
  items: Item[];
  onFileClick?: (item: Item) => void;
}

export default function ItemExplorer({
  items,
  onFileClick,
}: ItemExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [items, searchQuery, sortBy, sortDirection]);

  return (
    <div className="container">
      <ItemList items={filteredAndSortedItems} />
    </div>
  );
}
