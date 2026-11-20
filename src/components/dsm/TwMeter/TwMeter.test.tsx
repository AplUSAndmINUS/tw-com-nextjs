import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { TwMeter, TwMeterGroup } from './TwMeter';

const render = (el: React.ReactElement) =>
  new JSDOM(renderToStaticMarkup(el)).window.document;

describe('TwMeter', () => {
  it('is an accessible meter with a spoken label', () => {
    const doc = render(<TwMeter label='Systems architecture' value={95} />);
    const meter = doc.querySelector('[role="meter"]')!;
    expect(meter.getAttribute('aria-valuenow')).toBe('95');
    expect(meter.getAttribute('aria-valuemax')).toBe('100');
    expect(meter.getAttribute('aria-label')).toBe(
      'Systems architecture: 95 out of 100'
    );
  });

  it('clamps the score to 0–max', () => {
    const doc = render(<TwMeter label='x' value={140} />);
    expect(
      doc.querySelector('[role="meter"]')!.getAttribute('aria-valuenow')
    ).toBe('100');
  });

  it('draws the fill from a CSS variable, not a width in px', () => {
    const doc = render(<TwMeter label='x' value={50} />);
    const fill = doc.querySelector('[role="meter"] span') as HTMLElement;
    expect(fill.getAttribute('style')).toContain('--tw-meter-pct:0.5');
  });
});

describe('TwMeterGroup', () => {
  it('lists meters and shows the caption (e.g. "self-rated")', () => {
    const doc = render(
      <TwMeterGroup caption='Self-rated, out of 100.'>
        <TwMeter label='a' value={1} />
        <TwMeter label='b' value={2} />
      </TwMeterGroup>
    );
    expect(doc.querySelectorAll('li [role="meter"]')).toHaveLength(2);
    expect(doc.querySelector('figcaption')?.textContent).toBe(
      'Self-rated, out of 100.'
    );
  });
});
