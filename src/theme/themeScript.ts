import {
  DARK_FAMILY_MODES,
  DEFAULT_THEME_MODE,
  THEME_MODES,
  THEME_STORAGE_KEY,
} from './modes';

/**
 * Pre-hydration theme script
 * ==========================
 *
 * The site is a static export, so the served HTML carries no theme. Without
 * this, the page paints with the default theme and then flips once React
 * hydrates and reads the persisted preference — a visible flash on every load.
 *
 * This runs synchronously in <head>, before <body> exists, and stamps the
 * resolved mode onto <html>:
 *
 *   data-theme            selects the token block in styles/tokens/colors.css
 *   class="dark"          drives Tailwind's `dark:` variant
 *   style.color-scheme    makes native scrollbars, form controls and <select>
 *                         dropdowns match — this is what actually prevents the
 *                         white flash, which the old
 *                         `background-color: #0f1419 !important` hack on body
 *                         could not reach.
 *
 * Generated from the shared constants in ./modes rather than hand-written, so
 * the validation list cannot drift from the TypeScript union or the CSS.
 */
export function buildThemeScript(): string {
  const modes = JSON.stringify(THEME_MODES);
  const darkModes = JSON.stringify(DARK_FAMILY_MODES);

  // Read defensively: localStorage throws in some privacy modes, and the stored
  // JSON is user-writable. Any problem falls back to the default mode.
  //
  // The pathname check mirrors the forced-dark effect in HomePageClient, which
  // sets dark on mount regardless of preference. Without it, a light-mode
  // visitor landing on the homepage would get a light-to-dark flash caused by
  // this very script. Remove both together when the homepage is rebuilt on the
  // design system and light mode becomes viable there.
  return `(function(){try{
var MODES=${modes},DARK=${darkModes},m=${JSON.stringify(DEFAULT_THEME_MODE)};
try{var raw=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(raw){var s=JSON.parse(raw);var t=s&&s.state&&s.state.preferences&&s.state.preferences.themeMode;
if(MODES.indexOf(t)!==-1){m=t;}}}catch(e){}
var p=location.pathname;if(p==='/'||p===''){m='dark';}
var d=document.documentElement,isDark=DARK.indexOf(m)!==-1;
d.setAttribute('data-theme',m);
d.style.colorScheme=isDark?'dark':'light';
d.classList[isDark?'add':'remove']('dark');
}catch(e){}})();`;
}
