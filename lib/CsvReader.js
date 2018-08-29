'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CsvReader;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var readFile = _util2.default.promisify(_fs2.default.readFile);

/**
 * constructor of CsvReader
 * @constructor
 */
function CsvReader() {
  this.setting = {};
}

CsvReader.prototype.readCsv = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fileName, delimiter) {
    var array, data, lines, header, i, _i, obj, j;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('CsvReader: Reading file ' + fileName + '...');
            array = [];
            _context.prev = 2;
            _context.next = 5;
            return readFile(fileName, 'utf-8');

          case 5:
            data = _context.sent;


            console.log('CsvReader: Converting data into objects...');

            lines = data.split(delimiter);

            // some csv format will have \n at the end of file, if so, erase it

            if (lines[lines.length - 1] === '') lines.splice(lines.length - 1, 1);

            lines = lines.map(function (line) {
              return line.split(',');
            });

            // parse line into array of objects
            header = lines[0];

            for (i = 0; i < header.length; i++) {
              header[i] = getPropertyString(header[i]);
            }

            // skip the header line
            for (_i = 1; _i < lines.length; _i++) {
              obj = {};


              for (j = 0; j < header.length; j++) {
                obj[header[j]] = lines[_i][j];
              }

              array.push(obj);
            }
            console.log('CsvReader: Finish reading csv file.');
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](2);

            console.error(_context.t0);

          case 19:
            return _context.abrupt('return', array);

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 16]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * convert string that has ' ' into camelcase
 * @param {string} string input string
 * @return {string} string that is camelcase
 */
function getPropertyString(string) {
  var array = string.split(' ');
  string = array[0];

  for (var i = 1; i < array.length; i++) {
    string += array[i].slice(0, 1).toUpperCase() + array[i].slice(1);
  }

  return string;
}