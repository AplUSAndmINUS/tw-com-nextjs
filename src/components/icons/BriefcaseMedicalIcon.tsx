import type { IconProps } from './types';

export function BriefcaseMedicalIcon({ size = 24, className, style, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      style={style}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable='false'
      {...rest}
    >
      {title ? <title>{title}</title> : null}
        <path d='M5.5 7h13a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z' />
        <path d='M9 7V5.75A1.75 1.75 0 0 1 10.75 4h2.5A1.75 1.75 0 0 1 15 5.75V7' />
        <path d='M12 11.25v5' />
        <path d='M9.5 13.75h5' />
    </svg>
  );
}
