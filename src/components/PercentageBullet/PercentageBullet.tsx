'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

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
    if (percentage >= 98) return theme.palette.themePrimary;
    if (percentage < 70) return theme.palette.redDark;
    if (percentage >= 70 && percentage <= 90) return theme.palette.themeDarkAlt;
    return theme.palette.themePrimary;
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: !isMobile ? '150px' : '200px',
    marginLeft: !isMobile ? '16px' : '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const circleContainerStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    position: 'relative',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const circleBackgroundStyle: React.CSSProperties = {
    fill: 'none',
    stroke:
      theme.themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    strokeWidth: '5',
  };

  const circleStyle: React.CSSProperties = {
    fill: 'none',
    stroke: getCircleColor(),
    strokeWidth: '5',
    strokeLinecap: 'round',
    strokeDasharray: circumference.toString(),
    strokeDashoffset: `calc(${100 - animatedPercentage}% * ${circumference} / 100)`,
    transition: 'none',
  };

  const numberStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    margin: '0',
    padding: '0.25rem',
    color: getCircleColor(),
    fontWeight: 600,
    fontFamily: theme.typography.fonts.h6.fontFamily,
    fontSize: theme.typography.fontSizes.lg,
  };

  const textStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
    marginTop: '8px',
    fontWeight: 400,
    hyphens: 'none',
    wordBreak: 'keep-all',
    overflowWrap: 'normal',
    color: getCircleColor(),
    fontFamily: theme.typography.fonts.body.fontFamily,
    textTransform: 'lowercase',
    lineHeight: '1.2',
  };

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
    <div style={containerStyle}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={circleContainerStyle}>
          <svg width='100' height='100' viewBox='0 0 100 100'>
            {/* Background circle */}
            <circle style={circleBackgroundStyle} cx='50' cy='50' r='46' />
            {/* Animated percentage circle */}
            <circle
              style={circleStyle}
              cx='50'
              cy='50'
              r='46'
              transform='rotate(-90 50 50)'
            />
          </svg>
          <div style={numberStyle}>{Math.round(animatedPercentage)}</div>
        </div>
        <div style={textStyle}>{name}</div>
      </div>
    </div>
  );
};
