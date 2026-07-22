'use client';

import styles from './TwSwitch.module.scss';

/**
 * Accessible on/off toggle.
 *
 * The label lives *inside* the button rather than beside it. A <label
 * htmlFor> does not associate with a <button role="switch"> — only with real
 * form controls — so pairing them externally would need aria-labelledby and
 * would still leave the text unclickable. Putting it inside gives the switch
 * its accessible name and makes the whole row a hit target for free.
 *
 * Replaces three hand-rolled copies previously inlined in SettingsPanel. Track
 * and knob geometry match those (44x24 track, 18px knob, 3px inset) so nothing
 * shifts when they are swapped over.
 */

export interface TwSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
  disabled?: boolean;
  /**
   * Keeps the label as the accessible name but hides it visually — for rows
   * that already print the label in their own left column.
   */
  hideLabel?: boolean;
  /** Supporting text under the label. */
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TwSwitch({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  hideLabel = false,
  description,
  className,
  style,
}: TwSwitchProps) {
  const classes = [
    styles.switch,
    hideLabel ? styles.bare : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      id={id}
      type='button'
      role='switch'
      aria-checked={checked}
      disabled={disabled}
      className={classes}
      style={style}
      onClick={() => onChange(!checked)}
    >
      <span className={hideLabel ? styles.hiddenLabel : styles.text}>
        <span className={styles.label}>{label}</span>
        {description && !hideLabel ? (
          <span className={styles.description}>{description}</span>
        ) : null}
      </span>

      <span className={styles.track} aria-hidden='true'>
        <span className={styles.knob} />
      </span>
    </button>
  );
}

export default TwSwitch;
