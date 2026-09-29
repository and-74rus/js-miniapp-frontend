function CloseButton({ webApp }) {
  if (!webApp) {
    return null;
  }

  return <button onClick={() => webApp.close()}>Закрыть приложение</button>;
}

export default CloseButton;
