// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: ['airbnb-base'],
  rules: {
    'no-use-before-define': ['error', { functions: false }],
  },
};
