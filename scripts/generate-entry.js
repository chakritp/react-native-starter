const fs = require('fs')
const path = require('path')

const IMPORT_PATHS = {
  app: './src/App',
  cosmos: './src/cosmos/App'
}

const entryPath = path.resolve(__dirname, '../entry.js')
const arg = (process.argv[2] || '').trim()

if (arg && arg !== '--switch') {
  writeEntryFile(arg)
} else if (!fs.existsSync(entryPath)) {
  writeEntryFile('app')
} else if (arg === '--switch') {
  // Switch entry file.
  const entryFile = fs.readFileSync(entryPath)
  writeEntryFile(entryFile.indexOf(IMPORT_PATHS.app) > -1 ? 'cosmos' : 'app')
}

function writeEntryFile(entry) {
  const importPath = IMPORT_PATHS[entry]
  fs.writeFileSync(entryPath, `export * from '${importPath}'\n`)
}

process.exit(0)
