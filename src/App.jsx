import { useState } from "react";
import CloseButton from "./components/CloseButton";
import ErrorMessage from "./components/ErrorMessage";
import TodoDatePicker from "./components/TodoDatePicker";
import TodoFilters from "./components/TodoFilters";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import UserInfo from "./components/UserInfo";
import { useTelegram } from "./hooks/useTelegram";
import { useTelegramTheme } from "./hooks/useTelegramTheme";
import { useTodos } from "./hooks/useTodos";

const inputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function App() {
  const { webApp, user, isTelegram } = useTelegram();
  const { colorScheme, themeParams } = useTelegramTheme(webApp);
  const [selectedDate, setSelectedDate] = useState(inputDate(new Date()));
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const { todos, loading, error, message, operation, addTodo, completeTodo, editTodo, moveTodo, removeTodo } = useTodos(user, selectedDate);
  const themeStyle = {
    "--tg-bg-color": themeParams.bg_color || (colorScheme === "dark" ? "#212121" : "#ffffff"),
    "--tg-text-color": themeParams.text_color || (colorScheme === "dark" ? "#ffffff" : "#000000"),
    "--tg-hint-color": themeParams.hint_color || (colorScheme === "dark" ? "#aaaaaa" : "#999999"),
    "--tg-button-color": themeParams.button_color || "#2481cc",
    "--tg-button-text-color": themeParams.button_text_color || "#ffffff",
    "--tg-secondary-bg-color": themeParams.secondary_bg_color || (colorScheme === "dark" ? "#2b2b2b" : "#f0f0f0"),
    colorScheme,
  };

  const todayDate = inputDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = inputDate(tomorrow);

  function selectTomorrow() {
    setSelectedDate(tomorrowDate);
  }

  function selectToday() {
    setSelectedDate(todayDate);
  }

  function selectAll() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    setSelectedDate(inputDate(date));
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.finishedAt;
    if (filter === "done") return Boolean(todo.finishedAt);
    return true;
  });

  if (!isTelegram) return <main className="standalone-message"><h1>Telegram MiniApp</h1><p>Откройте приложение внутри Telegram.</p></main>;
  if (!user) return <p className="standalone-message">Данные пользователя недоступны.</p>;

  return (
    <main className={`app app--${colorScheme}`} style={themeStyle}>
      <header className="app-header">
        <h1>Дела {[user.first_name, user.last_name].filter(Boolean).join(" ")}</h1>
        <CloseButton webApp={webApp} />
      </header>
      <UserInfo user={user} />
      <TodoDatePicker value={selectedDate} onChange={setSelectedDate} onToday={selectToday} onTomorrow={selectTomorrow} onAll={selectAll} onAdd={() => setShowForm(true)} todayDate={todayDate} tomorrowDate={tomorrowDate} disabled={loading || showForm} />
      {showForm && <TodoForm date={selectedDate} onDateChange={setSelectedDate} onCreate={addTodo} onCancel={() => setShowForm(false)} disabled={operation === "create" || loading} />}
      <ErrorMessage message={error} />
      {message && <p className="success-message">{message}</p>}
      <TodoFilters filter={filter} onChange={setFilter} />
      {loading ? <p className="loading-message">Загрузка дел...</p> : filteredTodos.length === 0 ? <p className="empty-message">{todos.length === 0 ? "Дел нет." : "По выбранному фильтру дел нет."}</p> : <TodoList todos={filteredTodos} onComplete={completeTodo} onEdit={editTodo} onMove={moveTodo} onDelete={removeTodo} operation={operation} />}
    </main>
  );
}

export default App;
