'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '/history', label: 'History' },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/10' : 'py-6 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Brain size={22} className="text-white" />
          </motion.div>
          <span
            className="font-bold text-2xl tracking-tight hidden sm:block"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}
          >
            Inter<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-all hover:text-indigo-500 relative group"
              style={{ color: pathname === link.href ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full ${pathname === link.href ? 'w-full' : ''}`} />
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/upload"
            className="btn-primary text-sm hidden sm:block"
          >
            Start Interview
          </Link>
          
          {/* Mobile menu would go here, but focusing on premium desktop feel first */}
        </div>
      </div>
    </motion.nav>
  );
}
