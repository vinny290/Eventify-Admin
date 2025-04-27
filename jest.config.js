export const collectCoverage = true;
export const coverageProvider = 'v8';
export const collectCoverageFrom = [
  '**/*.{js,jsx,ts,tsx}',
  '!**/*.d.ts',
  '!**/node_modules/**',
  '!<rootDir>/out/**',
  '!<rootDir>/.next/**',
  '!<rootDir>/*.config.js',
  '!<rootDir>/coverage/**',
];
export const moduleNameMapper = {
  // Handle CSS imports (with CSS modules)
  // https://jestjs.io/docs/webpack#mocking-css-modules
  '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

  // Handle CSS imports (without CSS modules)
  '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

  // Handle image imports
  // https://jestjs.io/docs/webpack#handling-static-assets
  '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': `<rootDir>/__mocks__/fileMock.js`,

  // Handle module aliases
  '^@/components/(.*)$': '<rootDir>/components/$1',

  // Handle @next/font
  '@next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
  // Handle next/font
  'next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
  // Disable server-only
  'server-only': `<rootDir>/__mocks__/empty.js`,
};
export const testPathIgnorePatterns = ['<rootDir>/node_modules/', '<rootDir>/.next/'];
export const testEnvironment = 'jsdom';
export const transform = {
  // Use babel-jest to transpile tests with the next/babel preset
  // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
  '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
};
export const transformIgnorePatterns = [
  '/node_modules/',
  '^.+\\.module\\.(css|sass|scss)$',
];