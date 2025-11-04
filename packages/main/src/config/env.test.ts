import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { EnvConfig } from '@main/config/env'

type EnvKey = 'LOG_LEVEL' | 'ENABLE_DEVTOOLS' | 'APP_VERSION' | 'NODE_ENV' | 'npm_package_version'

const resetEnvVar = (key: EnvKey, value: string | undefined): void => {
  if (value === undefined) {
    delete process.env[key]
  } else {
    process.env[key] = value
  }
}

describe('EnvConfig', () => {
  const originalEnv: Record<EnvKey, string | undefined> = {
    LOG_LEVEL: process.env.LOG_LEVEL,
    ENABLE_DEVTOOLS: process.env.ENABLE_DEVTOOLS,
    APP_VERSION: process.env.APP_VERSION,
    NODE_ENV: process.env.NODE_ENV,
    npm_package_version: process.env.npm_package_version
  }

  afterEach(() => {
    (Object.keys(originalEnv) as EnvKey[]).forEach((key) => {
      resetEnvVar(key, originalEnv[key])
    })
  })

  it('reads log level from a custom env file', () => {
    const directory = mkdtempSync(join(tmpdir(), 'env-config-'))
    const path = join(directory, '.env')
    writeFileSync(path, 'LOG_LEVEL=warn')
    resetEnvVar('LOG_LEVEL', undefined)

    try {
      const config = EnvConfig.load(path)
      expect(config.logLevel).toBe('warn')
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('falls back to info for invalid values', () => {
    process.env.LOG_LEVEL = 'unsupported'
    const config = EnvConfig.load(join(tmpdir(), 'missing.env'))
    expect(config.logLevel).toBe('info')
  })

  it('parses ENABLE_DEVTOOLS flag', () => {
    process.env.ENABLE_DEVTOOLS = 'false'
    const config = EnvConfig.load(join(tmpdir(), 'missing.env'))
    expect(config.enableDevtools).toBe(false)
  })

  it('defaults enableDevtools based on NODE_ENV', () => {
    process.env.NODE_ENV = 'production'
    delete process.env.ENABLE_DEVTOOLS
    const config = EnvConfig.load(join(tmpdir(), 'missing.env'))
    expect(config.enableDevtools).toBe(false)
  })

  it('uses APP_VERSION when provided', () => {
    process.env.APP_VERSION = '2.4.6'
    const config = EnvConfig.load(join(tmpdir(), 'missing.env'))
    expect(config.appVersion).toBe('2.4.6')
  })

  it('falls back to npm_package_version when APP_VERSION is missing', () => {
    delete process.env.APP_VERSION
    process.env.npm_package_version = '9.9.9'
    const config = EnvConfig.load(join(tmpdir(), 'missing.env'))
    expect(config.appVersion).toBe('9.9.9')
  })

  it('loads .env.development by default when NODE_ENV=development', () => {
    const directory = mkdtempSync(join(tmpdir(), 'env-config-dev-'))
    const envPath = join(directory, '.env.development')
    writeFileSync(envPath, 'LOG_LEVEL=debug\nENABLE_DEVTOOLS=false\nAPP_VERSION=1.2.3')

    const originalCwd = process.cwd()
    process.chdir(directory)
    process.env.NODE_ENV = 'development'
    delete process.env.LOG_LEVEL

    try {
      const config = EnvConfig.load()
      expect(config.logLevel).toBe('debug')
      expect(config.enableDevtools).toBe(false)
      expect(config.appVersion).toBe('1.2.3')
    } finally {
      process.chdir(originalCwd)
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('prefers .env.production when NODE_ENV=production', () => {
    const directory = mkdtempSync(join(tmpdir(), 'env-config-prod-'))
    writeFileSync(join(directory, '.env.production'), 'ENABLE_DEVTOOLS=false\nAPP_VERSION=4.5.6')
    writeFileSync(join(directory, '.env.development'), 'ENABLE_DEVTOOLS=true\nAPP_VERSION=should-not-be-used')

    const originalCwd = process.cwd()
    process.chdir(directory)
    process.env.NODE_ENV = 'production'
    delete process.env.APP_VERSION

    try {
      const config = EnvConfig.load()
      expect(config.enableDevtools).toBe(false)
      expect(config.appVersion).toBe('4.5.6')
    } finally {
      process.chdir(originalCwd)
      rmSync(directory, { recursive: true, force: true })
    }
  })
})
