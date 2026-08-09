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
          // Layout
          'inline-flex items-center gap-1.5',
          'rounded-xl px-3 py-1.5',
          'text-xs font-medium',

          // Glass
          'border border-white/20',
          'bg-white/10',
          'backdrop-blur-xl',
          'supports-[backdrop-filter]:bg-white/[0.08]',

          // Shadow
          'shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
          'shadow-inner',

          // Transition
          'transition-all duration-200 ease-out',

          // Hover
          'hover:-translate-y-0.5',
          'hover:border-cyan-400/40',
          'hover:bg-cyan-400/10',
          'hover:text-cyan-500',
          'hover:shadow-[0_6px_24px_rgba(0,200,220,0.18)]',

          // Active
          'active:translate-y-0',
          'active:scale-95',

          // Focus
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-cyan-400/50',

          // Dark mode
          'dark:border-white/10',
          'dark:bg-white/[0.05]',
          'dark:hover:bg-cyan-400/10',
          'dark:hover:text-cyan-300',
        ].join(' '),
        copied &&
          [
            'border-emerald-400/40',
            'bg-emerald-400/10',
            'text-emerald-500',
            'shadow-[0_6px_24px_rgba(16,185,129,0.15)]',
            'dark:text-emerald-300',
          ].join(' '),
        className,
      )}
    >
      {copied ? (
        <Check
          className="size-3.5 animate-in zoom-in"
          aria-hidden
        />
      ) : (
        <Copy
          className="size-3.5 transition-transform duration-200 group-hover:scale-110"
          aria-hidden
        />
      )}

      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}
