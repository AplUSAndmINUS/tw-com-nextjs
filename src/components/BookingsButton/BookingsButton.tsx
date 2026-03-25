'use client';

import React from 'react';

import { FormButton } from '@/components/Form/FormButton';
import { useDeviceOrientation } from '@/hooks';
import { FluentIcon } from '../FluentIcon';
import { CalendarLtr28Regular } from '@fluentui/react-icons';
import { ConsultationStepper } from '../ConsultationStepper';

interface BookingsButtonProps {
  animateSubHeader?: boolean;
  willAnimate?: boolean;
  style?: React.CSSProperties;
  className?: string;
  isHomePage?: boolean;
  isHeader?: boolean;
  isHero?: boolean;
}

export const BookingsButton: React.FC<BookingsButtonProps> = ({
  animateSubHeader = false,
  willAnimate = false,
  style,
  className,
  isHomePage = false,
  isHeader = false,
  isHero = false,
}) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [stepperOpen, setStepperOpen] = React.useState(false);
  const isOrientationHook = useDeviceOrientation();
  const orientation = isMounted ? isOrientationHook : '';

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine font size based on orientation and component context
  const getResponsiveFontSize = () => {
    if (orientation === 'portrait') {
      return 'clamp(0.75rem, 2cqi, 1rem)';
    }
    if (orientation === 'square') {
      return 'clamp(1.1rem, 3.7cqi, 1.125rem)';
    }
    if (orientation === 'mobile-landscape') {
      return 'clamp(0.85rem, 3.2cqi, 1rem)';
    }
    // landscape or ultrawide
    return 'clamp(0.825rem, 2cqi, 1rem)';
  };

  const buttonStyles: React.CSSProperties = {
    marginTop:
      orientation === 'portrait' || isHomePage || isHeader || isHero
        ? '0'
        : '1rem',
    padding: isHeader
      ? '0.5rem'
      : isHero
        ? '1rem 1.25rem'
        : !isHomePage
          ? '0.5rem 0.25rem'
          : '0.75rem 1rem',
    minHeight: orientation === 'portrait' ? '40px' : undefined,
    minWidth: isHeader ? '225px' : '250px',
    maxWidth: isHomePage ? undefined : '500px',
    width: animateSubHeader || orientation === 'portrait' ? '100%' : 'auto',
    fontSize: getResponsiveFontSize(),
    fontWeight: '600',
    boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
    // Animation states
    ...(willAnimate &&
      !animateSubHeader && {
        opacity: 0,
        transform: 'translateY(20px)',
      }),
    ...(animateSubHeader === true && {
      opacity: 0,
      transform: 'translateY(20px)',
      animation: 'slideInUp 0.4s ease-in-out forwards',
      animationDelay: '0.8s',
    }),
    ...(animateSubHeader === false &&
      !willAnimate && {
        opacity: 1,
        transform: 'translateY(0)',
      }),
    ...(animateSubHeader === undefined &&
      !willAnimate && {
        opacity: 1,
        transform: 'translateY(0)',
      }),
    ...style,
  };

  return (
    <>
      <FormButton
        variant='primary'
        size={isHero ? 'large' : isHomePage ? 'medium' : 'small'}
        onClick={() => setStepperOpen(true)}
        style={buttonStyles}
        className={className}
      >
        {isHomePage ||
          (isHero && (
            <FluentIcon
              iconName={CalendarLtr28Regular}
              style={{ marginRight: '0.5rem' }}
            />
          ))}
        Book a Consultation
      </FormButton>
      <ConsultationStepper
        isOpen={stepperOpen}
        onDismiss={() => setStepperOpen(false)}
      />
    </>
  );
};
