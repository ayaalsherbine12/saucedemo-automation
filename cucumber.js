module.exports = {
  default: {
    require: ['step-definitions/**/*.ts', 'hooks/**/*.ts', 'support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress', 'allure-cucumberjs/reporter'],
    formatOptions: {
      resultsDir: 'allure-results',
    },
    paths: ['features/**/*.feature'],
  },
};