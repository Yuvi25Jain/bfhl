'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Send } from 'lucide-react';

interface RecorderProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function Recorder({ onSubmit, disabled }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const textRef = useRef<HTMLTextAreaElement>(null);

  const toggleRecording = () => {
    if (disabled) return;
    setIsRecording(p => !p);
    if (isRecording) {
      // Simulate voice transcription
      const mockTranscripts = [
        "I have extensive experience with React and TypeScript, building scalable frontend applications.",
        "I believe my strongest skill is problem solving. I approach complex issues systematically.",
        "At my previous company, I led the migration from a monolith to microservices architecture.",
        "I'm particularly interested in this role because it aligns with my passion for distributed systems.",
      ];
      const transcript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setTextInput(transcript);
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (!textInput.trim() || disabled) return;
    onSubmit(textInput.trim());
    setTextInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Mode tabs */}
      <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)' }}>
        {(['text','voice'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
            style={{
              background: mode === m ? 'var(--gradient-primary)' : 'transparent',
              color: mode === m ? 'white' : 'var(--text-muted)',
            }}>
            {m === 'voice' ? '🎙 Voice' : '⌨️ Text'}
          </button>
        ))}
      </div>

      {mode === 'text' ? (
        <div className="flex gap-3 items-end">
          <textarea
            ref={textRef}
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer... (Enter to submit)"
            disabled={disabled}
            rows={3}
            className="flex-1 resize-none px-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2 disabled:opacity-50"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              lineHeight: '1.6',
            }}
          />
          <motion.button
            onClick={handleSubmit}
            disabled={!textInput.trim() || disabled}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-xl flex-shrink-0 transition-all disabled:opacity-40"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Send size={18} className="text-white" />
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Voice button */}
          <motion.button
            onClick={toggleRecording}
            disabled={disabled}
            whileTap={{ scale: 0.9 }}
            className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
            style={{
              background: isRecording ? 'linear-gradient(135deg, #ef4444, #f87171)' : 'var(--gradient-primary)',
              boxShadow: isRecording 
                ? '0 0 30px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.2)' 
                : '0 0 20px var(--accent-glow)',
            }}
          >
            {isRecording && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-400"
                animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            {isRecording ? (
              <Square size={28} className="text-white" />
            ) : (
              <Mic size={28} className="text-white" />
            )}
          </motion.button>

          {/* Waveform during recording */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-end gap-1 h-10"
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    style={{ background: 'var(--gradient-primary)', minHeight: '4px' }}
                    animate={{ height: [`${4 + Math.random() * 8}px`, `${10 + Math.random() * 20}px`, `${4 + Math.random() * 8}px`] }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isRecording ? '● Recording... Click to stop' : 'Click to start recording'}
          </p>

          {/* Show transcribed text */}
          {textInput && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-xl p-3 text-sm border"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent-primary)' }}>Transcript:</p>
              {textInput}
            </motion.div>
          )}

          {textInput && (
            <button onClick={handleSubmit} disabled={disabled} className="gradient-btn flex items-center gap-2 text-sm">
              <Send size={14} /> Submit Answer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
