module.exports = {
  extends: 'google',
  env: {
    browser: false,
    node: true
  },
  parserOptions: { ecmaVersion: 8 },
  rules: {
    'require-jsdoc': 0,
    'max-len': 1,
    'no-multi-str': 0,
    'comma-dangle': 0,
    'object-curly-spacing': 0,
    indent: 0,
    'new-cap': 1
  }
};
