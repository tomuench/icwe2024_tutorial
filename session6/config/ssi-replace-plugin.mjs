import fs from 'fs';
import path from 'path';
const includeRegex = /<!--#include virtual="(.+?)" -->/g;

const srcPath = 'src/pages/';

export default function ssiReplace(content, filename) {
  if(!filename.includes('.html')) return content;

  return content.toString().replace(includeRegex, (match, src) => {
    const includePath = path.resolve(srcPath + src);
    const content = fs.readFileSync(includePath, 'utf-8');
    console.log(content);
    return content;
  });
}