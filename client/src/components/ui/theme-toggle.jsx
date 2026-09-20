import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', style = {} }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`nearnest-theme-toggle ${className}`}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-pressed={!isDark}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={style}
    >
      {/* Background tracks with subtle ambient icons */}
      <span className="toggle-track-icon toggle-track-moon" aria-hidden="true">
        <Moon size={14} />
      </span>
      <span className="toggle-track-icon toggle-track-sun" aria-hidden="true">
        <Sun size={14} />
      </span>

      {/* Sliding Thumb Handle */}
      <span className={`toggle-thumb ${isDark ? 'is-dark' : 'is-light'}`} aria-hidden="true">
        {isDark ? (
          <Moon size={14} className="thumb-icon moon" />
        ) : (
          <Sun size={14} className="thumb-icon sun" />
        )}
      </span>

      <style>{`
        .nearnest-theme-toggle {
          position: relative;
          width: 64px;
          height: 32px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          padding: 3px 6px;
          border: 1px solid var(--border-glass-bright, rgba(255, 255, 255, 0.15));
          background: var(--bg-card, rgba(19, 27, 46, 0.8));
          cursor: pointer;
          transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(0, 0, 0, 0.2);
          user-select: none;
          flex-shrink: 0;
        }

        .nearnest-theme-toggle:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .nearnest-theme-toggle:hover {
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 0 16px rgba(79, 70, 229, 0.25), inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Ambient track icons */
        .toggle-track-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: var(--text-muted, #94a3b8);
          opacity: 0.65;
          pointer-events: none;
          transition: opacity 0.25s ease, color 0.25s ease;
        }

        /* Sliding Thumb */
        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toggle-thumb.is-dark {
          transform: translateX(0);
          color: #ffffff;
        }

        .toggle-thumb.is-light {
          transform: translateX(32px);
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.45);
        }

        .thumb-icon {
          display: block;
          transition: transform 0.3s ease, opacity 0.25s ease;
        }

        .thumb-icon.moon {
          transform: rotate(0deg);
        }

        .thumb-icon.sun {
          transform: rotate(0deg);
        }

        /* Light mode specific toggle appearance */
        [data-theme='light'] .nearnest-theme-toggle {
          background: #e2e8f0;
          border-color: #cbd5e1;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.06);
        }

        [data-theme='light'] .nearnest-theme-toggle:hover {
          border-color: #94a3b8;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
        }

        [data-theme='light'] .toggle-track-icon {
          color: #64748b;
        }

        @media (prefers-reduced-motion: reduce) {
          .nearnest-theme-toggle,
          .toggle-thumb,
          .toggle-track-icon,
          .thumb-icon {
            transition: none !important;
          }
        }
      `}</style>
    </button>
  );
}
