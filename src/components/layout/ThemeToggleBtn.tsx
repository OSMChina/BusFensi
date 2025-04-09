import { faDesktop, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect } from "react";
import { useSettingsStore } from "../../store/settings";

export function ThemeToggleButton({ className = "" }: { className?: string}) {
  const { appearance, updateSettingsAction } = useSettingsStore();
  const currentTheme = appearance.theme;

  const getSystemTheme = () => 
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const toggleTheme = useCallback(() => {
    const themes = ['light', 'dark', 'system'];
    const newTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length] as typeof currentTheme;
    updateSettingsAction({
      appearance: { ...appearance, theme: newTheme }
    });
  }, [currentTheme, appearance, updateSettingsAction]);

  useEffect(() => {
    const effectiveTheme = currentTheme === 'system' ? getSystemTheme() : currentTheme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [currentTheme]);

  return (
    <button onClick={toggleTheme} className={`btn btn-ghost btn-circle ${className}`}>
      <FontAwesomeIcon 
        icon={
          currentTheme === 'dark' ? faMoon :
          currentTheme === 'light' ? faSun : 
          faDesktop
        } 
      />
    </button>
  );
}