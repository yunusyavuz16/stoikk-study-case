module.exports = {
  root: true,
  extends: '@react-native',
  env: {
    jest: true,
  },
  ignorePatterns: ['coverage/**'],
  overrides: [
    {
      files: ['jest.setup.js'],
      env: {
        jest: true,
        node: true,
      },
    },
  ],
};
