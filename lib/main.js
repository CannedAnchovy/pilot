'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CsvReader = require('./CsvReader');

var _CsvReader2 = _interopRequireDefault(_CsvReader);

var _Trie = require('./Trie.js');

var _Trie2 = _interopRequireDefault(_Trie);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var writeFile = _util2.default.promisify(_fs2.default.writeFile);

/**
 * main function
 */

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var csvReader, directors, pilots, trie, i, pilot, firstNames, _i, director, value, j, output, _i2, _director, string, prop;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // read csv file
            csvReader = new _CsvReader2.default();
            _context.next = 3;
            return csvReader.readCsv('data/DirectorCEO_v2_NNDB.csv', '\r\n');

          case 3:
            directors = _context.sent;
            _context.next = 6;
            return csvReader.readCsv('data/PILOT_BASIC.csv', ',\r\n');

          case 6:
            pilots = _context.sent;


            // insert pilot data into trie
            trie = new _Trie2.default();

            for (i = 0; i < pilots.length; i++) {
              pilot = pilots[i];
              firstNames = pilot.FIRSTNAME.split(' ');

              console.log(pilot.UNIQUEID);
              trie.insert(firstNames[0].trim(), {
                firstName: firstNames[0].toLowerCase().trim(),
                middleName: firstNames[1] === undefined ? '' : firstNames[1].toLowerCase().trim(),
                lastName: pilot.LASTNAME.toLowerCase().trim(),
                uiqueId: pilot.UNIQUEID
              });
            }

            _i = 0;

          case 10:
            if (!(_i < directors.length)) {
              _context.next = 34;
              break;
            }

            console.log(_i);
            director = directors[_i];

            director.isPilot = false;
            director.hasMiddleName = false;

            // leave the one that has middle name

            if (!director.firstname_1.trim().includes(' ')) {
              _context.next = 18;
              break;
            }

            director.hasMiddleName = true;
            return _context.abrupt('continue', 31);

          case 18:
            if (!trie.contains(director.firstname_1.trim())) {
              _context.next = 31;
              break;
            }

            value = trie.find(director.firstname_1.trim());

            console.log(director.firstname_1);
            j = 0;

          case 22:
            if (!(j < value.length)) {
              _context.next = 31;
              break;
            }

            if (!(director.surname_1.trim().toLowerCase() === value[j].lastName)) {
              _context.next = 28;
              break;
            }

            director.isPilot = true;
            director.pilotId = value[j].uiqueId;

            console.log(director.pilotId);
            return _context.abrupt('continue', 28);

          case 28:
            j++;
            _context.next = 22;
            break;

          case 31:
            _i++;
            _context.next = 10;
            break;

          case 34:

            // write result to csv
            output = '';
            _i2 = 0;

          case 36:
            if (!(_i2 < directors.length)) {
              _context.next = 62;
              break;
            }

            _director = directors[_i2];

            // filter those need not to be record

            if (!(!_director.isPilot && !_director.hasMiddleName)) {
              _context.next = 40;
              break;
            }

            return _context.abrupt('continue', 59);

          case 40:
            string = '';

            // because excel csv has three strange character at the start of the file
            // so we cannot access the first attribute of directors

            _context.t0 = regeneratorRuntime.keys(_director);

          case 42:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 50;
              break;
            }

            prop = _context.t1.value;

            if (!prop.includes('directorid')) {
              _context.next = 48;
              break;
            }

            string += _director[prop];
            string += ',';
            return _context.abrupt('break', 50);

          case 48:
            _context.next = 42;
            break;

          case 50:

            string += _director.firstname_1;
            string += ',';
            string += _director.surname_1;
            string += ',';
            string += _director.directorname;
            string += ',';
            string += _director.pilotId;
            string += '\n';

            output += string;

          case 59:
            _i2++;
            _context.next = 36;
            break;

          case 62:
            _context.next = 64;
            return writeFile('data/director-pilot', JSON.stringify(directors, null, 2));

          case 64:
            _context.next = 66;
            return writeFile('data/director-pilot.csv', output);

          case 66:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function main() {
    return _ref.apply(this, arguments);
  }

  return main;
}();