const files = require('./getFilesList');
const fs = require('fs-extra');
const path = require('path');

files.forEach((file) => {
  const fileContent = fs.readFileSync(file, { encoding: 'utf-8' });
  const newFileContent = fileContent.replace(
    /{% hint style="(\w*?)" %}([\s\S]*?){% endhint %}/g,
    (match, className, content) =>
      `<div class="hint hint--${className}">${content}</div>`
  );
  fs.mkdirpSync(path.dirname(`./tmp/${file}`));
  fs.writeFileSync(`./tmp/${file}`, newFileContent);
});

fs.copySync('./content/SUMMARY.md', './tmp/content/SUMMARY.md');
