const argv = require('minimist')(process.argv.slice(2))
const { spawn } = require('child_process')
const upperFirst = require('lodash/upperFirst')

const RN_CLI_PATH = 'node_modules/.bin/react-native'

async function run() {
  const platform = argv._[0]
  const env = argv.env || 'local'
  const buildType = argv.release ? 'Release' : 'Debug'

  if (!['ios', 'android'].includes(platform)) {
    throw new Error(`Unsupported platform '${platform}'`)
  }

  if (argv.release) {
    // Force entry file to app when building in release mode.
    await spawnAsync('node', ['scripts/generate-entry', 'app'])
  } else {
    await spawnAsync('node', ['scripts/generate-entry'])
  }

  if (platform === 'ios') {
    const scheme = upperFirst(env)
    const args = ['run-ios', `--scheme=${scheme}`, `--configuration=${scheme}.${buildType}`]
    if (argv.device) {
      args.push(`--device=${argv.device}`)
    }
    if (argv.simulator) {
      args.push(`--simulator=${argv.simulator}`)
    }
    await spawnAsync('node', [RN_CLI_PATH, ...args])
  } else {
    await spawnAsync('node', [RN_CLI_PATH, 'run-android', `--variant=${env}${buildType}`])
  }
}

async function spawnAsync(command, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args, { stdio: 'inherit' })
    p.on('error', reject)
    p.on('close', code => code !== 0 ? reject() : resolve())
  })
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    if (err) console.error(err.message)
    process.exit(1)
  })
