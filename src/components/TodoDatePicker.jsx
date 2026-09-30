import Icon from "./Icon";

function TodoDatePicker({ value, onChange, onToday, onTomorrow, onAll, onAdd, todayDate, tomorrowDate, disabled = false }) {
  return (
    <>
      <div className="date-row">
        <label htmlFor="todo-date">Дата</label>
        <input id="todo-date" type="date" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} />
        <button className="add-todo-button" onClick={onAdd} disabled={disabled} aria-label="Добавить дело" title="Добавить дело"><Icon name="plus" /></button>
      </div>
      <nav className="date-tabs" aria-label="Период дел">
        <button className={value === todayDate ? "date-tab date-tab--active" : "date-tab"} onClick={onToday} disabled={disabled}>Сегодня</button>
        <button className={value === tomorrowDate ? "date-tab date-tab--active" : "date-tab"} onClick={onTomorrow} disabled={disabled}>Завтра</button>
        <button className="date-tab" onClick={onAll} disabled={disabled}>Все</button>
      </nav>
    </>
  );
}

export default TodoDatePicker;
