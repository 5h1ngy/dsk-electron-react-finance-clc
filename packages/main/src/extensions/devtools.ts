import { app, session } from 'electron'
import { join } from 'node:path'
import { access } from 'node:fs/promises'

import { logger } from '@main/config/logger'
import { env } from '@main/config/env'

const REDUX_DEVTOOLS_DIR = join(app.getAppPath(), 'extensions', 'redux-devtools')

const isExtensionLoaded = (extensionId: string): boolean => {
  const extensions = session.defaultSession.getAllExtensions?.()
  if (!extensions) {
    return false
  }
  return Object.values(extensions).some((extension) => extension.id === extensionId)
}

export const loadReduxDevtoolsExtension = async (): Promise<void> => {
  if (!env.enableDevtools) {
    logger.debug('Skipping devtools extension loading (ENABLE_DEVTOOLS disabled)', 'Devtools')
    return
  }

  if (app.isPackaged) {
    return
  }

  try {
    await access(REDUX_DEVTOOLS_DIR)

    const reduxId = 'lmhkpmbekcpmknklioeibfkpmmfibljd'
    if (isExtensionLoaded(reduxId)) {
      logger.debug('Redux DevTools extension already loaded', 'Devtools')
      return
    }

    const extension = await session.defaultSession.loadExtension(REDUX_DEVTOOLS_DIR, {
      allowFileAccess: true
    })
    logger.success(`Loaded devtools extension: ${extension.name}`, 'Devtools')
  } catch (error) {
    logger.warn('Unable to load Redux DevTools extension', 'Devtools')
    logger.debug(
      error instanceof Error ? error.message : String(error),
      'Devtools'
    )
  }
}
