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

function useImageLoadState(src: string | ImageProps['src'] | undefined) {
  const [loadState, setLoadState] = React.useState<ImageLoadState>('loading');

  const markLoaded = React.useCallback(() => {
    setLoadState('loaded');
  }, []);

  const markError = React.useCallback(() => {
    setLoadState('error');
  }, []);

  React.useEffect(() => {
    if (!src) {
      setLoadState('error');
      return;
    }

    setLoadState('loading');
  }, [src]);

  return {
    loadState,
    markLoaded,
    markError,
  };
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(value);
        return;
      }

      ref.current = value;
    });
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
      {isVisible ? (
        <span role='status' aria-label={spinnerLabel}>
          <Spinner size={spinnerSize} />
        </span>
      ) : null}
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
  const internalImageRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const imageElement = internalImageRef.current;

    if (!imageElement || !imageElement.complete) {
      return;
    }

    if (imageElement.naturalWidth > 0) {
      markLoaded();
      return;
    }

    markError();
  }, [src, markLoaded, markError]);

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
        ref={mergeRefs(internalImageRef)}
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
          opacity: loadState === 'loading' ? 0 : 1,
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
  const resolvedSrc =
    typeof src === 'string' && src.trim().length > 0 ? src : undefined;
  const { loadState, markLoaded, markError } = useImageLoadState(resolvedSrc);
  const internalImageRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const imageElement = internalImageRef.current;

    if (!imageElement || !imageElement.complete) {
      return;
    }

    if (imageElement.naturalWidth > 0) {
      markLoaded();
      return;
    }

    markError();
  }, [resolvedSrc, markLoaded, markError]);

  if (!resolvedSrc) {
    return null;
  }

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
        ref={mergeRefs(internalImageRef)}
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
          opacity: loadState === 'loading' ? 0 : 1,
          transition: appendOpacityTransition(
            style?.transition,
            fadeDurationMs
          ),
        }}
      />
    </span>
  );
}
