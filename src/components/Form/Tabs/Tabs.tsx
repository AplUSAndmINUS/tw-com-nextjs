'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export type TabsVariant = 'default' | 'pills' | 'underline';
export type TabsSize = 'small' | 'medium' | 'large';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  /** Array of tab objects */
  tabs: Tab[];
  /** Default active tab ID */
  defaultTab?: string;
  /** Controlled active tab ID */
  activeTab?: string;
  /** Callback when tab changes */
  onTabChange?: (tabId: string) => void;
  /** Tabs variant */
  variant?: TabsVariant;
  /** Tabs size */
  size?: TabsSize;
  /** Full width tabs */
  fullWidth?: boolean;
  /** Additional className */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}

/**
 * Tabs Component
 *
 * Standardized tab navigation with keyboard support.
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: 'home', label: 'Home', content: <div>Home Content</div> },
 *     { id: 'profile', label: 'Profile', content: <div>Profile Content</div> }
 *   ]}
 * />
 * ```
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  className = '',
  style,
}) => {
  const { theme } = useAppTheme();
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const activeTab = controlledActiveTab || internalActiveTab;

  useEffect(() => {
    if (controlledActiveTab) {
      setInternalActiveTab(controlledActiveTab);
    }
  }, [controlledActiveTab]);

  const handleTabClick = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    const currentEnabledIndex = enabledTabs.findIndex(
      (tab) => tab.id === tabs[currentIndex].id
    );

    let nextIndex = currentEnabledIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentEnabledIndex + 1) % enabledTabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex =
        (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = enabledTabs.length - 1;
    }

    const nextTab = enabledTabs[nextIndex];
    if (nextTab) {
      handleTabClick(nextTab.id);
      tabRefs.current[nextTab.id]?.focus();
    }
  };

  const sizeConfig = {
    small: {
      fontSize: '0.875rem',
      padding: '0.375rem 0.75rem',
      gap: '0.5rem',
    },
    medium: {
      fontSize: '1rem',
      padding: '0.5rem 1rem',
      gap: '0.75rem',
    },
    large: {
      fontSize: '1.125rem',
      padding: '0.75rem 1.5rem',
      gap: '1rem',
    },
  };

  const config = sizeConfig[size];

  const getTabListStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      gap: variant === 'pills' ? '0.5rem' : '0',
      width: fullWidth ? '100%' : 'auto',
      overflow: 'auto',
    };

    switch (variant) {
      case 'pills':
        return {
          ...baseStyles,
          padding: '0.25rem',
          backgroundColor: theme.palette.neutralLighter,
          borderRadius: theme.borderRadius.container.small,
        };
      case 'underline':
        return {
          ...baseStyles,
          borderBottom: `2px solid ${theme.palette.neutralLight}`,
        };
      default:
        return {
          ...baseStyles,
          borderBottom: `1px solid ${theme.palette.neutralLight}`,
        };
    }
  };

  const getTabStyles = (tab: Tab): React.CSSProperties => {
    const isActive = activeTab === tab.id;
    const isDisabled = tab.disabled;

    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: config.gap,
      padding: config.padding,
      fontSize: config.fontSize,
      fontFamily: theme.typography.fonts.body.fontFamily,
      fontWeight: isActive ? 600 : 400,
      color: isDisabled
        ? theme.palette.neutralTertiary
        : isActive
          ? theme.semanticColors.link.default
          : theme.semanticColors.text.primary,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      outline: 'none',
      position: 'relative',
      whiteSpace: 'nowrap',
      flex: fullWidth ? 1 : 'none',
    };

    switch (variant) {
      case 'pills':
        return {
          ...baseStyles,
          backgroundColor: isActive
            ? theme.semanticColors.link.default
            : 'transparent',
          color: isActive
            ? theme.palette.white
            : theme.semanticColors.text.primary,
          borderRadius: theme.borderRadius.container.small,
        };
      case 'underline':
        return {
          ...baseStyles,
          borderBottom: `2px solid ${isActive ? theme.semanticColors.link.default : 'transparent'}`,
          marginBottom: '-2px',
        };
      default:
        return {
          ...baseStyles,
          borderBottom: `2px solid ${isActive ? theme.semanticColors.link.default : 'transparent'}`,
          marginBottom: '-1px',
        };
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    ...style,
  };

  const contentStyles: React.CSSProperties = {
    padding: '1rem',
    animation: 'fadeIn 0.2s ease',
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div className={`tw-tabs ${className}`} style={containerStyles}>
        <div
          role='tablist'
          aria-orientation='horizontal'
          style={getTabListStyles()}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role='tab'
              aria-selected={activeTab === tab.id ? 'true' : 'false'}
              aria-controls={`panel-${tab.id}`}
              aria-disabled={tab.disabled ? 'true' : 'false'}
              tabIndex={activeTab === tab.id ? 0 : -1}
              disabled={tab.disabled}
              style={getTabStyles(tab)}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role='tabpanel'
          id={`panel-${activeTab}`}
          aria-labelledby={activeTab}
          style={contentStyles}
        >
          {activeTabData?.content}
        </div>
      </div>
    </>
  );
};

Tabs.displayName = 'Tabs';
