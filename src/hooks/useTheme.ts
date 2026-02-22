'use client';

// TODO: Remove this file once additional hooks have been added to the project -TW
// import { useState, useEffect } from 'react';

// type ColorScheme = 'light' | 'dark';

// export function useTheme() {
//   const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

//   useEffect(() => {
//     const mq = window.matchMedia('(prefers-color-scheme: dark)');
//     setColorScheme(mq.matches ? 'dark' : 'light');
//     const handler = (e: MediaQueryListEvent) => setColorScheme(e.matches ? 'dark' : 'light');
//     mq.addEventListener('change', handler);
//     return () => mq.removeEventListener('change', handler);
//   }, []);

//   return { colorScheme };
// }
