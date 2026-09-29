import CloseButton from "./components/CloseButton";
import ErrorMessage from "./components/ErrorMessage";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import UserInfo from "./components/UserInfo";
import { useTelegram } from "./hooks/useTelegram";
import { useTelegramTheme } from "./hooks/useTelegramTheme";
import { useTodos } from "./hooks/useTodos";

function App() {
  const { webApp, user, isTelegram } = useTelegram();
  const { colorScheme, themeParams } = useTelegramTheme(webApp);

  const { todos, loading, error, addTodo, completeTodo } = useTodos(user);
  const themeStyle = {
    "--tg-bg-color": themeParams.bg_color || "#ffffff",
    "--tg-text-color": themeParams.text_color || "#000000",
    "--tg-hint-color": themeParams.hint_color || "#999999",
    "--tg-button-color": themeParams.button_color || "#2481cc",
    "--tg-button-text-color": themeParams.button_text_color || "#ffffff",
    "--tg-secondary-bg-color": themeParams.secondary_bg_color || "#f0f0f0",
  };

  if (!isTelegram) {
    return (
      <main>
        <h1>Telegram MiniApp</h1>
        <p>Откройте приложение внутри Telegram.</p>
      </main>
    );
  }

  if (!user) {
    return <p>Данные пользователя недоступны.</p>;
  }

  if (loading) {
    return (
      <main className={`app app--${colorScheme}`} style={themeStyle}>
        <p className="loading-message">Загрузка данных...</p>
      </main>
    );
  }

  return (
    <main className={`app app--${colorScheme}`} style={themeStyle}>
      <h1>Мои дела</h1>

      <UserInfo user={user} />

      <TodoForm onCreate={addTodo} />

      <ErrorMessage message={error} />

      {todos.length === 0 ? (
        <p className="empty-message">На сегодня дел нет.</p>
      ) : (
        <TodoList todos={todos} onComplete={completeTodo} />
      )}

      <CloseButton webApp={webApp} />
    </main>
  );
}

export default App;
