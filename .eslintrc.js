module.exports = {
  root: true,
  extends: 'standard',
  rules: {
    semi: [2, 'never'] // 2 - error level
  },
  globals: {
    IS_DEVELOPMENT: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2020
  }
}
