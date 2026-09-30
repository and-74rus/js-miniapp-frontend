import TodoItem from "./TodoItem";

function TodoList({ todos, ...actions }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} {...actions} operation={actions.operation} />
      ))}
    </ul>
  );
}

export default TodoList;
