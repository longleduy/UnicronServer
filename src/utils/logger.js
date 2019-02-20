import fs from 'fs'
import * as Common from '../utils/common'

fs.access('src/logs/info.txt', fs.constants.F_OK, (err) => {
    if (err) {
        fs.createWriteStream('src//logs/info.txt')
    }
});
fs.access('src//logs/error.txt', fs.constants.F_OK, (err) => {
    if (err) {
        fs.createWriteStream('src//logs/error.txt')
    }
});
fs.access('src//logs/debug.txt', fs.constants.F_OK, (err) => {
    if (err) {
        fs.createWriteStream('src//logs/debug.txt')
    }
});
export const InforLogger = function (msg) {
    var message = new Date().toISOString() + " : " + msg + "\n";
    fs.appendFile('src//logs/info.txt', message, (err) => { });
};

export const ErrorLogger = function (msg) {
    var message = Common.getFormattedDate(new Date()) + " : " + msg + "\n";
    fs.appendFile('src//logs/error.txt', message, (err) => { });
};
export const DubugLogger = function (msg) {
    var message = new Date().toISOString() + " : " + msg + "\n";
    fs.appendFile('src//logs/debug.txt', message, (err) => { });
};
