import { useState } from "react";

function TodoForm({ onCreate, disabled = false }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    await onCreate(cleanTitle);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Новое дело"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={disabled}
      />

      <button type="submit" disabled={disabled}>
        Добавить
      </button>
    </form>
  );
}

export default TodoForm;
