const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          // ignore node_modules and .git
          if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
            walk(file, (err, res) => {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            if (!--pending) done(null, results);
          }
        } else {
          if (file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.html')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const replaceColors = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace caramel class usages
  content = content.replace(/-caramel\b/g, '-primary');
  content = content.replace(/\bcaramel-/g, 'primary-');
  content = content.replace(/glow-caramel/g, 'glow-primary');
  
  // Replace coffee class usages
  content = content.replace(/-coffee\b/g, '-secondary');
  content = content.replace(/\bcoffee-/g, 'secondary-');
  
  // Replace cream class usages
  content = content.replace(/-cream\b/g, '-background');
  content = content.replace(/\bcream-/g, 'background-');
  
  // Special handling for tailwind config and root index css if needed
  if (filePath.endsWith('tailwind.config.js')) {
    content = content.replace(/caramel:/g, 'primary:');
    content = content.replace(/coffee:/g, 'secondary:');
    content = content.replace(/cream:/g, 'background:');
  }

  // index.css also has specific background replacements
  if (filePath.endsWith('index.css')) {
    content = content.replace(/bg-cream/g, 'bg-background');
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

walk('c:/Users/ppal3/Desktop/Career_coffee - Copy/frontend/src', (err, results) => {
  if (err) throw err;
  results.forEach(replaceColors);
});

// also process tailwind.config.js and index.html
replaceColors('c:/Users/ppal3/Desktop/Career_coffee - Copy/frontend/tailwind.config.js');
try {
  replaceColors('c:/Users/ppal3/Desktop/Career_coffee - Copy/frontend/index.html');
} catch (e) {
  console.log('index.html not found/readable, skipping.');
}
console.log('All done.');
