import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { TwRipple } from './TwRipple';
import { TwWave } from '../TwWave';

const render = (el: React.ReactElement) =>
  new JSDOM(renderToStaticMarkup(el)).window.document;

describe('TwRipple', () => {
  it('draws rings around a centre point, hidden from assistive tech', () => {
    const svg = render(<TwRipple rings={4} />).querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelectorAll('circle')).toHaveLength(5);
  });
});

describe('TwWave', () => {
  it('draws one waveform line, hidden from assistive tech', () => {
    const svg = render(<TwWave />).querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelectorAll('polyline')).toHaveLength(1);
  });

  it('starts and ends quietly (amplitude envelope)', () => {
    const pts = render(<TwWave />)
      .querySelector('polyline')!
      .getAttribute('points')!
      .split(' ')
      .map((p) => Number(p.split(',')[1]));
    expect(Math.abs(pts[0] - 20)).toBeLessThan(0.5);
    expect(Math.abs(pts[pts.length - 1] - 20)).toBeLessThan(0.5);
    expect(Math.max(...pts) - Math.min(...pts)).toBeGreaterThan(10);
  });
});
