import type { ReactNode } from 'react'

import { useQuestionnaireStepper } from '@renderer/components/QuestionnaireStepper.hooks'
import QuestionnaireStepperContent from '@renderer/components/QuestionnaireStepper.Content'
import QuestionnaireStepperHeader from '@renderer/components/QuestionnaireStepper.Header'
import { Button, Card, Space, theme } from 'antd'

export type QuestionnaireStepperModel = ReturnType<typeof useQuestionnaireStepper>

interface QuestionnaireStepperProps {
  model?: QuestionnaireStepperModel
  secondaryAction?: ReactNode
}

const QuestionnaireStepper = ({ model, secondaryAction }: QuestionnaireStepperProps = {}) => {
  const { token } = theme.useToken()

  const {
    copy,
    progress,
    control,
    errors,
    validationErrors,
    handleNext,
    handleBack,
    handleReset,
    currentStep,
    section,
    isReady,
    isLastStep
  } = model ?? useQuestionnaireStepper()

  if (!isReady || !section) {
    return (
      <Card
        loading
        variant="borderless"
        style={{ boxShadow: token.boxShadowSecondary }}
        styles={{
          body: {
            padding: `${token.paddingLG}px ${token.paddingLG}px ${token.paddingXL}px`
          }
        }}
      />
    )
  }

  return (
    <Space direction="vertical" size={token.marginXL} style={{ width: '100%' }}>
      <Card
        variant="borderless"
        style={{ boxShadow: token.boxShadowSecondary }}
        styles={{
          body: {
            padding: `${token.paddingLG}px ${token.paddingLG}px ${token.paddingXL}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: token.marginLG
          }
        }}
      >
        <QuestionnaireStepperHeader
          completionLabel={copy.completion}
          completionValue={progress.completed}
          resetLabel={copy.reset}
          onReset={handleReset}
          secondaryAction={secondaryAction}
        />
        <QuestionnaireStepperContent
          copy={copy}
          control={control}
          errors={errors}
          validationErrors={validationErrors}
          section={section}
        />
      </Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: token.marginSM
        }}
      >
        <Button onClick={handleBack} disabled={currentStep === 0}>
          {copy.nav.back}
        </Button>
        <Button type="primary" onClick={handleNext}>
          {isLastStep ? copy.nav.finish : copy.nav.next}
        </Button>
      </div>
    </Space>
  )
}

export default QuestionnaireStepper
