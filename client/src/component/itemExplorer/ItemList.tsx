import ItemComponent from "./Item"
import { Item } from "./ItemExplorer"

interface ItemListProps {
    items: Item[]
    onFileClick?: (file: Item) => void
  }

export default function ItemList({ items, onFileClick }: ItemListProps) {
    if (items.length === 0) {
        return (
          <div className={"list-emptyState"}>
            <div className={"list-emptyIcon"}>📁</div>
            <p>No items found</p>
          </div>
        )
    }

    return (
        <div className={`list-container`}>
          {items.map((item) => (
            <ItemComponent
              key={item.id}
              file={item}
              onClick={onFileClick}
            />
          ))}
        </div>
      )
}