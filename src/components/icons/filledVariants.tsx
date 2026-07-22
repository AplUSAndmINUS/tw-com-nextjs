/**
 * Pre-filled wrappers.
 *
 * The legacy Fluent names ending in `Filled` arrive as plain strings at
 * runtime (via ICON_MAP), so those call sites cannot pass `filled`. These thin
 * wrappers bind it for them. Prefer `<CodeIcon filled />` in new code.
 */
import type { IconProps } from './types';
import { CodeIcon } from './CodeIcon';
import { DesignIdeasIcon } from './DesignIdeasIcon';
import { HeartIcon } from './HeartIcon';
import { PlayIcon } from './PlayIcon';

export function CodeFilledIcon(props: IconProps) {
  return <CodeIcon filled {...props} />;
}

export function DesignIdeasFilledIcon(props: IconProps) {
  return <DesignIdeasIcon filled {...props} />;
}

export function HeartFilledIcon(props: IconProps) {
  return <HeartIcon filled {...props} />;
}

export function PlayFilledIcon(props: IconProps) {
  return <PlayIcon filled {...props} />;
}
