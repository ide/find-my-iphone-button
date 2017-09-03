const assert = require('assert');
const { findmyphone } = require('find-my-iphone');
const process = require('process');
const util = require('util');

assert(process.env.APPLE_ID, `The APPLE_ID environment variable must be set`);
assert(process.env.APPLE_PASSWORD, `The APPLE_PASSWORD environment variable must be set`);
findmyphone.apple_id = process.env.APPLE_ID;
findmyphone.password = process.env.APPLE_PASSWORD;

exports.getDevicesAsync = util.promisify(findmyphone.getDevices);
exports.playSoundAsync = util.promisify(findmyphone.alertDevice);
