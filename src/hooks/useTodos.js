import { useEffect, useState } from "react";
import { ensureUser } from "../services/userService";
import {
  completeTodo,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../services/todoService";

export function useTodos(user, selectedDate) {
  const telegramId = user?.id || null;

  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState(telegramId ? "loading" : "idle");
  const [error, setError] = useState(null);
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!telegramId) {
      return;
    }

    let ignore = false;
    async function loadTodos() {
      setStatus("loading");
      setError(null);
      try {
        await ensureUser(user);

        const loadedTodos = await getTodos({
          telegramId,
          date: selectedDate,
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

        setError("Не удалось загрузить данные.");
        setStatus("error");
      }
    }

    loadTodos();

    return () => {
      ignore = true;
    };
  }, [telegramId, user, selectedDate]);

  async function runOperation(name, callback, successMessage) {
    setOperation(name);
    setError(null);
    setMessage(null);

    try {
      const result = await callback();
      if (successMessage) setMessage(successMessage);
      return result;
    } catch (requestError) {
      console.error("Ошибка операции с делом:", requestError.response?.data || requestError.message);
      setError("Не удалось выполнить операцию. Попробуйте ещё раз.");
      throw requestError;
    } finally {
      setOperation(null);
    }
  }

  async function addTodo(title, date) {
    const todo = await runOperation("create", () =>
      createTodo({ telegramId, title: title.trim(), date }),
    );

    setTodos((currentTodos) => [...currentTodos, todo]);
  }

  async function completeTodoById(todoId) {
    const updatedTodo = await runOperation(`complete-${todoId}`, () => completeTodo(todoId));

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo,
      ),
    );
  }

  async function editTodo(todoId, title) {
    const updatedTodo = await runOperation(
      `edit-${todoId}`,
      () => updateTodo(todoId, { title: title.trim() }),
      "Дело успешно изменено.",
    );
    setTodos((currentTodos) => currentTodos.map((todo) => todo.id === updatedTodo.id ? updatedTodo : todo));
  }

  async function moveTodo(todoId, date) {
    const updatedTodo = await runOperation(`move-${todoId}`, () =>
      // Date-only values must be interpreted as UTC midnight. Parsing them as
      // local midnight shifts the calendar date in time zones east of UTC.
      updateTodo(todoId, { dueDate: new Date(`${date}T00:00:00.000Z`).toISOString() }),
    );
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== updatedTodo.id));
  }

  async function removeTodo(todoId) {
    await runOperation(`delete-${todoId}`, () => deleteTodo(todoId));
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
  }

  return {
    todos,
    loading: status === "loading",
    error,
    message,
    operation,
    addTodo,
    completeTodo: completeTodoById,
    editTodo,
    moveTodo,
    removeTodo,
  };
}
