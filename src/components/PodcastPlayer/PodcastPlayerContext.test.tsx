// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PodcastEpisode } from '@/content/types';
import {
  PodcastPlayerProvider,
  usePodcastPlayer,
  type PodcastPlayerContextValue,
} from './PodcastPlayerContext';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const episode = (n: number): PodcastEpisode => ({
  slug: `episode-${n}`,
  title: `Episode ${n}`,
  description: '',
  audioUrl: `https://example.test/ep${n}.mp3`,
  publishedDate: '2026-10-01',
  tags: [],
});

let api: PodcastPlayerContextValue;
function Capture() {
  api = usePodcastPlayer();
  return null;
}

/** The src the element had each time play() was called. */
let playedSrcs: string[];
let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  playedSrcs = [];
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
    this: HTMLMediaElement
  ) {
    playedSrcs.push(this.src);
    return Promise.resolve();
  });
  // jsdom does not implement media playback.
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});

  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <PodcastPlayerProvider>
        <Capture />
      </PodcastPlayerProvider>
    );
  });
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

const audio = () => container.querySelector('audio')!;

describe('PodcastPlayerContext play()', () => {
  it('starts a cold episode once, after its src is on the element', () => {
    const ep = episode(1);
    act(() => api.play(ep));

    expect(playedSrcs).toEqual([ep.audioUrl]);
    expect(audio().src).toBe(ep.audioUrl);
    expect(api.episode).toBe(ep);
  });

  it('resumes the loaded episode without reloading it', () => {
    const ep = episode(1);
    act(() => api.play(ep));
    const loadSpy = vi.mocked(HTMLMediaElement.prototype.load);
    loadSpy.mockClear();

    act(() => api.play(ep));

    expect(playedSrcs).toEqual([ep.audioUrl, ep.audioUrl]);
    expect(api.episode).toBe(ep);
    expect(audio().src).toBe(ep.audioUrl);
    expect(loadSpy).not.toHaveBeenCalled();
  });

  it('switches to another episode and plays it from its own src', () => {
    act(() => api.play(episode(1)));
    act(() => api.play(episode(2)));

    expect(playedSrcs).toEqual([episode(1).audioUrl, episode(2).audioUrl]);
    expect(api.episode?.slug).toBe('episode-2');
  });

  it('close() clears a pending autoplay', () => {
    act(() => {
      api.play(episode(1));
      api.close();
    });

    expect(playedSrcs).toEqual([]);
    expect(api.episode).toBe(null);
    expect(audio().hasAttribute('src')).toBe(false);
  });

  it('ignores an episode with no audio', () => {
    act(() => api.play({ ...episode(1), audioUrl: '' }));
    expect(playedSrcs).toEqual([]);
    expect(api.episode).toBe(null);
  });
});
