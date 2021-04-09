const inquirer = require('inquirer');
const utils = require('./utils');
const line = require('./line');

const question = [
  {
    type: 'list',
    name: 'mode',
    message: '选择想要创建的模板',
    choices: [
      'route',
      'page-list',
      'default-page',
    ]
  },
  {
    type: 'input',
    name: 'name',
    message: answer => {
      if (answer.mode === 'route') {
        return `设置${answer.mode}名称(e.g:index):`
      }
      return `设置${answer.mode}名称(e.g:index/index-list):`
    }
  }
]

/**
 * 通过xxx创建路由
 * 通过xxx/page创建页面
 */

module.exports = function() {
  inquirer.prompt(question).then(answers => {
    const { name, mode } = answers;

    if (!name) {
      line.red('请输入名称');
      return;
    }

    if (mode === 'route') {
      utils.createRoute(name);
    } else if (mode === 'default-page') {

    } else if (mode === 'page-list') {
      utils.createPageList(name)
    }
  })
}