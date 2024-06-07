
import fs from 'fs';
import path from 'path';

export default function ssiReplace() {
  return {
    name: 'ssi-replace',
    transformIndexHtml(html, { filename }) {
      const includeRegex = /<!--#include virtual="(.+?)" -->/g;
      return html.replace(includeRegex, (match, src) => {
        const includePath = path.resolve(path.dirname(filename), src);
        const content = fs.readFileSync(includePath, 'utf-8');
        return content;
      });
    }
  };
}