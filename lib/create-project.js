const inquirer = require('inquirer');
const { exec } = require('child_process');
const line = require('./line');

const question = [
  {
    type: 'list',
    name: 'mode',
    message: '请选择想要创建的项目类型',
    choices: [
      'PC', 'H5'
    ]
  },
  {
    type: 'input',
    name: 'name',
    message: () => `设置项目名称(default:react-template):`
  }
];

module.exports = function() {
  inquirer.prompt(question).then(answers => {
    const { mode, name } = answers;

    if (mode === 'PC') {
      exec(`git clone -b pc https://github.com/wenlei0617/react-template.git ${name}`, (error) => {
        if (error) {
          line.red('下载模板失败')
          process.exit();
        } else {
          line.green('初始化成功')
          line.green(`cd ${name || 'react-template'}`);
          line.green('执行 yarn 安装node_modules');
          line.green('执行 yarn start 启动项目');
        }
      })
    } else {
      line.red('暂不支持')
      // exec(`git clone -b pc https://github.com/wenlei0617/react-template.git`)
    }
  })
}