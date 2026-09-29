import TodoItem from "./TodoItem";

function TodoList({ todos, onComplete }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onComplete={onComplete} />
      ))}
    </ul>
  );
}

export default TodoList;
