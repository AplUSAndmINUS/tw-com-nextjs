'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { Typography } from '@/components/Typography';
import { ThemedLink } from '@/components/ThemedLink';
import { motion } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobile, useIsMobileLandscape } from '@/hooks/useMediaQuery';
import type { ThemeMode } from '@/theme/fluentTheme';

export default function HomePage() {
  const { theme, themeMode, setThemeMode } = useAppTheme();
  const [animationStage, setAnimationStage] = useState(0);
  const [previousTheme, setPreviousTheme] = useState<ThemeMode | null>(null);
  const isMobile = useIsMobile();
  const isMobileLandscape = useIsMobileLandscape();

  // Force dark mode on homepage
  useEffect(() => {
    // Save current theme
    if (themeMode !== 'dark') {
      setPreviousTheme(themeMode);
      setThemeMode('dark');
    }

    // Restore previous theme on unmount
    return () => {
      if (previousTheme && previousTheme !== 'dark') {
        setThemeMode(previousTheme);
      }
    };
  }, []); // Only run on mount/unmount

  useEffect(() => {
    const stages = [
      { delay: 400, stage: 1 }, // "hi there! :)"
      { delay: 1200, stage: 2 }, // "my name is"
      { delay: 2000, stage: 3 }, // "Terence Waters"
      { delay: 2800, stage: 4 }, // horizontal line
      { delay: 3400, stage: 5 }, // first tagline
      { delay: 3900, stage: 6 }, // second tagline
      { delay: 4400, stage: 7 }, // buttons
    ];

    stages.forEach(({ delay, stage }) => {
      setTimeout(() => setAnimationStage(stage), delay);
    });
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <PageLayout isHomePage>
      <section className='flex flex-col items-start justify-end lg:justify-center h-full sm:px-4 md:px-6 lg:px-12'>
        {/* Translucent card container around text */}
        <div
          className={`text-left lg:text-left rounded-2xl backdrop-blur-sm ${
            isMobileLandscape
              ? 'w-1/2 space-y-2 p-3'
              : 'w-full max-w-3xl space-y-3 p-6 md:p-10'
          }`}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Greeting */}
          {animationStage >= 1 && (
            <motion.div {...fadeInUp}>
              <Typography
                variant='h3'
                style={{
                  color: theme.semanticColors.text.muted,
                  fontWeight: theme.typography.fontWeights.light,
                  marginBottom: '0.25rem',
                  fontSize:
                    isMobileLandscape || isMobile ? '1.25rem' : undefined,
                }}
              >
                hi there! :)
              </Typography>
            </motion.div>
          )}

          {/* Introduction */}
          {animationStage >= 2 && (
            <motion.div {...fadeInUp}>
              <Typography
                variant='h2'
                style={{
                  color: theme.semanticColors.text.muted,
                  fontWeight: theme.typography.fontWeights.regular,
                  marginBottom: isMobileLandscape ? '0.25rem' : '0.25rem',
                  fontSize:
                    isMobileLandscape || isMobile ? '1.15rem' : undefined,
                }}
              >
                my name is
              </Typography>
            </motion.div>
          )}

          {/* Name */}
          {animationStage >= 3 && (
            <motion.div {...fadeInUp}>
              <Typography
                variant='h1'
                style={{
                  color: theme.semanticColors.text.heading,
                  fontWeight: theme.typography.fontWeights.bold,
                  marginBottom: isMobileLandscape ? '0.3rem' : '0.75rem',
                  fontSize: isMobileLandscape
                    ? '1.5rem'
                    : isMobile
                      ? '2rem'
                      : undefined,
                }}
              >
                Terence Waters
              </Typography>
            </motion.div>
          )}

          {/* Divider Line */}
          {animationStage >= 4 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ transformOrigin: 'center' }}
            >
              <hr
                style={{
                  border: 'none',
                  height: '2px',
                  background: theme.semanticColors.border.emphasis,
                  margin: isMobileLandscape ? '0.3rem 0' : '1rem 0',
                  maxWidth: isMobileLandscape ? '200px' : '300px',
                  width: '70%',
                }}
              />
            </motion.div>
          )}

          {/* Tagline - Line 1 */}
          {animationStage >= 5 && (
            <motion.div {...fadeInUp}>
              <Typography
                variant='p'
                style={{
                  color: theme.semanticColors.text.primary,
                  fontSize: isMobileLandscape
                    ? '0.8rem'
                    : isMobile
                      ? '0.95rem'
                      : '1.15rem',
                  fontWeight: theme.typography.fontWeights.medium,
                  marginBottom: isMobileLandscape ? '0.3rem' : '0.5rem',
                }}
              >
                Author, technologist, and creative thinker.
              </Typography>
            </motion.div>
          )}

          {/* Tagline - Line 2 */}
          {animationStage >= 6 && !isMobile && !isMobileLandscape && (
            <motion.div {...fadeInUp}>
              <Typography
                variant='p'
                style={{
                  color: theme.semanticColors.text.muted,
                  fontSize: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                Writing about resonance, authenticity, and building a life that
                feels right.
              </Typography>
            </motion.div>
          )}

          {/* CTAs */}
          {animationStage >= 7 && (
            <motion.div
              {...fadeInUp}
              className={`flex ${isMobileLandscape ? 'gap-2' : 'gap-4'} flex-wrap ${isMobile ? 'justify-center' : 'justify-start'}`}
            >
              <ThemedLink
                href='/blog'
                className={`rounded-lg transition-all font-semibold hover:scale-105 active:scale-95 ${
                  isMobileLandscape
                    ? 'px-3 py-1.5'
                    : isMobile
                      ? 'px-4 py-2.5'
                      : 'px-6 py-2.5'
                }`}
                style={{
                  backgroundColor: theme.semanticColors.link.default,
                  color: theme.semanticColors.background.base,
                  boxShadow: theme.shadows.button,
                }}
              >
                Read My Blog
              </ThemedLink>
              <ThemedLink
                href='/portfolio'
                className={`rounded-lg transition-all font-semibold hover:scale-105 active:scale-95 ${
                  isMobileLandscape
                    ? 'px-3 py-1'
                    : isMobile
                      ? 'px-4 py-2.5'
                      : 'px-6 py-2.5'
                }`}
                style={{
                  border: `2px solid ${theme.semanticColors.border.emphasis}`,
                  color: theme.semanticColors.text.primary,
                  backgroundColor: 'transparent',
                }}
              >
                View Portfolio
              </ThemedLink>
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
