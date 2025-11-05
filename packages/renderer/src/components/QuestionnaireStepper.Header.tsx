import type { ReactNode } from 'react'

import { Button, Space, Typography, theme } from 'antd'

interface QuestionnaireStepperHeaderProps {
  completionLabel: string
  completionValue: number
  resetLabel: string
  onReset: () => void
  secondaryAction?: ReactNode
}

const QuestionnaireStepperHeader = ({
  completionLabel,
  completionValue,
  resetLabel,
  onReset,
  secondaryAction
}: QuestionnaireStepperHeaderProps) => {
  const { token } = theme.useToken()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: token.paddingXS,
        borderBottom: `1px solid ${token.colorBorderSecondary}`
      }}
    >
      <Typography.Paragraph
        type="secondary"
        style={{ marginBottom: 0 }}
      >
        {completionLabel} <Typography.Text strong>{completionValue}%</Typography.Text>
      </Typography.Paragraph>
      <Space size="middle" align="center">
        <Button onClick={onReset} type="link">
          {resetLabel}
        </Button>
        {secondaryAction}
      </Space>
    </div>
  )
}

export default QuestionnaireStepperHeader
