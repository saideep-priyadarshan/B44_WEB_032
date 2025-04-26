import { Switch } from '@headlessui/react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../hooks/useTheme';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ThemeToggle = () => {
  const { theme, cycleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'light') return <SunIcon className="h-5 w-5 text-yellow-500" />;
    if (theme === 'dark') return <MoonIcon className="h-5 w-5 text-indigo-400" />;
    return <ComputerDesktopIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
  };

  const getAriaLabel = () => {
     if (theme === 'light') return 'Switch to Dark Mode';
     if (theme === 'dark') return 'Switch to System Preference';
     return 'Switch to Light Mode';
  }

  return (
    <button
        onClick={cycleTheme}
        aria-label={getAriaLabel()}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
    >
        {getIcon()}
    </button>
  );
};


export default ThemeToggle;