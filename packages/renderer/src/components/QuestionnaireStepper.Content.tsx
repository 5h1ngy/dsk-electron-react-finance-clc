import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { Alert, Button, Card, InputNumber, Radio, Row, Col, Space, Typography, theme } from 'antd'

import type { QuestionnaireResponses } from '@engines/questionnaire'

interface Question {
  id: string
  label: string
  required: boolean
  type: 'single_choice' | 'number' | 'percentage'
  options?: string[]
  min?: number
  max?: number
  unit?: string
}

interface Section {
  questions: Question[]
}

interface QuestionnaireStepperContentProps {
  copy: {
    title: string
    completion: string
    reset: string
    alert: string
    info: string
    nav: { back: string; next: string; finish: string }
  }
  control: Control<QuestionnaireResponses>
  errors: FieldErrors<QuestionnaireResponses>
  validationErrors: string[]
  handleNext: () => void
  handleBack: () => void
  currentStep: number
  section: Section
  isLastStep: boolean
}

const QuestionnaireStepperContent = ({
  copy,
  control,
  errors,
  validationErrors,
  handleNext,
  handleBack,
  currentStep,
  section,
  isLastStep
}: QuestionnaireStepperContentProps) => {
  const { token } = theme.useToken()

  return (
    <Space direction="vertical" size={token.marginLG} style={{ width: '100%' }}>
      {validationErrors.length > 0 ? (
        <Alert type="warning" message={copy.alert} showIcon />
      ) : null}
      <Row gutter={[token.marginMD, token.marginMD]}>
        {section.questions.map((question) => (
          <Col key={question.id} xs={24} lg={12}>
            <Card
              size="small"
              bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                gap: token.marginXS,
                padding: `${token.paddingSM}px ${token.paddingMD}px`
              }}
            >
              <Space align="baseline" style={{ justifyContent: 'space-between' }}>
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
                      style={{ width: '100%', display: 'flex', gap: token.marginXS }}
                    >
                      {(question.options ?? []).map((option) => (
                        <Radio.Button
                          key={option}
                          value={option}
                          style={{ flex: 1, textAlign: 'center', borderRadius: token.borderRadiusLG }}
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
            </Card>
          </Col>
        ))}
      </Row>
      <Alert
        type="info"
        message={copy.info}
        showIcon
        style={{ borderRadius: token.borderRadiusLG }}
      />
      <Space>
        <Button onClick={handleBack} disabled={currentStep === 0}>
          {copy.nav.back}
        </Button>
        <Button type="primary" onClick={handleNext}>
          {isLastStep ? copy.nav.finish : copy.nav.next}
        </Button>
      </Space>
    </Space>
  )
}

export default QuestionnaireStepperContent
