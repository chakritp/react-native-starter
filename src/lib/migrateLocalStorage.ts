import LocalStorage from './LocalStorage'

export default async function migrateLocalStorage(config: {
  storage: LocalStorage,
  versionKey?: string,
  version: string,
  migrations: { [key: string]: (storage: LocalStorage) => Promise<void> }
}) {
  const { storage, versionKey = '_version', version, migrations } = config
  const { log } = console
  if (!migrations) return

  let currentVersion = await storage.get(versionKey).catch(log)

  if (currentVersion == null) {
    await storage.set(versionKey, version)
    return
  } else if (currentVersion === version) {
    return
  }

  const versions = Object.keys(migrations)
    .sort()
    .reduce((acc, migrationVersion) => {
      if (migrationVersion >= currentVersion) {
        acc.push(migrationVersion)
      }
      return acc
    }, [] as string[])

  if (!versions.length) return

  const runNextMigration = async (): Promise<void> => {
    const version = versions.shift()
    const migration = config.migrations[version!]

    log("Migrating to local storage version", version)
    await migration(storage)
    await storage.set(versionKey, version)

    if (versions.length) {
      return runNextMigration()
    }
  }

  await runNextMigration()
}
