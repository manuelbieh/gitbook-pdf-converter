const fs = require('fs');
const express = require('express');
const puppeteer = require('puppeteer');
const dateTime = require('./lib/getTheFuckingTime');
// require('./lib/gitbookHints');

const app = express();

// app.use(express.static('content'));
app.use(express.static('public'));
// app.use('/.gitbook', express.static('assets/.gitbook'));
// app.use('/assets', express.static('assets'));

const server = app.listen(3000, () => {
  console.log('SERVER LISTENING ON http://localhost:3000');
  (async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();
      const footer = fs.readFileSync('./templates/footer.html').toString();
      await page.goto('http://localhost:3000/index.html', {
        waitUntil: 'networkidle0',
      });
      // Working:
      await page.pdf({
        path: `./dist/react-lernen-${dateTime}.pdf`,
        // format: 'A4',
        width: '17cm',
        height: '24cm',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: footer,
      });

      // Experimental:
      // await page.pdf({
      //   path: 'printed.pdf',
      //   // width: '17cm',
      //   // height: '24cm',
      //   printBackground: true,
      //   preferCSSPageSize: true,
      // });
      await browser.close();
      server.close();
    } catch (error) {
      console.log(error);
      browser.close();
      server.close();
      process.exit(1);
    }
  })();
});
