'use client';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full cursor-pointer focus:outline-none"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #6366f1, #a855f7)'
          : 'linear-gradient(135deg, #93c5fd, #6366f1)',
        boxShadow: isDark
          ? '0 0 12px rgba(129,140,248,0.5)'
          : '0 0 8px rgba(99,102,241,0.3)',
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md"
        animate={{ x: isDark ? 28 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {isDark ? (
          <Moon size={13} className="text-indigo-600" />
        ) : (
          <Sun size={13} className="text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
}
