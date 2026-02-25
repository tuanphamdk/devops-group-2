module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 30000,  // Increased timeout for real database operations
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
