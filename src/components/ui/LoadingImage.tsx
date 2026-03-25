'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { Spinner } from '@fluentui/react-components';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

type ImageLoadState = 'loading' | 'loaded' | 'error';

interface LoadingImageSharedProps {
  fadeDurationMs?: number;
  spinnerSize?:
    | 'tiny'
    | 'extra-small'
    | 'small'
    | 'medium'
    | 'large'
    | 'extra-large'
    | 'huge';
  spinnerLabel?: string;
  overlayStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  wrapperClassName?: string;
}

type LoadingImageProps = LoadingImageSharedProps &
  Omit<ImageProps, 'onLoad' | 'onError'> & {
    onLoad?: React.ReactEventHandler<HTMLImageElement>;
    onError?: React.ReactEventHandler<HTMLImageElement>;
  };

type NativeLoadingImageProps = LoadingImageSharedProps &
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'>;

function appendOpacityTransition(
  transition: React.CSSProperties['transition'],
  fadeDurationMs: number
) {
  const opacityTransition = `opacity ${fadeDurationMs}ms ease-out`;

  if (!transition) {
    return opacityTransition;
  }

  return `${transition}, ${opacityTransition}`;
}

function useImageLoadState(src: string | ImageProps['src']) {
  const [loadState, setLoadState] = React.useState<ImageLoadState>('loading');

  React.useEffect(() => {
    setLoadState('loading');
  }, [src]);

  return {
    loadState,
    markLoaded: () => setLoadState('loaded'),
    markError: () => setLoadState('error'),
  };
}

function LoadingOverlay({
  isVisible,
  overlayStyle,
  spinnerSize,
  spinnerLabel,
}: {
  isVisible: boolean;
  overlayStyle?: React.CSSProperties;
  spinnerSize: NonNullable<LoadingImageSharedProps['spinnerSize']>;
  spinnerLabel: string;
}) {
  const { theme } = useAppTheme();

  return (
    <span
      aria-hidden='true'
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 120ms ease-out',
        backgroundColor: theme.semanticColors.background.base,
        zIndex: 1,
        ...overlayStyle,
      }}
    >
      <span role='status' aria-label={spinnerLabel}>
        <Spinner size={spinnerSize} />
      </span>
    </span>
  );
}

export function LoadingImage({
  fadeDurationMs = 180,
  spinnerSize = 'small',
  spinnerLabel = 'Loading image',
  overlayStyle,
  wrapperStyle,
  wrapperClassName,
  style,
  onLoad,
  onError,
  src,
  fill,
  ...imageProps
}: LoadingImageProps) {
  const { loadState, markLoaded, markError } = useImageLoadState(src);

  return (
    <span
      className={wrapperClassName}
      style={{
        position: 'relative',
        display: 'block',
        width: fill ? '100%' : undefined,
        height: fill ? '100%' : undefined,
        ...wrapperStyle,
      }}
    >
      <LoadingOverlay
        isVisible={loadState === 'loading'}
        overlayStyle={overlayStyle}
        spinnerSize={spinnerSize}
        spinnerLabel={spinnerLabel}
      />
      <Image
        {...imageProps}
        src={src}
        fill={fill}
        onLoad={(event) => {
          markLoaded();
          onLoad?.(event);
        }}
        onError={(event) => {
          markError();
          onError?.(event);
        }}
        style={{
          ...style,
          opacity: loadState === 'loaded' ? 1 : 0,
          transition: appendOpacityTransition(
            style?.transition,
            fadeDurationMs
          ),
        }}
      />
    </span>
  );
}

export function NativeLoadingImage({
  fadeDurationMs = 180,
  spinnerSize = 'small',
  spinnerLabel = 'Loading image',
  overlayStyle,
  wrapperStyle,
  wrapperClassName,
  style,
  onLoad,
  onError,
  src,
  ...imageProps
}: NativeLoadingImageProps) {
  const resolvedSrc = typeof src === 'string' ? src : '';
  const { loadState, markLoaded, markError } = useImageLoadState(resolvedSrc);

  return (
    <span
      className={wrapperClassName}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: '100%',
        ...wrapperStyle,
      }}
    >
      <LoadingOverlay
        isVisible={loadState === 'loading'}
        overlayStyle={overlayStyle}
        spinnerSize={spinnerSize}
        spinnerLabel={spinnerLabel}
      />
      <img
        {...imageProps}
        src={resolvedSrc}
        onLoad={(event) => {
          markLoaded();
          onLoad?.(event);
        }}
        onError={(event) => {
          markError();
          onError?.(event);
        }}
        style={{
          ...style,
          opacity: loadState === 'loaded' ? 1 : 0,
          transition: appendOpacityTransition(
            style?.transition,
            fadeDurationMs
          ),
        }}
      />
    </span>
  );
}
