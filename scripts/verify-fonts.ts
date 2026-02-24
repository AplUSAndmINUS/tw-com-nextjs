#!/usr/bin/env node
/**
 * Font Verification Script
 *
 * Verifies that all required fonts and weights are available in the Adobe Fonts project.
 * Runs before build and dev to catch configuration issues early.
 */

interface FontConfig {
  family: string;
  weights: number[];
  styles?: ('normal' | 'italic')[];
  displayName?: string;
}

const REQUIRED_FONTS: FontConfig[] = [
  {
    family: 'montserrat',
    displayName: 'Montserrat',
    weights: [300, 500, 600, 700, 800],
    styles: ['normal', 'italic'],
  },
  {
    family: 'merriweather',
    displayName: 'Merriweather',
    weights: [400],
    styles: ['normal', 'italic'],
  },
  {
    family: 'roboto-condensed',
    displayName: 'Roboto Condensed',
    weights: [300],
    styles: ['normal'],
  },
  {
    family: 'roboto-mono',
    displayName: 'Roboto Mono',
    weights: [400],
    styles: ['normal'],
  },
];

const ADOBE_FONTS_PROJECT_ID = 'dqf8seo';
const ADOBE_FONTS_URL = `https://use.typekit.net/${ADOBE_FONTS_PROJECT_ID}.css`;

interface FontFaceRule {
  family: string;
  weight: number;
  style: string;
}

/**
 * Parse CSS content to extract @font-face rules
 */
function parseFontFaces(cssContent: string): FontFaceRule[] {
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  const fontFaces: FontFaceRule[] = [];

  let match;
  while ((match = fontFaceRegex.exec(cssContent)) !== null) {
    const rules = match[1];

    // Extract font-family
    const familyMatch = rules.match(/font-family:\s*["']?([^"';]+)["']?/i);
    // Extract font-weight
    const weightMatch = rules.match(/font-weight:\s*(\d+)/i);
    // Extract font-style
    const styleMatch = rules.match(/font-style:\s*(\w+)/i);

    if (familyMatch && weightMatch) {
      fontFaces.push({
        family: familyMatch[1].toLowerCase().trim(),
        weight: parseInt(weightMatch[1], 10),
        style: styleMatch ? styleMatch[1].toLowerCase() : 'normal',
      });
    }
  }

  return fontFaces;
}

/**
 * Check if font-display: swap is configured
 */
function checkFontDisplay(cssContent: string): boolean {
  return /font-display:\s*swap/i.test(cssContent);
}

/**
 * Verify all required fonts are present
 */
async function verifyAdobeFonts(): Promise<void> {
  console.log('🔍 Verifying Adobe Fonts configuration...\n');
  console.log(`📦 Project ID: ${ADOBE_FONTS_PROJECT_ID}`);
  console.log(`🔗 URL: ${ADOBE_FONTS_URL}\n`);

  try {
    const response = await fetch(ADOBE_FONTS_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Adobe Fonts CSS (${response.status} ${response.statusText})`
      );
    }

    const cssContent = await response.text();
    const fontFaces = parseFontFaces(cssContent);

    console.log(`✓ Found ${fontFaces.length} font face declarations\n`);

    // Check font-display: swap
    const hasFontDisplay = checkFontDisplay(cssContent);
    if (hasFontDisplay) {
      console.log('✓ font-display: swap is configured\n');
    } else {
      console.warn('⚠️  font-display: swap is NOT configured');
      console.warn(
        '   This may cause Flash of Invisible Text (FOIT) on slow connections.'
      );
      console.warn(
        '   See ADOBE-FONTS-SETUP.md for configuration instructions.\n'
      );
    }

    // Verify each required font
    const missingFonts: string[] = [];
    const foundFonts: string[] = [];

    for (const requiredFont of REQUIRED_FONTS) {
      const styles = requiredFont.styles || ['normal'];

      for (const weight of requiredFont.weights) {
        for (const style of styles) {
          const isPresent = fontFaces.some(
            (face) =>
              face.family === requiredFont.family &&
              face.weight === weight &&
              face.style === style
          );

          const fontDesc = `${requiredFont.displayName || requiredFont.family} ${weight}${style !== 'normal' ? ` ${style}` : ''}`;

          if (isPresent) {
            foundFonts.push(fontDesc);
          } else {
            missingFonts.push(fontDesc);
          }
        }
      }
    }

    // Report results
    if (missingFonts.length > 0) {
      console.error('❌ Missing fonts from Adobe Fonts project:\n');
      missingFonts.forEach((font) => console.error(`   - ${font}`));
      console.error(
        '\n📚 Check docs/ADOBE-FONTS-SETUP.md for required configuration.'
      );
      console.error(
        '🔧 Update your Adobe Fonts project at: https://fonts.adobe.com/\n'
      );
      process.exit(1);
    }

    console.log('✅ All required fonts are configured:\n');
    foundFonts.forEach((font) => console.log(`   ✓ ${font}`));
    console.log('\n🎉 Font verification complete!\n');
  } catch (error) {
    console.error('❌ Font verification failed:\n');
    if (error instanceof Error) {
      console.error(`   ${error.message}\n`);
    } else {
      console.error(`   ${String(error)}\n`);
    }
    console.error(
      '⚠️  Ensure you have internet access and the Adobe Fonts URL is correct.'
    );
    console.error(
      '⚠️  If deploying to production, this check prevents font load failures.\n'
    );
    process.exit(1);
  }
}

// Run verification
verifyAdobeFonts();
