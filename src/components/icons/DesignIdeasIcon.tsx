import type { IconProps } from './types';

export function DesignIdeasIcon({ size = 24, className, style, title, filled = false, ...rest }: IconProps & { filled?: boolean }) {
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
          <path d='M12 2.75a6.75 6.75 0 0 0-3.95 12.22c.4.29.7.75.7 1.28v.5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1v-.5c0-.53.3-.99.7-1.28A6.75 6.75 0 0 0 12 2.75Z' />
          <path d='M9.75 18.9h4.5a1.05 1.05 0 0 1 0 2.1h-4.5a1.05 1.05 0 0 1 0-2.1Z' />
        </>
      ) : (
        <>
          <path d='M12 3.25a6.25 6.25 0 0 0-3.6 11.35c.5.36.85.94.85 1.55v.6h5.5v-.6c0-.61.35-1.19.85-1.55A6.25 6.25 0 0 0 12 3.25Z' />
          <path d='M9.75 19.75h4.5' />
        </>
      )}
    </svg>
  );
}
