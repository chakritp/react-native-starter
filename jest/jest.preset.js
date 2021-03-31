const reactNativePreset = require('react-native/jest-preset')

module.exports = {
  ...reactNativePreset,
  setupFiles: [
    require.resolve('./jest.setupInitial.js'),
    ...reactNativePreset.setupFiles
  ]
}
