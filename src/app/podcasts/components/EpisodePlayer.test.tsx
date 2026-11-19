// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PodcastEpisode } from '@/content/types';
import {
  PodcastMiniPlayer,
  PodcastPlayerProvider,
} from '@/components/PodcastPlayer';
import { EpisodePlayer } from './EpisodePlayer';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const EPISODE: PodcastEpisode = {
  slug: 'the-quiet-rebuild--12345678',
  title: 'The Quiet Rebuild',
  description: '',
  audioUrl: 'https://example.test/quiet.mp3',
  publishedDate: '2026-10-04',
  tags: [],
};

let root: Root;
let container: HTMLDivElement;

/** The site's tree: the shared player, the mini-player, and maybe the page. */
function render(onEpisodePage: boolean) {
  act(() => {
    root.render(
      <PodcastPlayerProvider>
        {onEpisodePage ? <EpisodePlayer episode={EPISODE} /> : null}
        <PodcastMiniPlayer />
      </PodcastPlayerProvider>
    );
  });
}

const miniPlayer = () =>
  document.querySelector('[aria-label="Podcast mini player"]');

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
    this: HTMLMediaElement
  ) {
    // What the browser does once playback starts: fire `play` on the element.
    this.dispatchEvent(new Event('play'));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  // useIsMobile / useReducedMotion read media queries.
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    }))
  );

  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('EpisodePlayer and the mini-player', () => {
  it('hides the mini-player while the episode page player owns the episode, and hands back on leaving', () => {
    render(true);
    const play = container.querySelector('button')!;
    expect(play.getAttribute('aria-label')).toBe(
      'Play episode: The Quiet Rebuild'
    );

    act(() => play.click());

    // Playing, with the in-page controls showing: one set of controls only.
    expect(container.querySelector('audio')?.src).toBe(EPISODE.audioUrl);
    expect(container.querySelector('button')?.textContent).toBe('Pause');
    expect(miniPlayer()).toBe(null);

    // Leaving the episode page: the mini-player takes over, still playing.
    render(false);
    expect(miniPlayer()).not.toBe(null);
  });
});
