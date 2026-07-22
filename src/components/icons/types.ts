/**
 * Shared prop contract for every icon in this set.
 *
 * Colour is inherited: every glyph paints with `currentColor`, so set the CSS
 * `color` property on an ancestor (or on the icon itself via `className`).
 */
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  /** Rendered width and height in pixels. Defaults to 24. */
  size?: number;
  /**
   * Accessible name. When provided the icon becomes `role="img"` with a
   * `<title>`; when omitted it is `aria-hidden` (decorative).
   */
  title?: string;
}
