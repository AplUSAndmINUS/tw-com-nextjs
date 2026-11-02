import { describe, expect, it } from 'vitest';
import { withoutBrandSuffix } from './metadata';

describe('withoutBrandSuffix', () => {
  it('drops a trailing brand so the title template does not repeat it', () => {
    expect(
      withoutBrandSuffix(
        'Building a Book the Way I Build Systems | Terence Waters'
      )
    ).toBe('Building a Book the Way I Build Systems');
  });

  it('leaves titles without the suffix alone', () => {
    expect(withoutBrandSuffix('The Pathless Path Is Mine | Living')).toBe(
      'The Pathless Path Is Mine | Living'
    );
  });

  it('only strips the brand at the end of the title', () => {
    expect(withoutBrandSuffix('Terence Waters | Notes')).toBe(
      'Terence Waters | Notes'
    );
  });
});
