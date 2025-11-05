import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { HealthSnapshot } from '@main/ipc/health'

interface HealthState {
  snapshot: HealthSnapshot | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export const useHealthStatus = (): HealthState => {
  const [snapshot, setSnapshot] = useState<HealthSnapshot | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await window.api.health.check()
      if (response.ok) {
        setSnapshot(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.health'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    void refresh()
    const timer = setInterval(() => {
      void refresh()
    }, 30000)
    return () => clearInterval(timer)
  }, [refresh])

  return { snapshot, loading, error, refresh }
}
