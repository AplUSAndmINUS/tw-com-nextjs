import { afterEach, describe, expect, it, vi } from 'vitest';
import { decodeEntities, fetchSpreakerEpisodes, htmlToText } from './spreaker';

describe('decodeEntities', () => {
  it('decodes named and numeric entities, &amp; last so nothing decodes twice', () => {
    expect(decodeEntities('Boundaries &amp; Avoidance')).toBe(
      'Boundaries & Avoidance'
    );
    expect(decodeEntities('You&#39;re &#x2019;here&#x2019; &lt;3')).toBe(
      "You're ’here’ <3"
    );
    expect(decodeEntities('&amp;lt;')).toBe('&lt;');
    // Out of range: left as written rather than throwing.
    expect(decodeEntities('&#99999999;')).toBe('&#99999999;');
  });
});

describe('htmlToText', () => {
  it('keeps paragraphs, line breaks and list items apart', () => {
    const html =
      'Recognize speech.<br /><br />What listeners hear.<br /><ul><li>Cognitive</li><li>Emotional</li></ul>The point.';
    expect(htmlToText(html)).toBe(
      'Recognize speech.\nWhat listeners hear.\n• Cognitive\n• Emotional\nThe point.'
    );
  });

  it('drops links but keeps their text, and decodes entities', () => {
    expect(
      htmlToText('See <a href="https://x.test">[x.test]</a> &amp; more')
    ).toBe('See [x.test] & more');
  });
});

describe('fetchSpreakerEpisodes', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('slugs from the raw title (URLs unchanged) but shows the decoded one', async () => {
    const xml = `<rss><channel><title>The Resonant Identity</title>
      <item><title>016- Boundaries &amp; Avoidance</title>
      <link>https://www.spreaker.com/episode/boundaries--74645565</link>
      <guid isPermaLink="false">https://api.spreaker.com/episode/74645565</guid>
      <description><![CDATA[First.<br /><br />Second.]]></description>
      <pubDate>Mon, 24 Aug 2026 10:00:00 +0000</pubDate>
      <enclosure url="https://example.test/16.mp3" type="audio/mpeg" />
      </item></channel></rss>`;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(xml, { status: 200 }))
    );

    const feed = await fetchSpreakerEpisodes();
    expect(feed.available).toBe(true);
    const [episode] = feed.episodes;
    expect(episode.slug).toBe('016-boundaries-amp-avoidance--74645565');
    expect(episode.title).toBe('016- Boundaries & Avoidance');
    expect(episode.description).toBe('First.\nSecond.');
    expect(episode.audioUrl).toBe('https://example.test/16.mp3');
  });
});
