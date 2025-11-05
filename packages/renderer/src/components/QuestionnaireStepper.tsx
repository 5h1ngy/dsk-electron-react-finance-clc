import type { ReactNode } from 'react'

import { useQuestionnaireStepper } from '@renderer/components/QuestionnaireStepper.hooks'
import QuestionnaireStepperContent from '@renderer/components/QuestionnaireStepper.Content'
import QuestionnaireStepperHeader from '@renderer/components/QuestionnaireStepper.Header'
import { Card, theme } from 'antd'

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
        bordered={false}
        style={{ boxShadow: token.boxShadowSecondary }}
        bodyStyle={{
          padding: `${token.paddingLG}px ${token.paddingLG}px ${token.paddingXL}px`
        }}
      />
    )
  }

  return (
    <Card
      bordered={false}
      style={{ boxShadow: token.boxShadowSecondary }}
      bodyStyle={{
        padding: `${token.paddingLG}px ${token.paddingLG}px ${token.paddingXL}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: token.marginLG
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: token.marginSM
        }}
      >
        <QuestionnaireStepperHeader
          completionLabel={copy.completion}
          completionValue={progress.completed}
          resetLabel={copy.reset}
          onReset={handleReset}
          secondaryAction={secondaryAction}
        />
      </div>
      <QuestionnaireStepperContent
        copy={copy}
        control={control}
        errors={errors}
        validationErrors={validationErrors}
        handleNext={handleNext}
        handleBack={handleBack}
        currentStep={currentStep}
        section={section}
        isLastStep={isLastStep}
      />
    </Card>
  )
}

export default QuestionnaireStepper
