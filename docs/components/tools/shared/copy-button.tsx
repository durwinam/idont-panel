```tsx
'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

export function CopyButton({
  value,
  label = 'Copy',
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard unavailable (insecure context) — ignore.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : label}
      className={cn(
        [
          // ─────────────────────────────
          // Layout
          // ─────────────────────────────
          'group relative inline-flex items-center gap-1.5',
          'rounded-2xl px-3 py-1.5',
          'text-xs font-medium',
          'overflow-hidden',

          // ─────────────────────────────
          // iOS 26 Glass
          // ─────────────────────────────
          'border border-white/25',
          'bg-white/[0.16]',
          'supports-[backdrop-filter]:bg-white/[0.10]',
          'backdrop-blur-2xl',
          'backdrop-saturate-150',

          // Subtle inner highlight
          'before:pointer-events-none',
          'before:absolute',
          'before:inset-px',
          'before:rounded-[inherit]',
          'before:border',
          'before:border-white/20',
          'before:opacity-70',

          // Soft depth
          'shadow-[0_4px_18px_rgba(0,0,0,0.08)]',
          'shadow-inner',

          // ─────────────────────────────
          // Motion
          // ─────────────────────────────
          'transition-all duration-300',
          'ease-[cubic-bezier(0.22,1,0.36,1)]',

          // ─────────────────────────────
          // Hover
          // ─────────────────────────────
          'hover:-translate-y-px',
          'hover:scale-[1.015]',
          'hover:border-white/40',
          'hover:bg-white/[0.22]',
          'hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)]',

          // Cyan glass reflection
          'hover:before:border-cyan-300/20',

          // ─────────────────────────────
          // Active
          // ─────────────────────────────
          'active:translate-y-0',
          'active:scale-[0.97]',
          'active:duration-100',

          // ─────────────────────────────
          // Focus
          // ─────────────────────────────
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-cyan-400/40',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-transparent',

          // ─────────────────────────────
          // Light mode text
          // ─────────────────────────────
          'text-slate-700',
          'hover:text-cyan-600',

          // ─────────────────────────────
          // Dark mode glass
          // ─────────────────────────────
          'dark:border-white/[0.14]',
          'dark:bg-white/[0.07]',
          'dark:supports-[backdrop-filter]:bg-white/[0.055]',
          'dark:text-white/80',
          'dark:hover:border-white/25',
          'dark:hover:bg-white/[0.12]',
          'dark:hover:text-cyan-200',
          'dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)]',
        ].join(' '),

        // ─────────────────────────────
        // Copied state
        // ─────────────────────────────
        copied &&
          [
            'border-emerald-400/35',
            'bg-emerald-400/[0.12]',
            'text-emerald-600',
            'shadow-[0_6px_26px_rgba(16,185,129,0.14)]',

            'before:border-emerald-300/20',

            'dark:border-emerald-300/25',
            'dark:bg-emerald-400/[0.09]',
            'dark:text-emerald-300',
          ].join(' '),

        className,
      )}
    >
      {/* Glass reflection */}
      <span
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-x-3
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/60
          to-transparent
          opacity-70
        "
      />

      {copied ? (
        <Check
          className="
            relative
            size-3.5
            animate-in
            zoom-in-75
            duration-200
          "
          aria-hidden
        />
      ) : (
        <Copy
          className="
            relative
            size-3.5
            transition-transform
            duration-300
            ease-out
            group-hover:scale-110
          "
          aria-hidden
        />
      )}

      <span className="relative">
        {copied ? 'Copied' : label}
      </span>
    </button>
  );
}
```
