import { useState } from "react";
import Icon from "./Icon";

function UserInfo({ user }) {
  const [expanded, setExpanded] = useState(false);

  if (!user) return <p>Данные пользователя недоступны.</p>;

  return (
    <div className="user-info">
      <button className="user-info__toggle" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>
        <span>Информация о пользователе</span>
        <Icon name="chevronDown" className={`chevron ${expanded ? "chevron--up" : ""}`} />
      </button>
      {expanded && (
        <div className="user-info__panel">
          <p>Username: {user.username ? `@${user.username}` : "не указан"}</p>
          <p>Telegram ID: {user.id}</p>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
