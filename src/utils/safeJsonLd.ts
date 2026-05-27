/**
 * Safely serialize JSON-LD for injection into script tags.
 *
 * Prevents XSS by escaping characters that could break out of a <script> tag:
 * - `<` becomes `\u003c` to prevent `</script>` tag injection
 * - `>` becomes `\u003e` for symmetry and to prevent `<script>` injection
 * - `&` becomes `\u0026` to prevent HTML entity issues
 *
 * This is necessary when using `dangerouslySetInnerHTML` with JSON.stringify()
 * because user-generated content (frontmatter, blog posts, etc.) might contain
 * `</script>` sequences that would break out of the script tag.
 *
 * @param jsonObject - The object to serialize for JSON-LD injection
 * @returns Safe HTML string suitable for dangerouslySetInnerHTML
 *
 * @example
 * ```tsx
 * <Script
 *   id="schema-person"
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
 * />
 * ```
 */
export function safeJsonLd(jsonObject: unknown): string {
  const json = JSON.stringify(jsonObject);

  // Escape characters that could break out of script tags or cause XSS
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
