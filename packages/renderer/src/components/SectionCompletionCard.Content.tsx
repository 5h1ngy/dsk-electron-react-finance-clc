import { Progress, Space, Typography, theme } from 'antd'

interface SectionCompletionCardContentProps {
  items: Array<{ title: string; percent: number }>
}

const SectionCompletionCardContent = ({ items }: SectionCompletionCardContentProps) => {
  const { token } = theme.useToken()

  return (
    <Space
      align="center"
      size={token.marginXS}
      style={{ width: '100%', justifyContent: 'space-around', flexWrap: 'wrap' }}
    >
      {items.map((item) => (
        <Space key={item.title} direction="vertical" size={4} align="center">
          <Typography.Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
            {item.title}
          </Typography.Text>
          <Progress
            type="dashboard"
            percent={item.percent}
            size={68}
            strokeColor={token.colorPrimary}
            format={(value) => `${value ?? 0}%`}
          />
        </Space>
      ))}
    </Space>
  )
}

export default SectionCompletionCardContent
