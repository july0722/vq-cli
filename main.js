#!/usr/bin/env node

const { program } = require('commander')
const { error } = require('./utils')

try {
  program.version('0.0.1')
  program
    .command('serve')
    .description('vue-cli-service serve')
    .action(() => require('./bin/serve'))

  program
    .command('build')
    .description('vue-cli-service build')
    .option('--report', `generate report.html to help analyze bundle content`)
    .action((program) => require('./bin/build')(program))

  program.parse(process.argv)
} catch (e) {
  error(e)
}
