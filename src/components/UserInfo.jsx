function UserInfo({ user }) {
  if (!user) {
    return <p>Данные пользователя недоступны.</p>;
  }

  return (
    <section>
      <h2>
        {user.first_name} {user.last_name || ""}
      </h2>

      <p>Username: {user.username ? `@${user.username}` : "не указан"}</p>

      <p>Telegram ID: {user.id}</p>
    </section>
  );
}

export default UserInfo;
