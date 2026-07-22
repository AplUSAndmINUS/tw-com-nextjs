import type { IconProps } from './types';

export function CodeIcon({ size = 24, className, style, title, filled = false, ...rest }: IconProps & { filled?: boolean }) {
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
          <path d='M9.28 6.72a1.1 1.1 0 0 1 0 1.56L5.56 12l3.72 3.72a1.1 1.1 0 1 1-1.56 1.56l-4.5-4.5a1.1 1.1 0 0 1 0-1.56l4.5-4.5a1.1 1.1 0 0 1 1.56 0Z' />
          <path d='M14.72 6.72a1.1 1.1 0 0 1 1.56 0l4.5 4.5a1.1 1.1 0 0 1 0 1.56l-4.5 4.5a1.1 1.1 0 1 1-1.56-1.56L18.44 12l-3.72-3.72a1.1 1.1 0 0 1 0-1.56Z' />
          <path d='M12.32 4.05a1.1 1.1 0 0 1 2.16.4l-2.8 15.5a1.1 1.1 0 0 1-2.16-.4l2.8-15.5Z' />
        </>
      ) : (
        <>
          <path d='M8.5 7.5 4 12l4.5 4.5' />
          <path d='M15.5 7.5 20 12l-4.5 4.5' />
          <path d='M13.4 4.25 10.6 19.75' />
        </>
      )}
    </svg>
  );
}
