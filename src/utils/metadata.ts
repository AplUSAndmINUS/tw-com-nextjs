import type { Metadata } from 'next';
import { getEnvironment } from '@/lib/environment';
+

const BASE_URL = 'https://terencewaters.com';
const DEFAULT_DESCRIPTION = 'Author, technologist, and creative thinker.';
+/**
+ * Returns robots configuration based on environment.
+ * DEV/TEST: Prevents search engine indexing
+ * PROD: Allows search engine indexing
+ */
+export function getRobotsConfig() {
+  const env = getEnvironment();
+  const shouldIndex = env === 'prod';
+
+  return {
+    index: shouldIndex,
+    follow: shouldIndex,
+    googleBot: {
+      index: shouldIndex,
+      follow: shouldIndex,
+      'max-video-preview': -1,
+      'max-image-preview': 'large',
+      'max-snippet': -1,
+    },
+  } as const;
+}
+

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'Terence Waters',
      template: '%s | Terence Waters',
    },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: 'website',
      siteName: 'Terence Waters',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@TerenceWaters',
    },
    ...overrides,
  };
}
