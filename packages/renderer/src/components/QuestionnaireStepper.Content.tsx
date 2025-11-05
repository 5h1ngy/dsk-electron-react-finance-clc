import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { Alert, Input, InputNumber, Radio, Space, Typography, theme } from 'antd'

import type { QuestionnaireResponses } from '@engines/questionnaire'

interface Question {
  id: string
  label: string
  required: boolean
  type: 'single_choice' | 'number' | 'percentage' | 'text'
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
  section: Section
}

const QuestionnaireStepperContent = ({
  copy,
  control,
  errors,
  validationErrors,
  section
}: QuestionnaireStepperContentProps) => {
  const { token } = theme.useToken()

  return (
    <Space direction="vertical" size={token.marginLG} style={{ width: '100%' }}>
      {validationErrors.length > 0 ? (
        <Alert type="warning" message={copy.alert} showIcon />
      ) : null}
      <Space
        direction="vertical"
        size={token.marginMD}
        style={{ width: '100%', alignItems: 'flex-start' }}
      >
        {section.questions.map((question) => (
          <div
            key={question.id}
            style={{
              width: '100%',
              maxWidth: 520,
              alignSelf: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              gap: token.marginXS,
              padding: `${token.paddingSM}px 0`
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
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          borderRadius: token.borderRadiusLG
                        }}
                      >
                        {option}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                ) : question.type === 'text' ? (
                  <Input
                    {...field}
                    value={field.value == null ? '' : String(field.value)}
                    onChange={(event) => field.onChange(event.target.value)}
                    style={{ width: '100%' }}
                  />
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
          </div>
        ))}
      </Space>
      <Alert
        type="info"
        message={copy.info}
        showIcon
        style={{ borderRadius: token.borderRadiusLG }}
      />
    </Space>
  )
}

export default QuestionnaireStepperContent
