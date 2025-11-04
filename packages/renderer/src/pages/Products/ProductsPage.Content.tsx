import { Card, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

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

  const data: ProductRow[] = useMemo(
    () => [
      {
        key: '1',
        name: 'Alpha Equity Growth Fund',
        category: 'Azionari Globali',
        risk: 'Dinamico',
        aum: 2450,
        yield: 8.6,
        updated: '02/02/2025'
      },
      {
        key: '2',
        name: 'Stellar Balanced Portfolio',
        category: 'Bilanciati Multi-Asset',
        risk: 'Bilanciato',
        aum: 1870,
        yield: 5.4,
        updated: '31/01/2025'
      },
      {
        key: '3',
        name: 'Aurora Sustainable Bonds',
        category: 'Obbligazionari ESG',
        risk: 'Prudente',
        aum: 1125,
        yield: 3.1,
        updated: '29/01/2025'
      },
      {
        key: '4',
        name: 'Prime Liquidity Cash Plus',
        category: 'Monetari',
        risk: 'Conservativo',
        aum: 860,
        yield: 1.2,
        updated: '02/02/2025'
      },
      {
        key: '5',
        name: 'NextGen Innovation ETF',
        category: 'Tematici Tech',
        risk: 'Dinamico',
        aum: 3100,
        yield: 12.4,
        updated: '01/02/2025'
      },
      {
        key: '6',
        name: 'Euro Defensive Income',
        category: 'Obbligazionari Corporate',
        risk: 'Prudente',
        aum: 990,
        yield: 2.8,
        updated: '28/01/2025'
      },
      {
        key: '7',
        name: 'Latitude Diversified Commodities',
        category: 'Materie prime',
        risk: 'Bilanciato',
        aum: 670,
        yield: 6.2,
        updated: '25/01/2025'
      },
      {
        key: '8',
        name: 'Blue Horizon Infrastructure',
        category: 'Alternativi Real Asset',
        risk: 'Bilanciato',
        aum: 1420,
        yield: 7.1,
        updated: '27/01/2025'
      }
    ],
    []
  )

  return (
    <Card title={t('products.title')}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 6, showSizeChanger: false }}
        scroll={{ x: 900 }}
      />
    </Card>
  )
}

export default ProductsPageContent
