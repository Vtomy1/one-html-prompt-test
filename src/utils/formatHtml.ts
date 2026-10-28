/**
 * Utility to format / beautify HTML source code with clean 2-space indentation
 * while respecting script tags, styles, and self-closing elements.
 */
export function formatHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  let tab = '  ';
  let result = '';
  let indent = 0;

  // Normalize line breaks
  const cleanHtml = html
    .replace(/>\s+</g, '><')
    .replace(/(<!--[\s\S]*?-->)/g, '\n$1\n')
    .trim();

  // Self-closing void tags in HTML5
  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  // Tokenize HTML tags and text chunks
  const tokens = cleanHtml.split(/(<\/?[a-zA-Z0-9\-]+(?:\s+[^>]*?)?>)/g).filter(Boolean);

  let inScript = false;
  let inStyle = false;
  let scriptContent = '';
  let styleContent = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    // Detect script block
    if (/^<script\b/i.test(token)) {
      inScript = true;
      result += '\n' + tab.repeat(indent) + token;
      indent++;
      continue;
    }
    if (/^<\/script>/i.test(token)) {
      inScript = false;
      indent = Math.max(0, indent - 1);
      result += '\n' + tab.repeat(indent) + token;
      continue;
    }

    // Detect style block
    if (/^<style\b/i.test(token)) {
      inStyle = true;
      result += '\n' + tab.repeat(indent) + token;
      indent++;
      continue;
    }
    if (/^<\/style>/i.test(token)) {
      inStyle = false;
      indent = Math.max(0, indent - 1);
      result += '\n' + tab.repeat(indent) + token;
      continue;
    }

    if (inScript || inStyle) {
      // Keep script / style indented
      const lines = token.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          result += '\n' + tab.repeat(indent) + line.trim();
        }
      }
      continue;
    }

    // Closing tag: </tag>
    if (/^<\/[a-zA-Z0-9\-]+>$/i.test(token)) {
      indent = Math.max(0, indent - 1);
      result += '\n' + tab.repeat(indent) + token;
      continue;
    }

    // DOCTYPE or comment
    if (/^<!DOCTYPE/i.test(token) || /^<!--/i.test(token)) {
      result += (result ? '\n' : '') + token;
      continue;
    }

    // Opening tag: <tag ...>
    if (/^<[a-zA-Z0-9\-]+/i.test(token)) {
      const tagNameMatch = token.match(/^<([a-zA-Z0-9\-]+)/i);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
      const isSelfClosing = token.endsWith('/>') || voidTags.has(tagName);

      result += '\n' + tab.repeat(indent) + token;

      if (!isSelfClosing) {
        indent++;
      }
      continue;
    }

    // Plain text content
    result += '\n' + tab.repeat(indent) + token;
  }

  return result.trim() + '\n';
}

/**
 * Downloads a formatted .html file to the user's browser.
 */
export function exportHtmlFile(html: string, filename?: string): { success: boolean; filename: string } {
  try {
    const formatted = formatHtml(html);
    const blob = new Blob([formatted], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const actualFilename = filename && filename.trim()
      ? (filename.endsWith('.html') ? filename : `${filename}.html`)
      : `template-${new Date().toISOString().slice(0, 10)}.html`;

    const a = document.createElement('a');
    a.href = url;
    a.download = actualFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, filename: actualFilename };
  } catch (err) {
    console.error('Failed to export HTML file:', err);
    return { success: false, filename: '' };
  }
}
