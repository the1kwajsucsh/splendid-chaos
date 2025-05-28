import { SortDirection, SortOption } from './ItemExplorer';

interface SortOptionsProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sort: SortOption) => void;
  onDirectionChange: (direction: SortDirection) => void;
  onAdd: () => Promise<void>;
}

export default function SortOptions({
  sortBy,
  sortDirection,
  onSortChange,
  onDirectionChange,
  onAdd,
}: SortOptionsProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'title', label: 'Title' },
    { value: 'dateModified', label: 'Date Modified' },
  ];

  return (
    <div className={'sortOptions-container'}>
      <div className={'sortOptions-sortControls'}>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={'sortOptions-select'}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            onDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')
          }
          className={'sortOptions-directionButton'}
          aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      <button
        onClick={onAdd}
        className={'sortOptions-addButton'}
        aria-label="Add new item"
      >
        ➕ Add
      </button>
    </div>
  );
}
