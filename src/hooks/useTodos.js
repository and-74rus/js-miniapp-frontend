import { useEffect, useState } from "react";
import { ensureUser } from "../services/userService";
import { completeTodo, createTodo, getTodos } from "../services/todoService";

export function useTodos(user) {
  const telegramId = user?.id || null;

  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState(telegramId ? "loading" : "idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!telegramId) {
      return;
    }

    let ignore = false;

    async function loadTodos() {
      try {
        const currentUser = user;

        await ensureUser(currentUser);

        const loadedTodos = await getTodos({
          telegramId,
          date: new Date().toISOString(),
          sort: "asc",
        });

        if (ignore) {
          return;
        }

        setTodos(loadedTodos);
        setStatus("success");
      } catch (requestError) {
        if (ignore) {
          return;
        }

        console.error(
          "Ошибка загрузки дел:",
          requestError.response?.data || requestError.message,
        );

        setError("Не удалось загрузить дела");
        setStatus("error");
      }
    }

    loadTodos();

    return () => {
      ignore = true;
    };
  }, [telegramId, user]);

  async function addTodo(title) {
    const todo = await createTodo({
      telegramId,
      title,
      date: new Date().toISOString(),
    });

    setTodos((currentTodos) => [...currentTodos, todo]);
  }

  async function completeTodoById(todoId) {
    const updatedTodo = await completeTodo(todoId);

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo,
      ),
    );
  }

  return {
    todos,
    loading: status === "loading",
    error,
    addTodo,
    completeTodo: completeTodoById,
  };
}
