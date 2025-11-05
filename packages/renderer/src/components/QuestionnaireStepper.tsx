import type { ReactNode } from 'react'

import { useQuestionnaireStepper } from '@renderer/components/QuestionnaireStepper.hooks'
import QuestionnaireStepperContent from '@renderer/components/QuestionnaireStepper.Content'
import QuestionnaireStepperHeader from '@renderer/components/QuestionnaireStepper.Header'
import { Card } from 'antd'

export type QuestionnaireStepperModel = ReturnType<typeof useQuestionnaireStepper>

interface QuestionnaireStepperProps {
  model?: QuestionnaireStepperModel
  secondaryAction?: ReactNode
}

const QuestionnaireStepper = ({ model, secondaryAction }: QuestionnaireStepperProps = {}) => {
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
    return <Card loading title={copy.title} />
  }

  return (
    <Card
      title={copy.title}
      extra={
        <QuestionnaireStepperHeader
          completionLabel={copy.completion}
          completionValue={progress.completed}
          resetLabel={copy.reset}
          onReset={handleReset}
          secondaryAction={secondaryAction}
        />
      }
    >
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
