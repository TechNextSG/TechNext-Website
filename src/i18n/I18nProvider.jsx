import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DICT, LANGS, translate } from './dict'

const STORAGE_KEY = 'tn_lang'
const DEFAULT_LANG = 'en'

const I18nContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (k) => k,
})

export function I18nProvider({ children }) {
  // SSR-safe: always start with EN, hydrate from localStorage on mount.
  const [lang, setLangState] = useState(DEFAULT_LANG)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && DICT && Object.values(LANGS).some((l) => l.code === saved)) {
        setLangState(saved)
      }
    } catch {
      // localStorage might be blocked — silently fall back to EN
    }
  }, [])

  const setLang = useCallback((next) => {
    setLangState(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    // Update <html lang="..."> so screen readers / search engines pick it up
    if (typeof document !== 'undefined') {
      const htmlLang = next === 'vn' ? 'vi' : next === 'ph' ? 'tl' : next
      document.documentElement.setAttribute('lang', htmlLang)
    }
  }, [])

  const t = useCallback((key, vars) => {
    let s = translate(key, lang)
    if (vars && typeof s === 'string') {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v))
      }
    }
    return s
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export function useT() {
  return useContext(I18nContext).t
}

export function LangSwitcher({ className = '' }) {
  const { lang, setLang } = useI18n()
  return (
    <div className={`lang-switcher ${className}`} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`lang-btn ${lang === l.code ? 'active' : ''}`}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          aria-label={l.name}
        >
          {l.label}
        </button>
      ))}
      <style>{`
        .lang-switcher {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 3px;
          background: rgba(255,255,255,0.55);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
        }
        .lang-btn {
          padding: 4px 9px;
          background: transparent;
          border: none;
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-muted);
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: all var(--transition-fast);
          line-height: 1;
        }
        .lang-btn:hover { color: var(--color-text-primary); }
        .lang-btn.active {
          background: var(--color-accent);
          color: #fff;
        }
      `}</style>
    </div>
  )
}
