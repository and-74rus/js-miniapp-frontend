function TodoItem({ todo, onComplete }) {
  return (
    <li className="todo-item">
      <span>
        {todo.finishedAt ? "✅" : "🔹"} {todo.title}
      </span>

      {!todo.finishedAt && (
        <button onClick={() => onComplete(todo.id)}>Выполнить</button>
      )}
    </li>
  );
}

export default TodoItem;
