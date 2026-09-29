import { useEffect, useState } from "react";

export function useTelegram() {
  const [webApp] = useState(() => {
    return window.Telegram?.WebApp || null;
  });

  const user = webApp?.initDataUnsafe?.user || null;
  const isTelegram = Boolean(webApp?.initData || user);

  useEffect(() => {
    if (!webApp || !isTelegram) {
      return;
    }

    webApp.ready();
    webApp.expand();
  }, [webApp, isTelegram]);

  return {
    webApp,
    user,
    isTelegram,
  };
}
