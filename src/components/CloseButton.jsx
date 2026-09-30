import Icon from "./Icon";

function CloseButton({ webApp }) {
  if (!webApp) return null;

  return <button className="close-button" onClick={() => webApp.close()} aria-label="Закрыть приложение" title="Закрыть приложение"><Icon name="close" /></button>;
}

export default CloseButton;
