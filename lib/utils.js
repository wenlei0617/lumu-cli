const fs = require('fs');
const path = require('path');
const line = require('./line');

String.prototype.render = function (context, mock = false) {
  const tokenReg = /(\\)?\${([^\{\}\\]+)(\\)?\}/g;

  const strArr = this.split('|');

  if (mock && strArr[1]) {
    return strArr[1];
  }

  return strArr[0].replace(tokenReg, (word, slash1, token, slash2) => {
    if (slash1 || slash2) {
      return word.replace('\\', '');
    }

    let variables = token.replace(/\s/g, '').split('.');
    let currentObject = context;
    let i, length, variable;

    for (i = 0, length = variables.length, variable = variables[i]; i < length; ++i) {
      currentObject = currentObject[variable];
      if (currentObject === undefined || currentObject === null) return '';
    }

    return currentObject;
  })
}

const templatePath = (name) => {
  return path.join(__dirname, '../template/', name);
}

const writePath = (name) => {
  return path.join(process.cwd(), './src/views', name);
}

module.exports = {
  toUpperCaseFirst(str) {
    let words = str.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ");
  },
  getTemplateName(mode) {
    const map = {
      'route': 'template-routes',
      'default-page': 'template-page',
      'page-list': 'template-page-list'
    };
    return map[mode];
  },
  readFs(mode) {
    return fs.readFileSync(templatePath(this.getTemplateName(mode)), { encoding: 'utf-8' });
  },
  createRoute(module) {
    const fileData = this.readFs('route');
    const modulePath = writePath(module);
    const routePath = writePath(`${module}/${module}-routes.tsx`);
    const interfacePath = writePath(`${module}/${module}-interface.ts`);
    const isModuleExists = fs.existsSync(modulePath);
    const isRouteExists = fs.existsSync(routePath);

    if (!isModuleExists) {
      fs.mkdirSync(modulePath);
    }
    if (!isRouteExists) {
      fs.writeFileSync(routePath, fileData.render({ template: module }))
      fs.writeFileSync(interfacePath, '');
      line.green('????????????');
    } else {
      line.red('?????????????????????');
    }
  },
  createPageList(pagePath) {
    const [module, page] = pagePath.split('/');
    const modulePath = writePath(module);
    const cate = writePath(pagePath);

    if (!fs.existsSync(modulePath)) {
      line.red('????????????????????????????????????????????????');
      return;
    }

    if (!page) {
      line.red('???????????????????????????xxx/xxx');
      return;
    }

    if (fs.existsSync(cate)) {
      line.red('?????????????????????');
      return;
    }
    const fileData = this.readFs('page-list');

    fs.mkdirSync(cate);

    const pageName = page.split('-');
    let upperCase = '';

    pageName.forEach((item) => {
      upperCase+=this.toUpperCaseFirst(item);
    })

    fs.writeFileSync(
      writePath(pagePath + '/' + page + '.tsx'),
      fileData.render({ template: upperCase })
    )

    line.green('????????????');
  },
}