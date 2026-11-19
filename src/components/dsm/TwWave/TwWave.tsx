import styles from './TwWave.module.scss';

export interface TwWaveProps {
  className?: string;
}

/**
 * A sound wave as a divider (CREATIVE_BRIEF.md §5.3: "waveforms, ripples,
 * rhythm … subtle, never literal"). The amplitude builds and settles like a
 * melodic phrase. Decorative only (aria-hidden); static, so nothing moves.
 */
export function TwWave({ className }: TwWaveProps) {
  // A phrase: quiet, swelling, peaking, then settling.
  const points: string[] = [];
  const width = 600;
  for (let x = 0; x <= width; x += 4) {
    const t = x / width;
    const envelope = Math.sin(Math.PI * t) ** 1.6;
    const y =
      20 + Math.sin(x / 9) * 16 * envelope * (0.55 + 0.45 * Math.sin(x / 41));
    points.push(`${x},${y.toFixed(2)}`);
  }
  return (
    <svg
      className={[styles.wave, className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} 40`}
      preserveAspectRatio='none'
      aria-hidden='true'
      focusable='false'
    >
      <polyline points={points.join(' ')} className={styles.line} />
    </svg>
  );
}

export default TwWave;
