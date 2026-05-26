'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, UserCheck } from 'lucide-react';

interface AgentAvatarProps {
  agent: 'hr' | 'technical' | 'evaluator';
  isSpeaking: boolean;
}

const agentConfig = {
  hr: {
    label: 'HR Agent',
    sublabel: 'People & Culture',
    icon: UserCheck,
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #059669, #34d399)',
    glow: 'rgba(52, 211, 153, 0.3)',
  },
  technical: {
    label: 'Technical Agent',
    sublabel: 'Systems & Code',
    icon: Brain,
    color: '#818cf8',
    gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
    glow: 'rgba(129, 140, 248, 0.35)',
  },
  evaluator: {
    label: 'Evaluator Agent',
    sublabel: 'Assessment',
    icon: Zap,
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    glow: 'rgba(251, 191, 36, 0.3)',
  },
};

export function AgentAvatar({ agent, isSpeaking }: AgentAvatarProps) {
  const cfg = agentConfig[agent];
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar ring */}
      <div className="relative">
        {/* Outer pulse ring */}
        {isSpeaking && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: cfg.gradient, opacity: 0.2 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: cfg.gradient, opacity: 0.15 }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0.02, 0.15] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
          </>
        )}

        {/* Spin ring */}
        <motion.div
          className="absolute -inset-2 rounded-full border-2 border-dashed opacity-30"
          style={{ borderColor: cfg.color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* Avatar itself */}
        <motion.div
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: cfg.gradient,
            boxShadow: isSpeaking ? `0 0 40px ${cfg.glow}, 0 0 80px ${cfg.glow}` : `0 0 20px ${cfg.glow}`,
          }}
          animate={isSpeaking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 1.5, repeat: isSpeaking ? Infinity : 0, ease: 'easeInOut' }}
        >
          <Icon size={48} className="text-white" />
        </motion.div>
      </div>

      {/* Agent label */}
      <div className="text-center">
        <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{cfg.label}</p>
        <p className="text-xs" style={{ color: cfg.color }}>{cfg.sublabel}</p>
      </div>

      {/* Speaking indicator / waveform */}
      <AnimatePresence>
        {isSpeaking ? (
          <motion.div
            key="waveform"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-end gap-1 h-8 px-4 py-1 rounded-full border"
            style={{ background: `${cfg.glow}`, borderColor: cfg.color + '44' }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ background: cfg.color }}
                animate={{ height: ['4px', `${10 + Math.random() * 14}px`, '4px'] }}
                transition={{
                  duration: 0.6 + Math.random() * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.07,
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs px-3 py-1.5 rounded-full border"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
          >
            Listening...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
