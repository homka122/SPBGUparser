import fs from 'fs';
import path from 'path';
import HtmlTableToJson from 'html-table-to-json';
import axios from 'axios';

import { links } from './links.js';

// Download HTML file by URL
const getHTMLfromURL = async (url) => {
  return (await axios.get(url)).data.split('\n');
};

// Parse HTML file to HTML file with only Table and its content in inside
const getHTMLTable = (htmlFile) => {
  return htmlFile.filter((row) => {
    const formatRow = row.trim();
    return (
      formatRow.startsWith('<table') ||
      formatRow.startsWith('<thead') ||
      formatRow.startsWith('<tr') ||
      formatRow.startsWith('<td') ||
      formatRow.startsWith('<th') ||
      formatRow.startsWith('</thead') ||
      formatRow.startsWith('</table')
    );
  });
};

// Create a lot of data of students
const main = async () => {
  links.forEach(async (link, id) => {
    const htmlFile = await getHTMLfromURL(link);
    const htmlTable = getHTMLTable(htmlFile);
    const jsonTable = HtmlTableToJson.parse(htmlTable.join('\n')).results;
    fs.writeFileSync(path.resolve(`./src/out/output${id}.json`), JSON.stringify(jsonTable));
  });
};

main();
