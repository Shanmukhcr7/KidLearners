const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /var\(--meadow-green\)/g, replacement: 'var(--color-accent-green)' },
  { regex: /var\(--ink-brown\)/g, replacement: 'var(--foreground)' },
  { regex: /var\(--ink\)/g, replacement: 'var(--foreground)' },
  { regex: /var\(--bone\)/g, replacement: 'var(--background)' },
  { regex: /var\(--cloud-white\)/g, replacement: 'white' },
  { regex: /var\(--neutral-border\)/g, replacement: 'var(--border)' },
  { regex: /text-\[var\(--foreground\)\]/g, replacement: 'text-slate-900' },
  { regex: /bg-\[var\(--background\)\]/g, replacement: 'bg-slate-50' },
  { regex: /var\(--golden-honey\)/g, replacement: 'var(--color-accent-yellow)' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replacement);
  });
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated vars in', file);
  }
});
