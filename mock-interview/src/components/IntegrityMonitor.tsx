'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface IntegrityMonitorProps {
  active: boolean;
}

export function IntegrityMonitor({ active }: IntegrityMonitorProps) {
  const { addIntegrityEvent, integrityEvents, integrityScore, setIntegrityScore } = useStore();
  const [warning, setWarning] = useState<string | null>(null);
  const lastActivityRef = useRef(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showWarning = (msg: string) => {
    setWarning(msg);
    setTimeout(() => setWarning(null), 4000);
  };

  useEffect(() => {
    if (!active) return;

    // Tab visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addIntegrityEvent({ type: 'tab_switch', timestamp: Date.now() });
        setIntegrityScore(Math.max(0, integrityScore - 8));
        showWarning('⚠️ Tab switch detected! Please stay on this page during your interview.');
      }
    };

    // Window focus loss
    const handleBlur = () => {
      addIntegrityEvent({ type: 'focus_loss', timestamp: Date.now() });
      setIntegrityScore(Math.max(0, integrityScore - 5));
      showWarning('⚠️ Window focus lost. Please keep this window active.');
    };

    // Mouse move / key press = activity
    const resetActivity = () => { lastActivityRef.current = Date.now(); };

    // Inactivity check every 30s
    inactivityTimerRef.current = setInterval(() => {
      const idle = (Date.now() - lastActivityRef.current) / 1000;
      if (idle > 30) {
        addIntegrityEvent({ type: 'inactivity', timestamp: Date.now() });
        setIntegrityScore(Math.max(0, integrityScore - 3));
        showWarning('⏱ Inactivity detected. Please respond to continue your interview.');
      }
    }, 30000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keydown', resetActivity);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [active, integrityScore]);

  // Integrity color
  const color = integrityScore >= 80 ? 'var(--success)' : integrityScore >= 60 ? 'var(--warning)' : 'var(--danger)';
  const label = integrityScore >= 80 ? 'Excellent' : integrityScore >= 60 ? 'Fair' : 'Poor';

  return (
    <>
      {/* Integrity Badge */}
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium"
        style={{ borderColor: color + '44', background: color + '11', color }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Shield size={12} />
        Integrity: {integrityScore}% · {label}
      </motion.div>

      {/* Warning toast */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className="rounded-xl p-4 flex items-start gap-3 shadow-2xl border"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--warning)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(251,191,36,0.2)',
              }}>
              <AlertTriangle size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{warning}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
