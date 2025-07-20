// A simple and safe Markdown to HTML parser.
// Note: This is not a full-featured Markdown parser. It only handles a subset
// of syntax for security and simplicity.

export const parseMarkdown = (text: string | undefined | null, glossary: Record<string, string> = {}): string => {
  if (!text) return '';

  let processedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = processedText.split('\n');
  let html = '';
  let inList = ''; // 'ul' or 'ol'

  const processInline = (line: string) => {
    return line
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>');
  }

  for (const line of lines) {
    // Headings
    if (line.startsWith('# ')) {
      if (inList) { html += `</${inList}>`; inList = ''; }
      html += `<h1>${processInline(line.substring(2))}</h1>`;
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html += `</${inList}>`; inList = ''; }
      html += `<h2>${processInline(line.substring(3))}</h2>`;
      continue;
    }
    if (line.startsWith('### ')) {
      if (inList) { html += `</${inList}>`; inList = ''; }
      html += `<h3>${processInline(line.substring(4))}</h3>`;
      continue;
    }

    // Blockquotes
    if (line.startsWith('&gt; ')) {
      if (inList) { html += `</${inList}>`; inList = ''; }
      html += `<blockquote><p>${processInline(line.substring(5))}</p></blockquote>`;
      continue;
    }

    // Unordered lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (inList !== 'ul') {
        if (inList) html += `</${inList}>`;
        html += '<ul>';
        inList = 'ul';
      }
      html += `<li>${processInline(line.substring(2))}</li>`;
      continue;
    }
    
    // Ordered lists
    const olMatch = line.match(/^(\d+)\. (.*)/);
    if (olMatch) {
      if (inList !== 'ol') {
        if (inList) html += `</${inList}>`;
        html += '<ol>';
        inList = 'ol';
      }
      html += `<li>${processInline(olMatch[2])}</li>`;
      continue;
    }

    // End of a list
    if (inList && line.trim() === '') {
      html += `</${inList}>`;
      inList = '';
      continue;
    }

    // Paragraph
    if (line.trim() !== '') {
      if (inList) { html += `</${inList}>`; inList = ''; }
      html += `<p>${processInline(line)}</p>`;
    } else {
       if (inList) {
          html += `</${inList}>`;
          inList = '';
       }
       html += '<br/>';
    }
  }

  // Close any open list
  if (inList) {
    html += `</${inList}>`;
  }
  
  let finalHtml = html.replace(/<p><br\/><\/p>/g, '<br/>').replace(/(<br\/>)+/g, '<br/>');

  // Apply glossary terms
  const glossaryTerms = Object.keys(glossary).sort((a, b) => b.length - a.length); // Sort to match longer terms first
  for (const term of glossaryTerms) {
    // This regex replaces the term only when it's a whole word and not inside an HTML tag.
    const regex = new RegExp(`\\b(${term})\\b(?![^<]*?>)`, 'gi');
    const definition = glossary[term].replace(/"/g, '&quot;'); // Sanitize quotes for the title attribute
    finalHtml = finalHtml.replace(regex, `<span class="glossary-term" title="${definition}">$1</span>`);
  }

  return finalHtml;
}