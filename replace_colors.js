const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[#FFF9EC\]/g, replacement: 'bg-slate-50' },
  { regex: /text-\[#3A2E1F\]/g, replacement: 'text-slate-900' },
  { regex: /text-\[#7A6F5D\]/g, replacement: 'text-slate-500' },
  { regex: /border-\[#EFE6D3\]/g, replacement: 'border-slate-200' },
  { regex: /bg-\[#E0A526\]/g, replacement: 'bg-[var(--color-accent-yellow)]' },
  { regex: /text-\[#E0A526\]/g, replacement: 'text-[var(--color-accent-yellow)]' },
  { regex: /bg-\[#FFFEFB\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#EFE6D3\]/g, replacement: 'bg-slate-100' },
  { regex: /border-\[#3A2E1F\]/g, replacement: 'border-slate-900' },
  { regex: /text-\[var\(--ink\)\]/g, replacement: 'text-slate-900' },
  { regex: /bg-\[var\(--ink\)\]/g, replacement: 'bg-slate-900' },
  { regex: /text-\[var\(--bone\)\]/g, replacement: 'text-slate-50' },
  { regex: /bg-\[var\(--bone\)\]/g, replacement: 'bg-slate-50' },
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
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
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
    console.log('Updated', file);
  }
});
