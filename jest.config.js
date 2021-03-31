module.exports = {
  preset: './jest/jest.preset.js',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  moduleNameMapper: {
    '.+\\.(png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation|@react-native-picker)"
  ],
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest/jest.setup.js'
  ],
  setupFilesAfterEnv: [
    './jest/jest.setupAfterEnv.ts'
  ],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)']
}
