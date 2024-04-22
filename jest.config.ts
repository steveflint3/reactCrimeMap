export { };
/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  automock: false,
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['src/components/*/*.tsx', 'src/components/*/*.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-leaflet)/',
    '/node_modules/(?!leaflet)/'
  ],
  globals: {
    'ts-jest': {
      babelconfig: '<rootDir>/babel.config.json',
      tsconfig: '<rootDir>/tsconfig.json',
      esModuleInterop: true
    }
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  }
};