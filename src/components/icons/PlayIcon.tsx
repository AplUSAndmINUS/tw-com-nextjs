import type { IconProps } from './types';

export function PlayIcon({ size = 24, className, style, title, filled = false, ...rest }: IconProps & { filled?: boolean }) {
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
          <path d='M7.5 5.35a1.3 1.3 0 0 1 2-1.08l9.85 6.65a1.3 1.3 0 0 1 0 2.16L9.5 19.73a1.3 1.3 0 0 1-2-1.08V5.35Z' />
        </>
      ) : (
        <>
          <path d='M7.75 5.6a.9.9 0 0 1 1.37-.77l9.6 6.4a.9.9 0 0 1 0 1.54l-9.6 6.4a.9.9 0 0 1-1.37-.77V5.6Z' />
        </>
      )}
    </svg>
  );
}
