import { useState } from "react";

function TodoForm({ date, onDateChange, onCreate, disabled = false, onCancel }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    await onCreate(cleanTitle, date);
    setTitle("");
    onCancel();
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Название дела" value={title} onChange={(event) => setTitle(event.target.value)} disabled={disabled} autoFocus />
      <label>
        <span className="sr-only">Дата дела</span>
        <input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} disabled={disabled} />
      </label>
      <button type="submit" disabled={disabled || !title.trim()}>Добавить</button>
      <button type="button" className="button-secondary" onClick={onCancel} disabled={disabled}>Отмена</button>
    </form>
  );
}

export default TodoForm;
