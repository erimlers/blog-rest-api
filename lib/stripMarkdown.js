/**
 * Removes markdown formatting from a string to return plain text.
 * @param {string} md - The markdown string
 * @returns {string} - Plain text string
 */
export function stripMarkdown(md) {
  if (!md) return "";
  
  return md
    // Remove headers
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove blockquotes
    .replace(/^\s*>+\s?/gm, '')
    // Remove unordered list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    // Remove ordered list markers
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Replace multiple newlines with a single space
    .replace(/\n+/g, ' ')
    // Trim whitespace
    .trim();
}
