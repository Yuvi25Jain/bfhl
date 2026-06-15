'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Brain, LogOut, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useStore();

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/login', label: 'Sign In' },
  ];

  const portalLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/upload', label: 'Upload' },
    { href: '/job-description', label: 'Skill Gap' },
    { href: '/interview', label: 'Interview' },
    { href: '/coding', label: 'Coding IDE' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/history', label: 'History' },
  ];

  const links = user ? portalLinks : publicLinks;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 py-3 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
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
            MockMate <span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Center Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
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
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
                <User size={14} />
                <span>{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-red-500 cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/register"
              className="btn-primary text-sm hover:scale-[1.02] transition-transform duration-200"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
