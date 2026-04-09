/**
 * Markdown → docx walker.
 *
 * Handles: headings (h1-h4), paragraphs, bold/italic/code inline,
 * bullet + numbered lists, blockquotes, GFM pipe-tables, horizontal
 * rules. Flattens [[wikilinks]] and [markdown](links) to their display
 * text. Strips escape backslashes used for placeholders (\_\_ → __).
 */

import {
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';

const RULE_COLOR = 'CCCCCC';
const INK_MUTED = '555555';

// ── Inline formatting ─────────────────────────────────────

/**
 * Flatten wiki-link / markdown-link / escape sequences before we
 * split for bold/italic parsing. We don't lose information; we just
 * normalize to the display text.
 */
function flattenInlineRaw(text) {
  // [[target|display]] → display
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  // [[target]] → target
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1');
  // [text](url) → text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // \_ → _ (common in YAML-safe MDX for placeholder fields)
  text = text.replace(/\\([_*`])/g, '$1');
  // Collapse whitespace inside a single logical line
  return text;
}

/**
 * Tokenize a flat inline string into TextRuns with the right
 * bold/italic/code formatting.
 */
function inlineRuns(text, baseOpts = {}) {
  const flat = flattenInlineRaw(text);
  const runs = [];
  // Match **bold**, *italic*, _italic_, `code`
  const re = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|_[^_\n]+_|`[^`\n]+`)/g;
  let lastIndex = 0;
  let m;
  while ((m = re.exec(flat))) {
    if (m.index > lastIndex) {
      runs.push(new TextRun({ ...baseOpts, text: flat.slice(lastIndex, m.index) }));
    }
    const tok = m[0];
    if (tok.startsWith('**')) {
      runs.push(new TextRun({ ...baseOpts, text: tok.slice(2, -2), bold: true }));
    } else if (tok.startsWith('*')) {
      runs.push(new TextRun({ ...baseOpts, text: tok.slice(1, -1), italics: true }));
    } else if (tok.startsWith('_')) {
      runs.push(new TextRun({ ...baseOpts, text: tok.slice(1, -1), italics: true }));
    } else if (tok.startsWith('`')) {
      runs.push(new TextRun({ ...baseOpts, text: tok.slice(1, -1), font: 'Consolas' }));
    }
    lastIndex = m.index + tok.length;
  }
  if (lastIndex < flat.length) {
    runs.push(new TextRun({ ...baseOpts, text: flat.slice(lastIndex) }));
  }
  return runs.length ? runs : [new TextRun({ ...baseOpts, text: flat })];
}

// ── Table parser ──────────────────────────────────────────

/**
 * Parse a sequence of markdown pipe-table lines into a docx Table.
 * `lines` is the full block including the header row + separator row.
 */
function parseMarkdownTable(lines) {
  const rows = lines
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'))
    .map((l) => {
      // Drop leading/trailing pipes and split
      const cells = l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      return cells;
    });
  if (rows.length < 2) return null;
  // Row 1 is header, row 2 is the separator (|:---|---:|), rest is body
  const header = rows[0];
  const body = rows.slice(2);

  const makeCell = (text, { header = false, firstCol = false } = {}) =>
    new TableCell({
      shading: header
        ? { type: ShadingType.CLEAR, fill: 'EEE9D4' }
        : undefined,
      children: [
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: inlineRuns(text || '', {
            bold: header,
            size: header ? 20 : 20,
          }),
        }),
      ],
      width: { size: 50, type: WidthType.PERCENTAGE },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
    });

  const tableRows = [];
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: header.map((h, i) => makeCell(h, { header: true, firstCol: i === 0 })),
    })
  );
  for (const r of body) {
    tableRows.push(new TableRow({ children: r.map((c, i) => makeCell(c, { firstCol: i === 0 })) }));
  }

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: RULE_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE_COLOR },
      left: { style: BorderStyle.SINGLE, size: 4, color: RULE_COLOR },
      right: { style: BorderStyle.SINGLE, size: 4, color: RULE_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: RULE_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: RULE_COLOR },
    },
  });
}

// ── Main walker ───────────────────────────────────────────

export function markdownToChildren(md) {
  const out = [];
  // Strip frontmatter
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end !== -1) md = md.slice(end + 4).replace(/^\n+/, '');
  }

  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip blanks
    if (trimmed === '') { i++; continue; }

    // Horizontal rule
    if (/^[-=*]{3,}$/.test(trimmed)) {
      out.push(
        new Paragraph({
          spacing: { before: 200, after: 200 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE_COLOR, space: 1 },
          },
          children: [new TextRun({ text: '' })],
        })
      );
      i++;
      continue;
    }

    // Headings
    const hMatch = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = flattenInlineRaw(hMatch[2]);
      const heading =
        level === 1 ? HeadingLevel.HEADING_1 :
        level === 2 ? HeadingLevel.HEADING_2 :
        level === 3 ? HeadingLevel.HEADING_3 :
        HeadingLevel.HEADING_4;
      out.push(
        new Paragraph({
          text,
          heading,
          spacing: {
            before: level <= 2 ? 360 : 240,
            after: level <= 2 ? 180 : 120,
          },
          keepNext: true,
        })
      );
      i++;
      continue;
    }

    // Pipe table (header row like `| X | Y |` followed by separator `| :--- | :--- |`)
    if (/^\|.*\|$/.test(trimmed) && i + 1 < lines.length && /^\|[\s\-:|]+\|$/.test(lines[i + 1].trim())) {
      const tableLines = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) {
        tableLines.push(lines[i]);
        i++;
      }
      const tbl = parseMarkdownTable(tableLines);
      if (tbl) {
        out.push(tbl);
        out.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { before: 0, after: 160 } }));
      }
      continue;
    }

    // Blockquote (multi-line)
    if (trimmed.startsWith('>')) {
      const chunk = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        chunk.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const text = flattenInlineRaw(chunk.join(' '));
      out.push(
        new Paragraph({
          children: [new TextRun({ text, italics: true, color: INK_MUTED })],
          indent: { left: 400 },
          spacing: { before: 120, after: 160 },
          border: {
            left: { style: BorderStyle.SINGLE, size: 12, color: 'B8C2F5', space: 8 },
          },
        })
      );
      continue;
    }

    // Bullet list
    if (/^[-*+]\s+/.test(trimmed)) {
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        const text = flattenInlineRaw(lines[i].trim().replace(/^[-*+]\s+/, ''));
        out.push(
          new Paragraph({
            children: inlineRuns(text),
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        );
        i++;
      }
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(trimmed)) {
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const text = flattenInlineRaw(lines[i].trim().replace(/^\d+\.\s+/, ''));
        out.push(
          new Paragraph({
            children: inlineRuns(text),
            numbering: { reference: 'standard-numbering', level: 0 },
            spacing: { after: 60 },
          })
        );
        i++;
      }
      continue;
    }

    // HTML-ish opening tag on its own line — strip and continue
    if (/^<[^>]+>$/.test(trimmed)) { i++; continue; }

    // Plain paragraph: collect consecutive non-blank lines that aren't
    // headings, table rows, list items, or blockquotes.
    const chunk = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,6}\s/.test(lines[i].trim()) &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^>/.test(lines[i].trim()) &&
      !/^\|.*\|$/.test(lines[i].trim()) &&
      !/^[-=*]{3,}$/.test(lines[i].trim())
    ) {
      chunk.push(lines[i].trim());
      i++;
    }
    if (chunk.length === 0) { i++; continue; }
    const joined = chunk.join(' ');
    out.push(
      new Paragraph({
        children: inlineRuns(joined),
        spacing: { after: 180 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  }

  return out;
}
