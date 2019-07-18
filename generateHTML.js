const fs = require('fs-extra');
const path = require('path');
const showdown = require('showdown');
const markdownLinkExtractor = require('markdown-link-extractor');
const showdownHighlight = require('showdown-highlight');
const prettier = require('prettier');
require('./lib/gitbookHints');

const converter = new showdown.Converter({
  extensions: ['gitbook-hints', showdownHighlight],
});
converter.setFlavor('github');

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
  // const prettierOptions = prettier.resolveConfig(__dirname + '/.prettierrc');

  const rawFile = prettier.format(
    fs
      .readFileSync(`./content/${filename}`, {
        encoding: 'utf-8',
      })
      // this is to circumvent a Showdown bug:
      // https://github.com/showdownjs/showdown/issues/653
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
    )
    .replace(/..\/.gitbook\/assets/g, './assets/.gitbook');
  // .replace(/<img(.*)alt="(.*)"(.*)>/,'<span><img$1alt="$2"$3><span>$2</span></span>')

  return chapter
    .replace(/{{\s*content\s*}}/, convertedFile)
    .replace(/{{\s*filename\s*}}/, filename);
};

const writeHtml = (filename, html) => {
  fs.mkdirpSync(path.dirname(`./public/${filename}`));
  fs.writeFileSync(
    `./public/${filename.replace(/(.md|.html)$/i, '.html')}`,
    html
  );
};

const combineChapters = () => {
  const combined = ['SUMMARY.md'].concat(links).reduce((acc, filename) => {
    acc += convertFile(filename);
    return acc;
  }, '');

  return layout.replace(/{{\s*content\s*}}/, combined);
};

writeHtml('index.html', combineChapters());

fs.mkdirpSync('./public/assets/.gitbook');
fs.copySync('./content/.gitbook/assets', './public/assets/.gitbook');
fs.copySync('./assets', './public/assets');
