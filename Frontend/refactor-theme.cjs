const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/bg-\[\#0B0F14\]/g, 'bg-bg-base');
  content = content.replace(/bg-\[\#121821\]/g, 'bg-bg-card');
  content = content.replace(/bg-\[\#0F172A\]/g, 'bg-bg-card');
  content = content.replace(/border-\[\#1F2937\]/g, 'border-border-dark');
  content = content.replace(/text-\[\#E5E7EB\]/g, 'text-text-primary');
  content = content.replace(/text-\[\#9CA3AF\]/g, 'text-text-secondary');
  
  if (original !== content) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log(`Refactored ${file}`);
  }
});

console.log(`Successfully refactored ${changedFiles} files!`);
