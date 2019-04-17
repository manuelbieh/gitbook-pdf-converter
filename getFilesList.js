const fs = require('fs-extra');
const markdownLinkExtractor = require('markdown-link-extractor');
const summary = fs.readFileSync(`${__dirname}/content/SUMMARY.md`, {
  encoding: 'utf-8',
});

const ignore = ['README.md'];
const links = markdownLinkExtractor(summary).filter(
  (file) => !ignore.includes(file)
);

console.log(links.join(' '));
