import api from "./api";

export async function createUser({ telegramId, username }) {
  const response = await api.post("/users", {
    telegramId: String(telegramId),
    username: username || null,
  });

  return response.data.data;
}

export async function getUsers() {
  const response = await api.get("/users");

  return response.data.data;
}

export async function updateUser(id, data) {
  const response = await api.put(`/users/${id}`, data);

  return response.data.data;
}

export async function ensureUser(user) {
  const telegramId = String(user.id);
  const username = user.username || null;

  try {
    return await createUser({
      telegramId,
      username,
    });
  } catch (error) {
    if (error.response?.status !== 409) {
      throw error;
    }

    const users = await getUsers();

    const existingUser = users.find((item) => item.telegramId === telegramId);

    if (!existingUser) {
      throw new Error("Пользователь не найден после конфликта", {
        cause: error,
      });
    }

    return await updateUser(existingUser.id, {
      username,
    });
  }
}
