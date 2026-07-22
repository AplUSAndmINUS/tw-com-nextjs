import type { IconProps } from './types';

export function HeartIcon({ size = 24, className, style, title, filled = false, ...rest }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : 1.5}
      strokeLinecap={filled ? undefined : 'round'}
      strokeLinejoin={filled ? undefined : 'round'}
      className={className}
      style={style}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable='false'
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {filled ? (
        <>
          <path d='M12 20.6S3 15.45 3 9.75A5.25 5.25 0 0 1 12 6.05a5.25 5.25 0 0 1 9 3.7c0 5.7-9 10.85-9 10.85Z' />
        </>
      ) : (
        <>
          <path d='M12 20.25S3.5 15.35 3.5 9.9A4.9 4.9 0 0 1 12 6.55 4.9 4.9 0 0 1 20.5 9.9c0 5.45-8.5 10.35-8.5 10.35Z' />
        </>
      )}
    </svg>
  );
}
