/**
 * Text utility functions for handling multilingual content
 * Optimized for English and Korean character handling
 */

/**
 * Check if a character is Korean (Hangul)
 */
function isKorean(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code >= 0xAC00 && code <= 0xD7AF) || // Hangul Syllables
    (code >= 0x1100 && code <= 0x11FF) || // Hangul Jamo
    (code >= 0x3130 && code <= 0x318F) || // Hangul Compatibility Jamo
    (code >= 0xA960 && code <= 0xA97F) || // Hangul Jamo Extended-A
    (code >= 0xD7B0 && code <= 0xD7FF)    // Hangul Jamo Extended-B
  );
}

/**
 * Check if a character is full-width (CJK characters, symbols, etc.)
 */
function isFullWidth(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    isKorean(char) ||
    (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs
    (code >= 0x3400 && code <= 0x4DBF) || // CJK Extension A
    (code >= 0xFF00 && code <= 0xFFEF) || // Halfwidth and Fullwidth Forms
    (code >= 0x3000 && code <= 0x303F)    // CJK Symbols and Punctuation
  );
}

/**
 * Calculate display width of text considering Korean/CJK characters
 * Korean characters count as 1.6 units, English as 1 unit
 */
function getDisplayWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    if (isFullWidth(char)) {
      width += 1.6; // Korean/CJK characters are wider
    } else {
      width += 1; // English characters
    }
  }
  return width;
}

/**
 * Truncate text intelligently based on display width
 * @param text - Text to truncate
 * @param maxWidth - Maximum display width (40 for English, ~25 for Korean)
 * @param suffix - Suffix to add when truncated (default: '...')
 */
export function truncateText(text: string, maxWidth: number = 40, suffix: string = '...'): string {
  if (!text) return text;
  
  const displayWidth = getDisplayWidth(text);
  
  if (displayWidth <= maxWidth) {
    return text;
  }
  
  let truncated = '';
  let currentWidth = 0;
  const suffixWidth = getDisplayWidth(suffix);
  
  for (const char of text) {
    const charWidth = isFullWidth(char) ? 1.6 : 1;
    
    if (currentWidth + charWidth + suffixWidth > maxWidth) {
      break;
    }
    
    truncated += char;
    currentWidth += charWidth;
  }
  
  return truncated + suffix;
}

/**
 * Truncate text for memo display in LinkCard
 * Optimized for the memo area size
 */
export function truncateMemo(memo: string): string {
  if (!memo) return memo;
  return truncateText(memo, 40, '...');
}

/**
 * Truncate text for title display
 * Already implemented in LinkCard but keeping for consistency
 */
export function truncateTitle(title: string, maxLength: number = 15): string {
  if (!title) return title;
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
}

/**
 * Count lines that text would take up with word wrapping
 * Useful for ensuring consistent card heights
 */
export function estimateLines(text: string, maxWidthPerLine: number = 40): number {
  if (!text) return 1;
  
  const words = text.split(/\s+/);
  let lines = 1;
  let currentLineWidth = 0;
  
  for (const word of words) {
    const wordWidth = getDisplayWidth(word);
    
    if (currentLineWidth + wordWidth > maxWidthPerLine) {
      lines++;
      currentLineWidth = wordWidth;
    } else {
      currentLineWidth += wordWidth + 1; // +1 for space
    }
  }
  
  return Math.min(lines, 3); // Max 3 lines for memo area
}