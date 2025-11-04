import { Controller } from 'react-hook-form'
import { Alert, Button, Card, InputNumber, Radio, Space, Steps, Typography } from 'antd'

import { useQuestionnaireStepper } from '@renderer/components/QuestionnaireStepper.hooks'

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
        <Space size="large">
          <Typography.Paragraph
            type="secondary"
            style={{ minWidth: 160, textAlign: 'right', marginBottom: 0 }}
          >
            {copy.completion} <Typography.Text strong>{progress.completed}%</Typography.Text>
          </Typography.Paragraph>
          <Button onClick={handleReset} type="link">
            {copy.reset}
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Steps current={currentStep} onChange={handleStepChange} responsive items={steps} />
        {validationErrors.length > 0 ? (
          <Alert type="warning" message={copy.alert} showIcon />
        ) : null}
        <Space direction="vertical" size="large">
          {section.questions.map((question) => (
            <Space key={question.id} direction="vertical" size={8}>
              <Space align="baseline">
                <Typography.Text strong>{question.label}</Typography.Text>
                {question.required ? <Typography.Text type="danger">*</Typography.Text> : null}
              </Space>
              <Controller
                name={question.id}
                control={control}
                render={({ field }) =>
                  question.type === 'single_choice' ? (
                    <Radio.Group
                      {...field}
                      optionType="button"
                      buttonStyle="solid"
                      style={{ width: '100%' }}
                    >
                      {(question.options ?? []).map((option) => (
                        <Radio.Button
                          key={option}
                          value={option}
                          style={{ flex: 1, textAlign: 'center' }}
                        >
                          {option}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  ) : (
                    <InputNumber
                      {...field}
                      value={field.value ?? undefined}
                      onChange={(value) => field.onChange(value === null ? undefined : value)}
                      style={{ width: '100%' }}
                      min={question.min}
                      max={question.max}
                      addonAfter={question.unit}
                      step={question.type === 'percentage' ? 1 : 0.5}
                    />
                  )
                }
              />
              {errors[question.id]?.message ? (
                <Typography.Text type="danger" style={{ fontSize: 12 }}>
                  {String(errors[question.id]?.message)}
                </Typography.Text>
              ) : null}
            </Space>
          ))}
        </Space>
        <Alert type="info" message={copy.info} showIcon />
        <Space>
          <Button onClick={handleBack} disabled={currentStep === 0}>
            {copy.nav.back}
          </Button>
          <Button type="primary" onClick={handleNext}>
            {isLastStep ? copy.nav.finish : copy.nav.next}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

export default QuestionnaireStepper
