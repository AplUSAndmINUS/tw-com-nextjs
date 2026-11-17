import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { StepContactSchedule } from './StepContactSchedule';
import { StepThreeData } from './types';

const noop = () => {};

function renderStep() {
  const html = renderToStaticMarkup(
    <StepContactSchedule
      data={{} as StepThreeData}
      onChange={noop}
      onBack={noop}
      onSchedule={noop}
      status='idle'
    />
  );
  return new JSDOM(html).window.document;
}

describe('StepContactSchedule consent', () => {
  it('links the Privacy Policy to fluxline.pro, where it lives', () => {
    // Regression: the link was the relative /legal/privacy-policy, which is a
    // 404 on terencewaters.com (the site has no /legal pages).
    const link = renderStep().querySelector(
      'a[aria-label="Privacy Policy (opens in new window)"]'
    );
    expect(link?.getAttribute('href')).toBe(
      'https://www.fluxline.pro/legal/privacy-policy/'
    );
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
