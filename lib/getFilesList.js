const path = require('path');
const fs = require('fs-extra');
const markdownLinkExtractor = require('markdown-link-extractor');
const summary = fs.readFileSync(`${__dirname}/../content/SUMMARY.md`, {
  encoding: 'utf-8',
});

const ignore = ['README.md'];
const links = markdownLinkExtractor(summary)
  .filter((file) => !ignore.includes(file))
  .map((file) =>
    path.relative(process.cwd(), `${__dirname}/../content/${file}`)
  );

// const links = markdownLinkExtractor(summary).filter(
//   (file) => !ignore.includes(file)
// );

module.exports = links;
