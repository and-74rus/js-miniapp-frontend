import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

function TodoItem({ todo, onComplete, onEdit, onMove, onDelete, operation }) {
  const [editing, setEditing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [date, setDate] = useState("");
  const itemRef = useRef(null);
  const busy = Boolean(operation && (operation === "create" || operation.endsWith(`-${todo.id}`)));

  useEffect(() => {
    if (!editing && !moving) return undefined;

    function keepItemAboveKeyboard() {
      const item = itemRef.current;
      if (!item) return;

      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const bottom = item.getBoundingClientRect().bottom;
      const safeBottom = viewportHeight - 16;

      if (bottom > safeBottom) {
        window.scrollBy({ top: bottom - safeBottom, behavior: "smooth" });
      }
    }

    const timeoutIds = [100, 350, 700].map((delay) => window.setTimeout(keepItemAboveKeyboard, delay));
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", keepItemAboveKeyboard);
    viewport?.addEventListener("scroll", keepItemAboveKeyboard);

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      viewport?.removeEventListener("resize", keepItemAboveKeyboard);
      viewport?.removeEventListener("scroll", keepItemAboveKeyboard);
    };
  }, [editing, moving]);

  function todoDate(todoItem) {
    const sourceDate = todoItem.dueDate || todoItem.date;
    return sourceDate ? new Date(sourceDate).toISOString().slice(0, 10) : "";
  }

  async function saveTitle() {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    await onEdit(todo.id, cleanTitle);
    setEditing(false);
  }

  async function move() {
    if (!date) return;
    await onMove(todo.id, date);
    setMoving(false);
  }

  if (editing) {
    return (
      <li ref={itemRef} className="todo-item todo-item--editing">
        <input value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Новое название дела" autoFocus />
        <div className="todo-edit-actions">
          <button onClick={saveTitle} disabled={busy || !title.trim()}>Сохранить</button>
          <button className="button-secondary" onClick={() => setEditing(false)} disabled={busy}>Отмена</button>
        </div>
      </li>
    );
  }

  if (moving) {
    return (
      <li ref={itemRef} className="todo-item todo-item--editing">
        <strong className="todo-edit-title">{todo.title}</strong>
        <label><span className="sr-only">Дата переноса</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} disabled={busy} autoFocus /></label>
        <div className="todo-edit-actions">
          <button onClick={move} disabled={busy || !date}>Сохранить</button>
          <button className="button-secondary" onClick={() => setMoving(false)} disabled={busy}>Отмена</button>
        </div>
      </li>
    );
  }

  return (
    <li ref={itemRef} className={`todo-item ${todo.finishedAt ? "todo-item--done" : "todo-item--active"}`}>
      <span className="todo-title"><Icon name={todo.finishedAt ? "checkCircle" : "circle"} /> <span>{todo.title}</span></span>
      {!todo.finishedAt && <>
        <div className="todo-actions">
          <button className="icon-button" onClick={() => setEditing(true)} disabled={busy} aria-label="Изменить" title="Изменить"><Icon name="pencil" /></button>
          <button className="icon-button" onClick={() => { setDate(todoDate(todo)); setMoving(true); }} disabled={busy} aria-label="Перенести" title="Перенести"><Icon name="move" /></button>
          <button className="icon-button button-danger" onClick={() => window.confirm("Удалить это дело?") && onDelete(todo.id)} disabled={busy} aria-label="Удалить" title="Удалить"><Icon name="trash" /></button>
          <button className="complete-button" onClick={() => onComplete(todo.id)} disabled={busy}><Icon name="check" /> Выполнить</button>
        </div>
      </>}
    </li>
  );
}

export default TodoItem;
