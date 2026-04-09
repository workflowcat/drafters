/**
 * Add stable paragraph IDs (p-1, p-2, ...) to every top-level paragraph
 * so readers can deep-link to any paragraph.
 */
import { visit } from 'unist-util-visit';

export function remarkParagraphIds() {
  return (tree) => {
    let n = 0;
    visit(tree, 'paragraph', (node, _index, parent) => {
      // Only top-level paragraphs (direct children of root)
      if (parent && parent.type !== 'root') return;
      n += 1;
      const id = `p-${n}`;
      if (!node.data) node.data = {};
      if (!node.data.hProperties) node.data.hProperties = {};
      node.data.hProperties.id = id;
      node.data.hProperties.class = (node.data.hProperties.class || '') + ' has-para-anchor';
    });
  };
}
