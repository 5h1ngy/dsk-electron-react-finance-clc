import { Steps, Tooltip, theme } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'

import type { QuestionnaireStepperModel } from '@renderer/components/QuestionnaireStepper'

interface QuestionnaireStepperSwitcherProps {
  model: QuestionnaireStepperModel
}

const QuestionnaireStepperSwitcher = ({ model }: QuestionnaireStepperSwitcherProps) => {
  const { token } = theme.useToken()
  const { sectionsProgress, currentStep, handleStepChange, steps } = model

  if (!sectionsProgress.length) {
    return null
  }

  return (
    <Steps
      type="navigation"
      size="small"
      current={currentStep}
      onChange={(index) => {
        if (steps[index]?.disabled) {
          return
        }
        handleStepChange(index)
      }}
      style={{
        width: '100%',
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        padding: `${token.paddingXS}px ${token.paddingMD}px`
      }}
      items={sectionsProgress.map((section, index) => ({
        title: (
          <Tooltip title={`${section.percent}%`}>
            <span>{section.title}</span>
          </Tooltip>
        ),
        status: section.percent === 100 ? 'finish' : index === currentStep ? 'process' : 'wait',
        disabled: steps[index]?.disabled,
        icon:
          section.percent === 100 ? (
            <CheckCircleFilled style={{ color: token.colorSuccess }} />
          ) : undefined
      }))}
    />
  )
}

export default QuestionnaireStepperSwitcher
