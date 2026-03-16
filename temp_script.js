const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\junki\\Downloads\\leaders-ai-labs-v6.jsx', 'utf8');
fs.writeFileSync('src/app/page.js', '"use client";\n' + content);
