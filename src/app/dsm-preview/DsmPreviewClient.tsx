'use client';

import React, { useState } from 'react';
import {
  TwArticleCard,
  TwButton,
  TwCTABand,
  TwCallout,
  TwCard,
  TwChip,
  TwContainer,
  TwContentGrid,
  TwFeaturedCard,
  TwFilterChips,
  TwGrid,
  TwRailLayout,
  TwSectionHeading,
  TwSelect,
  TwStatCard,
  TwSwitch,
} from '@/components/dsm';
import * as Icons from '@/components/icons';
import { THEME_MODES, type ThemeMode } from '@/theme/modes';
import styles from './DsmPreviewClient.module.scss';

const ICON_ENTRIES = Object.entries(Icons)
  .filter(
    ([name, value]) => name.endsWith('Icon') && typeof value === 'function'
  )
  .sort(([a], [b]) => a.localeCompare(b)) as [
  string,
  React.ComponentType<{ size?: number }>,
][];

const SAMPLE = [
  {
    title: 'Writing Resonance Core',
    excerpt:
      'Notes from writing my first book, and why architecture beats motivation.',
    category: 'Writing',
    date: '2026.02.15',
  },
  {
    title: 'The Resonant Identity, Ep. 12',
    excerpt: 'On rebuilding your internal systems after a major life shift.',
    category: 'Podcast',
    date: '2026.02.02',
  },
  {
    title: 'MyHealth+ Patient Portal',
    excerpt: 'Enterprise healthcare portal UX overhaul.',
    category: 'Case Study',
    date: '2025',
  },
];

/**
 * Design system preview.
 *
 * Exists to verify the token layer, the theme modes and every component in one
 * place — this is the surface the migration is checked against. It is excluded
 * from the sitemap and noindexed; it is a development tool, not a page.
 *
 * The mode switcher writes `data-theme` directly rather than going through the
 * preferences store, so previewing a mode does not overwrite the visitor's
 * saved preference.
 */
export default function DsmPreviewClient() {
  const [mode, setMode] = useState<ThemeMode | 'current'>('current');
  const [filter, setFilter] = useState<string | null>(null);
  const [switchOn, setSwitchOn] = useState(true);
  const [select, setSelect] = useState('a');

  const applyMode = (next: ThemeMode | 'current') => {
    setMode(next);
    const root = document.documentElement;
    if (next === 'current') {
      root.removeAttribute('data-tw-preview-theme');
    } else {
      root.setAttribute('data-theme', next);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>Theme</span>
        {(['current', ...THEME_MODES] as const).map((m) => (
          <button
            key={m}
            type='button'
            onClick={() => applyMode(m)}
            className={[styles.modeBtn, mode === m ? styles.modeBtnOn : '']
              .filter(Boolean)
              .join(' ')}
          >
            {m}
          </button>
        ))}
      </div>

      <TwContainer>
        <section className={styles.section}>
          <TwSectionHeading
            kicker='Foundations'
            title='Colour tokens'
            lede='Every swatch reads from a CSS custom property, so these follow the mode switcher above.'
          />
          <div className={styles.swatches}>
            {[
              '--tw-bg-page',
              '--tw-surface-card',
              '--tw-surface-alt',
              '--tw-accent',
              '--tw-accent-hover',
              '--tw-teal',
              '--tw-gold',
              '--tw-success',
              '--tw-error',
              '--tw-warning',
              '--tw-info',
              '--tw-border',
              '--tw-text-body',
              '--tw-text-muted',
              '--tw-text-heading',
            ].map((token) => (
              <div key={token} className={styles.swatch}>
                <span
                  className={styles.swatchChip}
                  style={{ background: `var(${token})` }}
                />
                <code>{token}</code>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <TwSectionHeading
            kicker='Foundations'
            title='Typography'
            lede='Montserrat for headings, Merriweather for body, Roboto Mono for metadata.'
          />
          <p className={styles.display}>Display / Montserrat 800</p>
          <p className={styles.h2sample}>Heading 2 / Montserrat 700</p>
          <p className={styles.bodySample}>
            Body copy is set in Merriweather. I help people and organizations
            rebuild the parts of themselves they thought were permanent.
          </p>
          <p className={styles.monoSample}>2026.02.15 — Roboto Mono metadata</p>
        </section>

        <section className={styles.section}>
          <TwSectionHeading kicker='Components' title='Buttons' />
          <div className={styles.row}>
            <TwButton>Primary</TwButton>
            <TwButton variant='outline'>Outline</TwButton>
            <TwButton variant='quiet'>Quiet</TwButton>
            <TwButton disabled>Disabled</TwButton>
          </div>
          <div className={styles.row}>
            <TwButton size='sm'>Small</TwButton>
            <TwButton size='md'>Medium</TwButton>
            <TwButton size='lg'>Large</TwButton>
          </div>
        </section>

        <section className={styles.section}>
          <TwSectionHeading kicker='Components' title='Chips and filters' />
          <div className={styles.row}>
            <TwChip>Default</TwChip>
            <TwChip variant='featured'>Featured</TwChip>
            <TwChip variant='teal'>Teal</TwChip>
          </div>
          <TwFilterChips
            options={[
              { label: 'Writing', value: 'writing' },
              { label: 'Podcast', value: 'podcast' },
              { label: 'Case Study', value: 'case-study' },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </section>

        <section className={styles.section}>
          <TwSectionHeading kicker='Components' title='Callouts' />
          <div className={styles.stack}>
            {(
              ['accent', 'subtle', 'neutral', 'success', 'warning', 'error'] as const
            ).map((v) => (
              <TwCallout key={v} variant={v} title={v}>
                A callout in the {v} variant.
              </TwCallout>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <TwSectionHeading kicker='Components' title='Stats and cards' />
          <TwGrid cols={3} tabletCols={2}>
            <TwStatCard value='15+' label='Years bridging tech & design' />
            <TwStatCard value='3' label='Companies across the ecosystem' />
            <TwStatCard value='8' label='Accessible theme modes shipped' />
          </TwGrid>
          <div className={styles.spacer} />
          <TwGrid cols={2} tabletCols={2}>
            <TwCard padded>A plain card.</TwCard>
            <TwCard padded interactive>
              An interactive card — hover for lift, scale and border brighten.
            </TwCard>
          </TwGrid>
        </section>

        <section className={styles.section}>
          <TwSectionHeading
            kicker='Components'
            title='Content grid'
            lede='Container-query columns with staggered reveals.'
          />
          <TwContentGrid cols={3} tabletCols={2}>
            {SAMPLE.map((item) => (
              <TwArticleCard key={item.title} {...item} href='#' />
            ))}
          </TwContentGrid>
          <div className={styles.spacer} />
          <TwFeaturedCard {...SAMPLE[0]} featured href='#' />
        </section>

        <section className={styles.section}>
          <TwSectionHeading kicker='Components' title='Form controls' />
          <div className={styles.row}>
            <TwSelect
              label='A select'
              value={select}
              onChange={setSelect}
              options={[
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
              ]}
            />
            <TwSwitch
              checked={switchOn}
              onChange={setSwitchOn}
              label='A switch'
            />
          </div>
        </section>

        <section className={styles.section}>
          <TwSectionHeading kicker='Components' title='Rail layout' />
          <TwRailLayout
            rail={<TwCard padded>Sticky rail</TwCard>}
          >
            <p className={styles.bodySample}>
              Main column. The rail sticks below the nav on desktop and stacks
              above this content below 768px.
            </p>
          </TwRailLayout>
        </section>

        <section className={styles.section}>
          <TwSectionHeading
            kicker='Foundations'
            title={`Icons (${ICON_ENTRIES.length})`}
            lede='Hand-authored, currentColor, 24x24 grid. No icon dependency.'
          />
          <div className={styles.icons}>
            {ICON_ENTRIES.map(([name, Icon]) => (
              <div key={name} className={styles.icon} title={name}>
                <Icon size={24} />
                <span>{name.replace(/Icon$/, '')}</span>
              </div>
            ))}
          </div>
        </section>
      </TwContainer>

      <div className={styles.section}>
        <TwContainer>
          <TwCTABand
            kicker='Stay connected'
            title='Get new writing in your inbox'
            body='Occasional notes on resonance, systems, and the work in progress.'
          >
            <TwButton>Subscribe</TwButton>
          </TwCTABand>
        </TwContainer>
      </div>
    </div>
  );
}
