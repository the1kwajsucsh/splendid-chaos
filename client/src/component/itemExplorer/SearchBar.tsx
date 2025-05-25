interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }

export default function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
    const handleClear = () => {
        onChange("")
      }
    
      return (
        <div className={"searchbar-container"}>
          <div className={"searchbar-searchIcon"}>🔍</div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={"searchbar-input"}
          />
          {value && (
            <button onClick={handleClear} className={"searchbar-clearButton"} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      )
}