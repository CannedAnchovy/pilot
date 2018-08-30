import CsvReader from './CsvReader';
import Trie from './Trie.js';
import fs from 'fs';
import util from 'util';

let writeFile = util.promisify(fs.writeFile);

/**
 * main function
 */
export default async function main() {
  // read csv file
  let csvReader = new CsvReader();
  let directors = await csvReader.readCsv('data/DirectorCEO_v2_NNDB.csv', '\r\n');
  let pilots = await csvReader.readCsv('data/PILOT_BASIC.csv', ',\r\n');

  // insert pilot data into trie
  let trie = new Trie();
  for (let i=0; i<pilots.length; i++) {
    const pilot = pilots[i];
    const firstNames = pilot.FIRSTNAME.split(' ');
    console.log(pilot.UNIQUEID);
    trie.insert(firstNames[0].trim(), {
      firstName: firstNames[0].toLowerCase().trim(),
      middleName: (firstNames[1] === undefined)? '' : firstNames[1].toLowerCase().trim(),
      lastName: pilot.LASTNAME.toLowerCase().trim(),
      uiqueId: pilot.UNIQUEID,
    });
  }

  for (let i=0; i<directors.length; i++) {
    console.log(i);
    const director = directors[i];
    director.isPilot = false;
    director.hasMiddleName = false;

    // leave the one that has middle name
    if (director.firstname_1.trim().includes(' ')) {
      director.hasMiddleName = true;
      let names = director.firstName.trim().split(' ');
      director.firstname_1 = names[0];
      director.middlename = names[1];
    }

    // leave the one that is pilot
    if (trie.contains(director.firstname_1.trim())) {
      const value = trie.find(director.firstname_1.trim());
      console.log(director.firstname_1);
      for (let j=0; j<value.length; j++) {
        if (director.surname_1.trim().toLowerCase() === value[j].lastName) {
          director.isPilot = true;
          director.pilotId = value[j].uiqueId;

          console.log(director.pilotId);
          continue;
        }
      }
    }
  }

  // write result to csv
  let output = '';

  for (let i=0; i<directors.length; i++) {
    const director = directors[i];

    // filter those need not to be record
    if (!director.isPilot && !director.hasMiddleName) continue;

    let string = '';

    // because excel csv has three strange character at the start of the file
    // so we cannot access the first attribute of directors
    for (let prop in director) {
      if (prop.includes('directorid')) {
        string += director[prop];
        string += ',';
        break;
      }
    }

    string += director.firstname_1;
    string += ',';
    string += director.surname_1;
    string += ',';
    string += director.directorname;
    string += ',';
    string += director.pilotId;
    string += '\n';

    output += string;
  }

  await writeFile('data/director-pilot', JSON.stringify(directors, null, 2));
  await writeFile('data/director-pilot.csv', output);
}
