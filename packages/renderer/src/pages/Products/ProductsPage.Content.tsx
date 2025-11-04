import { Alert, Button, Space, Table, Tag, Upload, theme } from 'antd'
import type { UploadProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { UploadOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

  const columns: ColumnsType<ProductRow> = useMemo(
    () => [
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
        width: 180
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
        render: (value: number) => `${value.toLocaleString('it-IT')}€`
      },
      {
        title: t('products.table.yield'),
        dataIndex: 'yield',
        key: 'yield',
        width: 160,
        render: (value: number) => `${value.toFixed(2)}%`
      },
      {
        title: t('products.table.updated'),
        dataIndex: 'updated',
        key: 'updated',
        width: 160
      }
    ],
    [t]
  )

  const hydrateData = useCallback((rows: ProductRow[]) => {
    setData(rows)
    setError(null)
  }, [])

  const loadDemoData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(new URL('../../../../.demo/finance_tools.xlsx', import.meta.url))
      const buffer = await response.arrayBuffer()
      const file = new File([buffer], 'finance_tools.xlsx')
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
  }, [hydrateData, t])

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

  useEffect(() => {
    void loadDemoData()
  }, [loadDemoData])

  return (
    <Space direction="vertical" size={token.marginLG} style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Upload beforeUpload={handleUpload} showUploadList={false} accept=".xlsx,.xls">
          <Button icon={<UploadOutlined />} loading={loading}>
            {t('products.actions.upload')}
          </Button>
        </Upload>
      </Space>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 900 }}
        locale={{ emptyText: t('products.empty') }}
      />
    </Space>
  )
}

export default ProductsPageContent
