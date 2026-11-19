import {
  DARK_FAMILY_MODES,
  DEFAULT_THEME_MODE,
  THEME_MODES,
  THEME_STORAGE_KEY,
} from './modes';
import { FONT_SCALE_MAX, FONT_SCALE_MIN } from './fontScale';

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
  // The text-size preference (root font-size, 80%–150%) is applied here too,
  // so a visitor at 150% never sees the page at 100% first. FontScaleProvider
  // takes over once the preferences store has hydrated.
  //
  // The in-app reduced-motion toggle is stamped here too. useAppTheme only sets
  // data-tw-reduced-motion after hydration, by which point the first-paint
  // page fade (.tw-route[data-route-init] in styles/tokens/effects.css) has
  // already started. The OS preference needs nothing here: the
  // prefers-reduced-motion rules already override that fade.
  //
  // (2026-11) The homepage used to be forced dark here, mirroring a
  // forced-dark effect in HomePageClient. That effect is gone and Home now
  // supports light mode, so the override only caused a dark-to-light flash
  // for light-mode visitors. Removed.
  return `(function(){try{
var MODES=${modes},DARK=${darkModes},m=${JSON.stringify(DEFAULT_THEME_MODE)},rm=false,fs=1;
try{var raw=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(raw){var s=JSON.parse(raw);var t=s&&s.state&&s.state.preferences&&s.state.preferences.themeMode;
if(MODES.indexOf(t)!==-1){m=t;}
rm=!!(s&&s.state&&s.state.preferences&&s.state.preferences.reducedMotion===true);
fs=s&&s.state&&s.state.preferences&&s.state.preferences.fontScale;}}catch(e){}
var d=document.documentElement,isDark=DARK.indexOf(m)!==-1;
d.setAttribute('data-theme',m);
d.style.colorScheme=isDark?'dark':'light';
d.classList[isDark?'add':'remove']('dark');
if(rm){d.setAttribute('data-tw-reduced-motion','true');}
if(typeof fs==='number'&&isFinite(fs)&&fs!==1){d.style.fontSize=(16*Math.min(${FONT_SCALE_MAX},Math.max(${FONT_SCALE_MIN},fs)))+'px';}
}catch(e){}})();`;
}
