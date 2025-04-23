const path = require('path');
const pak = require('../package.json');

module.exports = {
  dependencies: {
    [pak.name]: {
      root: path.join(__dirname, '..'),
    },
  },
  project: {
    reactNativePath: './node_modules/react-native',
    android: {
      packageName: 'com.videoeditorreactnativeexample', 
    },
    ios: {},
  },
};
