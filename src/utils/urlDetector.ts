/**
 * Utility to detect URLs in plain text and convert them into tokens.
 */
export interface TextToken {
  type: 'text' | 'url';
  value: string;
  url?: string;
}

export const URL_REGEX = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;

export function parseTextWithUrls(text: string): TextToken[] {
  if (!text) return [];

  const tokens: TextToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
      });
    }

    const url = match[0];
    tokens.push({
      type: 'url',
      value: url,
      url: url,
    });

    lastIndex = match.index + url.length;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      value: text.slice(lastIndex),
    });
  }

  return tokens;
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace('www.', '');
  } catch {
    return url;
  }
}
