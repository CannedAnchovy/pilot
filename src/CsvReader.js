import fs from 'fs';
import util from 'util';

let readFile = util.promisify(fs.readFile);

/**
 * constructor of CsvReader
 * @constructor
 */
export default function CsvReader() {
  this.setting = {};
}

CsvReader.prototype.readCsv = async function(fileName, delimiter) {
  console.log('CsvReader: Reading file ' + fileName + '...');
  let array = [];

  try {
    // read csv file and split it into lines
    let data = await readFile(fileName, 'utf-8');

    console.log('CsvReader: Converting data into objects...');

    let lines = data.split(delimiter);

    // some csv format will have \n at the end of file, if so, erase it
    if (lines[lines.length - 1] === '') lines.splice(lines.length - 1, 1);

    lines = lines.map((line) => line.split(','));

    // parse line into array of objects
    let header = lines[0];
    for (let i=0; i<header.length; i++) {
      header[i] = getPropertyString(header[i]);
    }

    // skip the header line
    for (let i=1; i<lines.length; i++) {
      let obj = {};

      for (let j=0; j<header.length; j++) {
        obj[header[j]] = lines[i][j];
      }

      array.push(obj);
    }
    console.log('CsvReader: Finish reading csv file.');
  } catch (err) {
    console.error(err);
  }
  return array;
};

/**
 * convert string that has ' ' into camelcase
 * @param {string} string input string
 * @return {string} string that is camelcase
 */
function getPropertyString(string) {
  let array = string.split(' ');
  string = array[0];

  for (let i=1; i<array.length; i++) {
    string += (array[i].slice(0, 1).toUpperCase() + array[i].slice(1));
  }

  return string;
}
