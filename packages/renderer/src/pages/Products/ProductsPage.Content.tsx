import { Alert, Button, Empty, Space, Table, Tag, Upload, Typography, theme } from 'antd'
import type { UploadProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { UploadOutlined } from '@ant-design/icons'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { parseFinanceWorkbook } from '@engines/importers/financeWorkbook'

interface ProductRow {
  key: string
  name: string
  category: string
  risk: string
  aum: number
  yield: number
  updated: string
}

const ProductsPageContent = () => {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const [data, setData] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const columns: ColumnsType<ProductRow> = useMemo(() => {
    const currencyFormatter = new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    const yieldFormatter = new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })

    return [
      {
        title: t('products.table.name'),
        dataIndex: 'name',
        key: 'name',
        width: 220,
        ellipsis: true
      },
      {
        title: t('products.table.category'),
        dataIndex: 'category',
        key: 'category',
        width: 200
      },
      {
        title: t('products.table.risk'),
        dataIndex: 'risk',
        key: 'risk',
        width: 160,
        render: (value: string) => <Tag color="geekblue">{value}</Tag>
      },
      {
        title: t('products.table.aum'),
        dataIndex: 'aum',
        key: 'aum',
        width: 160,
        render: (value: number) => `${currencyFormatter.format(value)} €`
      },
      {
        title: t('products.table.yield'),
        dataIndex: 'yield',
        key: 'yield',
        width: 160,
        render: (value: number) => `${yieldFormatter.format(value)}%`
      },
      {
        title: t('products.table.updated'),
        dataIndex: 'updated',
        key: 'updated',
        width: 160
      }
    ]
  }, [t])

  const hydrateData = useCallback((rows: ProductRow[]) => {
    setData(rows)
    setError(null)
  }, [])

  const handleUpload: UploadProps['beforeUpload'] = async (file) => {
    try {
      setLoading(true)
      setError(null)
      const summary = await parseFinanceWorkbook(file)
      hydrateData(
        summary.products.map((product, index) => ({
          key: `${index}`,
          name: product.name,
          category: product.category,
          risk: product.riskBand,
          aum: Math.round(150 + index * 120 + Math.random() * 80),
          yield: Number((2 + Math.random() * 6).toFixed(2)),
          updated: new Date().toLocaleDateString()
        }))
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : t('products.errors.load'))
    } finally {
      setLoading(false)
    }
    return Upload.LIST_IGNORE
  }

  return (
    <Space direction="vertical" size={token.marginLG} style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {t('products.title')}
        </Typography.Title>
        <Upload beforeUpload={handleUpload} showUploadList={false} accept=".xlsx,.xls">
          <Button type="primary" icon={<UploadOutlined />} loading={loading}>
            {t('products.actions.upload')}
          </Button>
        </Upload>
      </Space>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      {data.length > 0 ? (
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          rowKey="key"
          scroll={{ x: 'max-content' }}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('products.empty')}
          style={{ padding: token.paddingLG }}
        >
          <Typography.Paragraph type="secondary" style={{ maxWidth: 360, textAlign: 'center' }}>
            {t('products.emptyDetail')}
          </Typography.Paragraph>
        </Empty>
      )}
    </Space>
  )
}

export default ProductsPageContent
