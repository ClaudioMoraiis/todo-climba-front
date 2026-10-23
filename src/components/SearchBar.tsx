interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-bar">
      <span className="search-bar__label">Pesquisar</span>
      <span className="search-bar__field">
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar por título ou descrição..."
          aria-label="Pesquisar tarefas"
        />
      </span>
    </label>
  )
}
