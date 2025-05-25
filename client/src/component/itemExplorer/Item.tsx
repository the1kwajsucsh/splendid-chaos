import { Item } from './ItemExplorer';

interface ItemProps {
  file: Item;
  onClick?: (file: Item) => void;
}

export default function ItemComponent({ file, onClick }: ItemProps) {
  const formatDate = (date: Date) => {
    if (!date) {
      return '';
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year:
        date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.detail === 1) {
      // Single click
      onClick?.(file);
    }
  };

  return (
    <div className={`item-container`} onClick={handleClick}>
      <div className={'item-content'}>
        <div className={'item-title'} title={file.title}>
          {file.title}
        </div>

        <div className={'item-details'}>
          <span className={'item-subtext'}>{file.subText}</span>
          <span className={'item-date'}>
            Modified {formatDate(file.dateModified)}
          </span>
        </div>
      </div>
    </div>
  );
}
