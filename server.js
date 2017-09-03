const assert = require('assert');
const DashButton = require('dash-button');
const debug = require('debug')('find-my-iphone-button');
const process = require('process');

const icloud = require('./icloud');

function start() {
  assert(
    process.env.DASH_BUTTON_MAC_ADDRESS,
    `The DASH_BUTTON_MAC_ADDRESS environment variable must be set. Run \`sudo npm run scan\` and press the Dash Button to get its MAC address.`
  );

  const button = new DashButton(process.env.DASH_BUTTON_MAC_ADDRESS);
  if (!process.env.IOS_DEVICE_ID) {
    console.warn(
      `The IOS_DEVICE_ID environment variable must be set. Press the Dash Button to log into iCloud and print all of your registered Apple devices.`
    );
  }

  button.addListener(async () => {
    debug(`Received a Dash Button press`);
    if (process.env.IOS_DEVICE_ID) {
      // The iCloud library we use is initialized by getting the devices
      await icloud.getDevicesAsync();
      const { body } = await icloud.playSoundAsync(process.env.IOS_DEVICE_ID);
      if (body.statusCode === '200') {
        debug(`Played a sound on the device`);
      } else {
        debug(`Error playing a sound on the device:`, body);
      }
    } else {
      const devices = await icloud.getDevicesAsync();
      for (const device of devices) {
        console.log(`${device.deviceDisplayName} (${device.name})`);
        console.log(`  ID: ${device.id}`);
      }
    }
  });
  debug(`Listening for Dash Button presses`);
}

if (module === require.main) {
  start();
}
