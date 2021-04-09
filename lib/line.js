const chalk = require('chalk');

module.exports = {
  red(string) {
    console.log(chalk.red(string));
  },
  green(string) {
    console.log(chalk.green(string));
  }
}