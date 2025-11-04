import { existsSync } from 'node:fs'
import { join } from 'node:path'
import dotenv from 'dotenv'

import type { Env, LogLevelSetting } from '@main/config/env.types'

/**
 * Encapsulates access to environment configuration, ensuring we only expose
 * sanitized values to the rest of the application.
 */
export class EnvConfig {
  private readonly config: Env

  private constructor(config: Env) {
    this.config = config
  }

  /**
   * Loads environment variables from disk (if present) and returns a typed view.
   */
  static load(envPath?: string): EnvConfig {
    const resolvedPath = EnvConfig.resolveEnvPath(envPath)
    if (resolvedPath) {
      dotenv.config({ path: resolvedPath })
    }
    return new EnvConfig({
      logLevel: EnvConfig.parseLogLevel(process.env.LOG_LEVEL),
      enableDevtools: EnvConfig.parseBoolean(
        process.env.ENABLE_DEVTOOLS,
        process.env.NODE_ENV !== 'production'
      ),
      appVersion: EnvConfig.parseAppVersion(process.env.APP_VERSION)
    })
  }

  /**
   * Provides a read-only snapshot of the parsed environment.
   */
  toObject(): Env {
    return { ...this.config }
  }

  get logLevel(): LogLevelSetting {
    return this.config.logLevel
  }

  get enableDevtools(): boolean {
    return this.config.enableDevtools
  }

  get appVersion(): string {
    return this.config.appVersion
  }

  /**
   * Normalizes the LOG_LEVEL variable to a supported set of values, falling
   * back to "info" when the input is missing or invalid.
   */
  private static parseLogLevel(value?: string): LogLevelSetting {
    const normalized = value?.trim().toLowerCase()
    switch (normalized) {
      case 'debug':
      case 'info':
      case 'warn':
      case 'error':
      case 'silent':
        return normalized
      default:
        return 'info'
    }
  }

  private static parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (value === undefined) {
      return fallback
    }

    const normalized = value.trim().toLowerCase()

    if (['true', '1', 'yes', 'y', 'on'].includes(normalized)) {
      return true
    }

    if (['false', '0', 'no', 'n', 'off'].includes(normalized)) {
      return false
    }

    return fallback
  }

  private static parseAppVersion(value?: string): string {
    const normalized = value?.trim()
    if (normalized) {
      return normalized
    }
    return process.env.npm_package_version ?? '0.0.0-dev'
  }

  private static resolveEnvPath(explicit?: string): string | undefined {
    if (explicit && existsSync(explicit)) {
      return explicit
    }

    const cwd = process.cwd()
    const normalizedEnv = process.env.NODE_ENV?.toLowerCase()

    const candidates: string[] = []
    if (normalizedEnv === 'production') {
      candidates.push(join(cwd, '.env.production'))
    } else if (normalizedEnv === 'development') {
      candidates.push(join(cwd, '.env.development'))
    } else if (normalizedEnv) {
      candidates.push(join(cwd, `.env.${normalizedEnv}`))
      candidates.push(join(cwd, '.env.development'))
    } else {
      candidates.push(join(cwd, '.env.development'))
    }

    candidates.push(join(cwd, '.env'))

    return candidates.find((candidate) => existsSync(candidate))
  }
}

export const env = EnvConfig.load().toObject()
