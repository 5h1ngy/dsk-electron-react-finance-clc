import { Typography } from 'antd'

import { Steps, theme, Tooltip } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'

import { useSectionCompletionCard } from '@renderer/components/SectionCompletionCard.hooks'

const SectionCompletionCard = () => {
  const { emptyText, hasSchema, items, currentIndex } = useSectionCompletionCard()
  const { token } = theme.useToken()

  if (!hasSchema) {
    return <Typography.Text type="secondary">{emptyText}</Typography.Text>
  }

  const activeIndex = currentIndex === -1 ? items.length - 1 : currentIndex

  return (
    <Steps
      type="navigation"
      size="small"
      current={activeIndex}
      style={{
        width: '100%',
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        padding: `${token.paddingXS}px ${token.paddingMD}px`,
        boxShadow: token.boxShadowTertiary
      }}
      items={items.map((item, index) => ({
        title: (
          <Tooltip title={`${item.percent}%`}>
            <span>{item.title}</span>
          </Tooltip>
        ),
        status: item.percent === 100 ? 'finish' : index === activeIndex ? 'process' : 'wait',
        icon:
          item.percent === 100 ? (
            <CheckCircleFilled style={{ color: token.colorSuccess }} />
          ) : undefined
      }))}
    />
  )
}

export default SectionCompletionCard
