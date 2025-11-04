import { useQuestionnaireStepper } from '@renderer/components/QuestionnaireStepper.hooks'
import QuestionnaireStepperContent from '@renderer/components/QuestionnaireStepper.Content'
import QuestionnaireStepperHeader from '@renderer/components/QuestionnaireStepper.Header'
import { Card } from 'antd'

const QuestionnaireStepper = () => {
  const {
    copy,
    progress,
    control,
    errors,
    validationErrors,
    handleNext,
    handleBack,
    handleStepChange,
    handleReset,
    currentStep,
    steps,
    section,
    isReady,
    isLastStep
  } = useQuestionnaireStepper()

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
        handleStepChange={handleStepChange}
        currentStep={currentStep}
        steps={steps}
        section={section}
        isLastStep={isLastStep}
      />
    </Card>
  )
}

export default QuestionnaireStepper
