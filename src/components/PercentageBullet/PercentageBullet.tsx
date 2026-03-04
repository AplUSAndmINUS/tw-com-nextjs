import React from 'react';
import { Stack, mergeStyles } from '@fluentui/react';

import { useAppTheme } from '@/hooks/useAppTheme';

interface PercentageBulletProps {
  isMobile?: boolean;
  name: string;
  percentage: number;
}

export const PercentageBullet: React.FC<PercentageBulletProps> = ({
  isMobile = false,
  name,
  percentage,
}) => {
  const { theme } = useAppTheme();
  const circumference = 2 * Math.PI * 46;
  const [animatedPercentage, setAnimatedPercentage] = React.useState(0);
  const animationRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);
  const animationDuration = 1500; // Increased from 1000 to 1500 ms to make it slower

  const getCircleColor = () => {
    if (percentage >= 98) return theme.semanticColors.successText;
    if (percentage < 70) return theme.semanticColors.errorBackground;
    if (percentage >= 70 && percentage <= 90)
      return theme.semanticColors.messageText;
    return theme.palette.themePrimary;
  };

  const containerClass = mergeStyles({
    maxWidth: !isMobile ? '150px' : '200px',
    marginLeft: !isMobile ? '16px' : '0',
  });

  const circleContainerClass = mergeStyles({
    width: '100px',
    height: '100px',
    position: 'relative',
    margin: '0',
  });

  const circleBackgroundClass = mergeStyles({
    fill: 'none',
    stroke:
      theme.themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    strokeWidth: '5',
  });

  const circleClass = mergeStyles({
    fill: 'none',
    stroke: getCircleColor(),
    strokeWidth: '5',
    strokeLinecap: 'round',
    strokeDasharray: circumference,
    strokeDashoffset: `calc(${100 - animatedPercentage}% * ${circumference} / 100)`,
    transition: 'none', // We'll handle animation with requestAnimationFrame
  });

  const numberClass = mergeStyles({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    margin: '0',
    padding: '0.25rem',
    color: getCircleColor(),
    fontWeight: 600,
    fontVariationSettings: theme.typography.fonts.h6.fontVariationSettings,
    fontFamily: theme.fonts.medium.fontFamily,
    fontWidth: theme.fonts.medium.fontWidth,
    fontStyle: theme.fonts.medium.fontStyle,
    fontSize: theme.typography.fontSizes.clamp7,
  });

  const textClass = mergeStyles({
    fontSize: theme.typography.fontSizes.clamp5,
    textAlign: 'center',
    marginTop: '8px',
    fontVariationSettings: theme.typography.fonts.homeH3.fontVariationSettings,
    fontWeight: 400,
    hyphens: 'none',
    wordBreak: 'keep-all',
    overflowWrap: 'normal',
    color: getCircleColor(),
    fontFamily: theme.fonts.medium.fontFamily,
    fontWidth: theme.fonts.medium.fontWidth,
    fontStyle: theme.fonts.medium.fontStyle,
    textTransform: 'lowercase',
    lineHeight: '1.2',
  });

  // Animation function using requestAnimationFrame
  const animateCircle = React.useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / animationDuration, 1);
      const currentPercentage = progress * percentage;

      setAnimatedPercentage(currentPercentage);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateCircle);
      }
    },
    [percentage, animationDuration]
  );

  React.useEffect(() => {
    // Start the animation when component mounts
    animationRef.current = requestAnimationFrame(animateCircle);

    // Cleanup function to cancel animation
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [animateCircle]); // Re-run when animateCircle changes

  return (
    <Stack
      className={containerClass}
      horizontalAlign='center'
      verticalAlign='center'
    >
      <Stack horizontalAlign='center' verticalAlign='center'>
        <div className={circleContainerClass}>
          <svg width='100' height='100' viewBox='0 0 100 100'>
            {/* Background circle */}
            <circle className={circleBackgroundClass} cx='50' cy='50' r='46' />
            {/* Animated percentage circle */}
            <circle
              className={circleClass}
              cx='50'
              cy='50'
              r='46'
              transform='rotate(-90 50 50)'
            />
          </svg>
          <div className={numberClass}>{Math.round(animatedPercentage)}</div>
        </div>
        <div className={textClass}>{name}</div>
      </Stack>
    </Stack>
  );
};
