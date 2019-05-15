const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');
const { execSync } = require('child_process');
const files = require('./lib/getFilesList');
const dateTime = require('./lib/getTheFuckingTime');

// Delete old temp files
rimraf.sync(`${__dirname}/../tmp`);

// Replace custom markdown blocks with HTML
files.forEach((file) => {
  const fileContent = fs.readFileSync(file, { encoding: 'utf-8' });
  const relativePath = path.relative(`${__dirname}/content`, file);

  const keepHeadlineLevel =
    file.includes('README') || !relativePath.includes(path.sep);

  const newFileContent = fileContent
    .replace(
      /{% hint style="(\w*?)" %}([\s\S]*?){% endhint %}/g,
      (match, className, content) =>
        `<div class="hint hint--${className}">${content}</div>`
    )
    .replace(/^#/gm, keepHeadlineLevel ? '#' : '##')
    .replace(/\[@([\w|\\]*)\]/g, (match, handle) => {
      return `[\\@${handle.replace(/\\*/g, '')}]`;
    });

  fs.mkdirpSync(path.dirname(`./tmp/${file}`));
  fs.writeFileSync(`./tmp/${file}`, newFileContent);
});

fs.copySync(
  `${__dirname}/content/SUMMARY.md`,
  `${__dirname}/tmp/content/SUMMARY.md`
);

// Use prepared files:
const preparedFiles = files.map((file) =>
  file.replace('content', 'tmp/content')
);

// Generate the ePub file
execSync(
  `pandoc ${preparedFiles.join(
    ' '
  )} -o "./dist/react-lernen-${dateTime}.docx" --metadata title="React lernen und verstehen" --metadata author="Manuel Bieh" --epub-cover-image="./assets/react_book_cover-front-1000.png" --toc --toc-depth=2 --css="./assets/epub.css" --resource-path="content/.gitbook:|cross-platform-hack|;content/.gitbook"`,
  (err) => {
    console.log(err);
  }
);

// Cleanup
rimraf.sync(`${__dirname}/tmp`);
