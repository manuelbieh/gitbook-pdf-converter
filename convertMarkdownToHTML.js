const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const showdown = require('showdown');
const markdownLinkExtractor = require('markdown-link-extractor');
const showdownHighlight = require('showdown-highlight');
const prettier = require('prettier');
const express = require('express');
const puppeteer = require('puppeteer');
require('./lib/gitbook-hints');

const converter = new showdown.Converter({
  extensions: ['gitbook-hints', showdownHighlight],
});
// const converter = new showdown.Converter();
converter.setFlavor('github');

const app = express();
const summary = fs.readFileSync('./content/SUMMARY.md', {
  encoding: 'utf-8',
});

const ignore = ['README.md'];
const links = markdownLinkExtractor(summary).filter(
  (file) => !ignore.includes(file)
);

const layout = fs.readFileSync('./templates/layout.html', {
  encoding: 'utf-8',
});

const chapter = fs.readFileSync('./templates/chapter.html', {
  encoding: 'utf-8',
});

const convertFile = (filename) => {
  const prettierOptions = prettier.resolveConfig(
    __dirname + '/.prettierrc'
  );

  const rawFile = prettier.format(
    fs
      .readFileSync(`./content/${filename}`, {
        encoding: 'utf-8',
      })
      // this is to circumvent a Showdown bug:
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')'),
    {
      printWidth: 80,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
      semi: true,
      arrowParens: 'always',
      parser: 'markdown',
    }
  );

  const convertedFile = converter
    .makeHtml(rawFile)
    .replace(
      /<p>(.*)<img(.*)alt="(.*)"(.*)>(.*)<\/p>/g,
      '<p class="has-image">$1<span><img$2alt="$3"$4><span class="caption">$3</span></span>$5</p>'
    );
  // .replace(/<img(.*)alt="(.*)"(.*)>/,'<span><img$1alt="$2"$3><span>$2</span></span>')

  return chapter.replace('{{content}}', convertedFile);
};

const writeHtml = (filename, html) => {
  mkdirp.sync(path.dirname(`./html/${filename}`));
  fs.writeFileSync(
    `./html/${filename.replace(/(.md|.html)$/i, '.html')}`,
    html
  );
};

const convertAndSave = (filename) => {
  const html = convertFile(filename);
  writeHtml(filename, html);
};

const combineChapters = () => {
  const combined = links.reduce((acc, filename) => {
    acc += convertFile(filename);
    return acc;
  }, '');

  return layout.replace('{{content}}', combined);
};

writeHtml('all.html', combineChapters());
