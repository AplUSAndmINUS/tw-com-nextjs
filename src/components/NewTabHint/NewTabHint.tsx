/**
 * Tells screen-reader users a link opens a new tab (it is visually hidden).
 * TwButton and ThemedLink add it themselves for target="_blank"; plain <a>
 * links that open a new tab render it after their text.
 */
const hidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

export function NewTabHint() {
  return <span style={hidden}> (opens in a new tab)</span>;
}

export default NewTabHint;
