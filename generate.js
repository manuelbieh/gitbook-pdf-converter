const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const showdown = require('showdown');
const markdownLinkExtractor = require('markdown-link-extractor');
const express = require('express');
const puppeteer = require('puppeteer');
require('./lib/gitbook-hints');

// const converter = new showdown.Converter({ extensions: ['gitbook-hints'] });
// // const converter = new showdown.Converter();
// converter.setFlavor('github');

const app = express();
// const summary = fs.readFileSync('./content/SUMMARY.md', { encoding: 'utf-8' });
//
// const ignore = ['README.md'];
// const links = markdownLinkExtractor(summary).filter(
//     (file) => !ignore.includes(file)
// );
//
// const layout = fs.readFileSync('./templates/layout.html', {
//     encoding: 'utf-8',
// });
//
// const chapter = fs.readFileSync('./templates/chapter.html', {
//     encoding: 'utf-8',
// });
//
// const convertFile = (filename) => {
//     const file = fs.readFileSync(`./content/${filename}`, {
//         encoding: 'utf-8',
//     });
//     return chapter.replace('{{content}}', converter.makeHtml(file));
// };
//
// const writeHtml = (filename, html) => {
//     mkdirp.sync(path.dirname(`./html/${filename}`));
//     fs.writeFileSync(
//         `./html/${filename.replace(/(.md|.html)$/i, '.html')}`,
//         html
//     );
// };
//
// const convertAndSave = (filename) => {
//     const html = convertFile(filename);
//     writeHtml(filename, html);
//     // mkdirp.sync(path.dirname(`./html/${filename}`));
//     // fs.writeFileSync(`./html/${filename.replace(/.md$/i, '.html')}`, html);
// };
//
// const combineChapters = () => {
//     const combined = links.reduce((acc, filename) => {
//         acc += convertFile(filename);
//         return acc;
//     }, '');
//
//     return layout.replace('{{content}}', combined);
// };
//
// writeHtml('all.html', combineChapters());
//
// // links.forEach(convertAndSave);
// // const layout = fs.readFileSync('./templates/layout.html', {
// //     encoding: 'utf-8',
// // });
// // const text = fs.readFileSync('./test.md', { encoding: 'utf-8' });

app.use(express.static('content'));
app.use(express.static('html'));
app.use('/.gitbook', express.static('assets/.gitbook'));
app.use('/assets', express.static('assets'));

const server = app.listen(3000, () => {
  console.log('SERVER LISTENING ON http://localhost:3000');
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.setContent(layout.replace('{{content}}', marked));
    await page.goto('http://localhost:3000/all.html', {
      waitUntil: 'load',
    });

    await page.pdf({
      path: 'printed.pdf',
      // format: 'A4',
      format: 'A5',
      printBackground: true,
      // margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
    });

    await browser.close();
    server.close();
  })();
});

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(layout.replace('{{content}}', marked));
//
//     await page.pdf({ path: 'printed.pdf', format: 'A4' });
//
//     await browser.close();
// })();
