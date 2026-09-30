function TodoFilters({ filter, onChange }) {
  return (
    <div className="todo-filters" aria-label="Фильтр дел">
      {[['all', 'Все'], ['active', 'Активные'], ['done', 'Выполненные']].map(([value, label]) => (
        <button key={value} className={filter === value ? "filter-button filter-button--active" : "filter-button"} onClick={() => onChange(value)}>{label}</button>
      ))}
    </div>
  );
}

export default TodoFilters;
