import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
  
    return saved === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement; 


    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
     
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
     
    }

   
  }, [isDark]);

  return (
    <button
      onClick={() => {
        console.log("--- CLIC DÉTECTÉ ---");
        setIsDark(!isDark);
      }}
      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-emerald-400 transition-all duration-300 hover:scale-105 active:scale-95"
      title={isDark ? "Passer au mode clair" : "Passer au mode gris"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;