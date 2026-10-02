const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') walk(full, fileList);
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const files = walk('./src');
const imageUsage = {};
const regex = /['"`](\/images\/[^'"`]+\.(?:jpg|png|webp|jpeg))['"`]/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const img = match[1];
    if (!imageUsage[img]) imageUsage[img] = [];
    imageUsage[img].push(file);
  }
}

console.log('Total unique images referenced:', Object.keys(imageUsage).length);
let missing = 0;
const missingList = [];
const reusedList = [];

for (const img of Object.keys(imageUsage).sort()) {
  const diskPath = path.join('./public', img);
  const exists = fs.existsSync(diskPath);
  const count = imageUsage[img].length;
  if (!exists) {
    missing++;
    missingList.push({ img, count, files: [...new Set(imageUsage[img])] });
  } else if (count > 2) {
    reusedList.push({ img, count, files: [...new Set(imageUsage[img])] });
  }
}

console.log('\n--- MISSING IMAGES (' + missing + ') ---');
missingList.forEach(m => console.log(`${m.img} (${m.count} refs in ${m.files.join(', ')})`));

console.log('\n--- HEAVILY REUSED IMAGES (' + reusedList.length + ') ---');
reusedList.forEach(r => console.log(`${r.img} (${r.count} refs in ${r.files.join(', ')})`));
