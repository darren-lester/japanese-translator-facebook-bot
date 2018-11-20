module.exports = {
  extends: "google",
  env: {
    browser: false,
    node: true
  },
  parserOptions: { ecmaVersion: 6 },
  rules: {
    "require-jsdoc": 0,
    "max-len": 1,
    "no-multi-str": 0
  }
};
