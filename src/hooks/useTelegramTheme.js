import { useEffect, useState } from "react";

export function useTelegramTheme(webApp) {
  const [colorScheme, setColorScheme] = useState(() => {
    return webApp?.colorScheme || "light";
  });

  useEffect(() => {
    if (!webApp) {
      return;
    }

    function handleThemeChanged() {
      setColorScheme(webApp.colorScheme || "light");
    }

    webApp.onEvent("themeChanged", handleThemeChanged);

    return () => {
      if (typeof webApp.offEvent === "function") {
        webApp.offEvent("themeChanged", handleThemeChanged);
      }
    };
  }, [webApp]);

  const themeParams = webApp?.themeParams || {};

  return {
    colorScheme,
    themeParams,
  };
}
