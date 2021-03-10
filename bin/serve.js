const { spawnSync } = require('child_process')
const { resolve } = require('path')

spawnSync('yarn', ['serve'], {
  shell: true,
  env: {
    ...process.env,
    VUE_CLI_SERVICE_CONFIG_PATH: resolve(__dirname, '../vue.config.js'),
  },
  stdio: 'inherit',
})
