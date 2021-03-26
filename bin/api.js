const http = require('http')
const prettier = require('prettier')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
// const vueConfig = require(`../../gz-parent/${project}/vue.config.js`)
// const { target } = vueConfig.devServer.proxy[`/${code}-app`]
const target = 'http://192.172.1.142:8082/zfcg'
const { prefixFilter, custom } = require(path.resolve(process.cwd(), 'config.js')).api

http
  .get(`${target}/v2/api-docs`, response => {
    let data = ''
    response.on('data', chunk => (data += chunk))
    response.on('end', () => {
      data = JSON.parse(data)
      const { VUE_APP_SYSTEM } = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env')))
      const apis = Object.keys(data.paths)
        .filter(
          key =>
            !['api', 'common', 'commonlogin', 'base-enum', 'log-file', 'history', 'customary-approval']
              .concat(prefixFilter)
              .includes(key.split('/')[1])
        )
        .reduce((api, item) => {
          if (item.includes('{')) {
            return api
          }
          const key = item.split('/')[1]
          const value = data.paths[item]
          const isGET = !!value.get

          api[key] ||
            (api[key] = {
              tag: (value.get || value.post).tags.join(' '),
              children: {},
            })
          api[key].children[item] = {
            function: `data => ajax('/${VUE_APP_SYSTEM}-app/${VUE_APP_SYSTEM}${item}', data, '${
              value.post ? 'POST' : 'GET'
            }'${
              value.get
                ? ')'
                : `, '${
                    isGET ? '' : !value.post.parameters ? '' : value.post.parameters[0].in === 'query' ? 'FORM' : 'JSON'
                  }')`
            }`,
            note: (value.get || value.post).summary,
            tag: (value.get || value.post).tags.join(' '),
          }
          if (custom[item]) {
            const _index = api[key].children[item].function.lastIndexOf(')')
            const _function = api[key].children[item].function
            api[key].children[item].function = `${_function.slice(0, _index)}, ${JSON.stringify(
              custom[item]
            )}${_function.slice(_index)}`
          }
          return api
        }, {})
      Object.keys(apis).forEach(key => {
        let text = `import { ajax }  from '@api'\n\n/**\n * ${apis[key].tag}\n */\nexport default {\n`
        Object.keys(apis[key].children).forEach(item => {
          text += `// ${apis[key].children[item].note}\n${item
            .replace(`/${key}/`, '')
            .replace(/\//gi, '-')
            .replace(/-(\w)/g, (all, letter) => letter.toUpperCase())}: ${apis[key].children[item].function},\n`
        })
        text += '}'
        fs.writeFileSync(
          path.join(process.cwd(), `/src/api/${key}.js`),
          prettier.format(text, {
            singleQuote: true,
            semi: false,
            trailingComma: 'none',
            parser: 'babel',
            printWidth: 999,
          })
        )
        console.log(chalk.green(`${key}（${apis[key].tag}）`))
      })
      console.log(chalk.bgGreen(Object.keys(apis).length))
    })
  })
  .on('error', error => console.log(chalk.red('Error: ' + error.message)))
