import { type CSSProperties, useCallback, useEffect, useState } from 'react'
import { App as AntdApp, Button, Card, ConfigProvider, Divider, Space, Typography } from 'antd'

import type { HealthSnapshot } from '@main/ipc/health'

const containerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #101828 0%, #1d2939 60%, #312e81 100%)',
  padding: '24px'
}

const cardStyle: CSSProperties = {
  width: '100%',
  maxWidth: 560,
  boxShadow: '0 25px 65px rgba(15, 23, 42, 0.35)',
  borderRadius: 16
}

const accentColor = '#0ba5ec'

const App = () => {
  const [status, setStatus] = useState<HealthSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadStatus = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await window.api.health.check()
      if (response.ok) {
        setStatus(response.data)
      } else {
        setError(response.message)
        setStatus(null)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossibile contattare il main process'
      setError(message)
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: accentColor,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"
        }
      }}
    >
      <AntdApp>
        <div style={containerStyle}>
          <Card style={cardStyle} bodyStyle={{ padding: 32 }}>
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              <div>
                <Typography.Text style={{ color: accentColor, fontWeight: 600 }}>
                  Suite offline - rischio & idoneita
                </Typography.Text>
                <Typography.Title level={2} style={{ marginTop: 8, marginBottom: 0 }}>
                  Ambiente pronto al lavoro
                </Typography.Title>
                <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
                  Questo e uno scheletro minimale (Hello World) con logger, caricamento env e IPC
                  gia cablati. Da qui costruiremo Wave 0: ingest questionari, scoring e proposta.
                </Typography.Paragraph>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Typography.Text type="secondary">Health check</Typography.Text>
                <Card
                  size="small"
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                  bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  {status ? (
                    <>
                      <Typography.Text style={{ color: '#f8fafc', fontSize: 16 }}>
                        {status.status === 'healthy' ? 'Main process attivo' : status.status}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ color: '#cbd5f5' }}>
                        Versione {status.version} · uptime {Math.round(status.uptimeSeconds)}s
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ color: '#cbd5f5' }}>
                        Ultimo ping: {new Date(status.timestamp).toLocaleTimeString()}
                      </Typography.Text>
                    </>
                  ) : (
                    <Typography.Text style={{ color: '#f8fafc' }}>
                      {error ?? (loading ? 'Contatto il main process...' : 'In attesa di dati')}
                    </Typography.Text>
                  )}
                </Card>
              </Space>

              <Button
                type="primary"
                block
                onClick={() => void loadStatus()}
                loading={loading}
                style={{ height: 44, fontWeight: 600 }}
              >
                Aggiorna diagnostica
              </Button>
            </Space>
          </Card>
        </div>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
