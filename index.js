#!/usr/bin/env node

const version = require('./package.json').version;

const program = require('commander');

const createProgramFs = require('./lib/create-program-fs');

const createProject = require('./lib/create-project');

program.version(version, '-v, --version');

program
  .command('init')
  .description('初始化项目')
  .action(() => createProject())

program
  .command('create')
  .description('创建模块或页面')
  .action(() => createProgramFs())

program.parse(process.argv);