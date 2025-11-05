import type { ReactNode } from 'react'

import { Button, Space, Typography } from 'antd'

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
}: QuestionnaireStepperHeaderProps) => (
  <Space size="large" align="center" wrap>
    <Typography.Paragraph
      type="secondary"
      style={{ minWidth: 160, textAlign: 'right', marginBottom: 0 }}
    >
      {completionLabel} <Typography.Text strong>{completionValue}%</Typography.Text>
    </Typography.Paragraph>
    <Button onClick={onReset} type="link">
      {resetLabel}
    </Button>
    {secondaryAction}
  </Space>
)

export default QuestionnaireStepperHeader
