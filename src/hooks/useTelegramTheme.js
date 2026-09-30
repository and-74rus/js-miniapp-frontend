import { useEffect, useState } from "react";

export function useTelegramTheme(webApp) {
  const [colorScheme, setColorScheme] = useState(() => {
    return webApp?.colorScheme || "light";
  });
  const [themeParams, setThemeParams] = useState(() => webApp?.themeParams || {});

  useEffect(() => {
    if (!webApp) {
      return;
    }

    function handleThemeChanged() {
      setColorScheme(webApp.colorScheme || "light");
      setThemeParams(webApp.themeParams || {});
    }

    webApp.onEvent("themeChanged", handleThemeChanged);

    return () => {
      if (typeof webApp.offEvent === "function") {
        webApp.offEvent("themeChanged", handleThemeChanged);
      }
    };
  }, [webApp]);

  return {
    colorScheme,
    themeParams,
  };
}
