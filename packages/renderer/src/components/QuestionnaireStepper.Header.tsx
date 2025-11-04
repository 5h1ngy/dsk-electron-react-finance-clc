import { Button, Space, Typography } from 'antd'

interface QuestionnaireStepperHeaderProps {
  completionLabel: string
  completionValue: number
  resetLabel: string
  onReset: () => void
}

const QuestionnaireStepperHeader = ({
  completionLabel,
  completionValue,
  resetLabel,
  onReset
}: QuestionnaireStepperHeaderProps) => (
  <Space size="large">
    <Typography.Paragraph
      type="secondary"
      style={{ minWidth: 160, textAlign: 'right', marginBottom: 0 }}
    >
      {completionLabel} <Typography.Text strong>{completionValue}%</Typography.Text>
    </Typography.Paragraph>
    <Button onClick={onReset} type="link">
      {resetLabel}
    </Button>
  </Space>
)

export default QuestionnaireStepperHeader
