import api from "./api";

export async function getTodos({
  telegramId,
  date = new Date().toISOString(),
  sort = "asc",
}) {
  const response = await api.get("/todo", {
    params: {
      telegramId: String(telegramId),
      date,
      sort,
    },
  });

  return response.data.data;
}

export async function createTodo({
  telegramId,
  title,
  date = new Date().toISOString(),
}) {
  const response = await api.post("/todo", {
    telegramId: String(telegramId),
    title,
    date,
  });

  return response.data.data;
}

export async function completeTodo(todoId) {
  const response = await api.put(`/todo/${todoId}`, {
    finishedAt: new Date().toISOString(),
  });

  return response.data.data;
}

export async function updateTodo(todoId, data) {
  const response = await api.put(`/todo/${todoId}`, data);
  return response.data.data;
}

export async function deleteTodo(todoId) {
  await api.delete(`/todo/${todoId}`);
}
