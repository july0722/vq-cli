const { spawnSync } = require('child_process')
const { resolve } = require('path')

module.exports = ({ report }) => {
  const args = ['build']
  report && args.push('--report')
  spawnSync('yarn', args, {
    shell: true,
    env: {
      ...process.env,
      VUE_CLI_SERVICE_CONFIG_PATH: resolve(__dirname, '../vue.config.js'),
    },
    stdio: 'inherit',
  })
}
