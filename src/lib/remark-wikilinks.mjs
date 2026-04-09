/**
 * Remark plugin that rewrites [[Target]] and [[Target|Display]] tokens into
 * resolved links. Resolution happens at build time against a content index
 * scanned from src/content/.
 *
 * Output for resolved links:
 *   <a href="/terms/subcontractor"
 *      class="wikilink"
 *      data-wiki-type="terms"
 *      data-wiki-id="subcontractor"
 *      data-wiki-short="Незалежна особа...">Субпідрядник</a>
 *
 * Broken links get `class="wikilink broken"` and log a warning.
 */

import { visit } from 'unist-util-visit';
import { resolve as resolveWikiTarget } from './content-index.mjs';

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function remarkWikiLinks() {
  return (tree, file) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return;
      const value = node.value;
      if (!value.includes('[[')) return;

      const children = [];
      let lastIndex = 0;
      let match;
      WIKILINK_RE.lastIndex = 0;
      while ((match = WIKILINK_RE.exec(value))) {
        const [full, target, displayOverride] = match;
        const start = match.index;
        if (start > lastIndex) {
          children.push({ type: 'text', value: value.slice(lastIndex, start) });
        }

        const display = (displayOverride || target).trim();
        const resolved = resolveWikiTarget(target);

        if (resolved) {
          children.push({
            type: 'link',
            url: resolved.route,
            title: resolved.short || null,
            data: {
              hProperties: {
                class: `wikilink wikilink--${resolved.collection}`,
                'data-wiki-type': resolved.collection,
                'data-wiki-id': resolved.id,
                'data-wiki-short': resolved.short || '',
              },
            },
            children: [{ type: 'text', value: display }],
          });
        } else {
          // Unresolved: still emit as visible but flagged
          if (file && typeof file.message === 'function') {
            file.message(`unresolved wikilink: [[${target}]]`);
          } else {
            console.warn(`[wikilinks] unresolved: [[${target}]]`);
          }
          children.push({
            type: 'link',
            url: '#unresolved',
            data: {
              hProperties: {
                class: 'wikilink wikilink--broken',
                'data-wiki-broken': 'true',
              },
            },
            children: [{ type: 'text', value: display }],
          });
        }

        lastIndex = start + full.length;
      }
      if (lastIndex < value.length) {
        children.push({ type: 'text', value: value.slice(lastIndex) });
      }

      if (children.length > 0) {
        parent.children.splice(index, 1, ...children);
        return index + children.length;
      }
    });
  };
}
