import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, InputNumber, Radio, Space, Statistic, Steps, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'

import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  applyBulkResponses,
  computeQuestionnaireScore,
  initializeQuestionnaire,
  resetQuestionnaire,
  selectAnsweredProgress,
  selectQuestionnaireSchema,
  selectQuestionnaireStatus,
  selectResponses
} from '@renderer/store/slices/questionnaire'

import type { QuestionnaireResponses, QuestionDefinition } from '@renderer/domain/questionnaire'

const isValuePresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== ''

const buildQuestionSchema = (question: QuestionDefinition, t: TFunction) => {
  let schema: z.ZodTypeAny
  if (question.type === 'single_choice') {
    const allowed = question.options ?? []
    schema = z
      .string({ required_error: t('questionnaire.validation.required') })
      .refine((value) => allowed.includes(value), {
        message: t('questionnaire.validation.invalidChoice')
      })
  } else {
    schema = z
      .number({
        required_error: t('questionnaire.validation.required'),
        invalid_type_error: t('questionnaire.validation.invalidNumber')
      })
      .refine(
        (value) =>
          (question.min === undefined || value >= question.min) &&
          (question.max === undefined || value <= question.max),
        { message: t('questionnaire.validation.outOfRange') }
      )
  }
  return question.required ? schema : schema.optional()
}

const QuestionnaireStepper = () => {
  const dispatch = useAppDispatch()
  const schema = useAppSelector(selectQuestionnaireSchema)
  const status = useAppSelector(selectQuestionnaireStatus)
  const responses = useAppSelector(selectResponses)
  const progress = useAppSelector(selectAnsweredProgress)
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(initializeQuestionnaire())
    }
  }, [dispatch, status])

  const section = schema?.sections[currentStep]

  const sectionSchema = useMemo(() => {
    if (!section) {
      return null
    }
    const shape: Record<string, z.ZodTypeAny> = {}
    section.questions.forEach((question) => {
      shape[question.id] = buildQuestionSchema(question, t)
    })
    return z.object(shape)
  }, [section, t])

  const defaultValues = useMemo(() => {
    const values: QuestionnaireResponses = {}
    section?.questions.forEach((question) => {
      if (responses[question.id] !== undefined) {
        values[question.id] = responses[question.id]
      }
    })
    return values
  }, [responses, section])

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<QuestionnaireResponses>({
    resolver: sectionSchema ? zodResolver(sectionSchema) : undefined,
    defaultValues
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const isSectionComplete = useCallback(
    (index: number) => {
      if (!schema) {
        return false
      }
      const targetSection = schema.sections[index]
      return targetSection.questions.every(
        (question) => !question.required || isValuePresent(responses[question.id])
      )
    },
    [responses, schema]
  )

  const firstIncompleteIndex = useMemo(() => {
    if (!schema) {
      return 0
    }
    const idx = schema.sections.findIndex((_, index) => !isSectionComplete(index))
    return idx === -1 ? schema.sections.length - 1 : idx
  }, [schema, isSectionComplete])

  useEffect(() => {
    if (currentStep > firstIncompleteIndex) {
      setCurrentStep(firstIncompleteIndex)
    }
  }, [currentStep, firstIncompleteIndex])

  const canNavigateTo = useCallback(
    (targetIndex: number) => targetIndex <= firstIncompleteIndex,
    [firstIncompleteIndex]
  )

  const onSubmit = (values: QuestionnaireResponses) => {
    dispatch(applyBulkResponses(values))
    setValidationErrors([])
    if (!schema) {
      return
    }
    if (currentStep < schema.sections.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      dispatch(computeQuestionnaireScore())
    }
  }

  const onInvalid = (formErrors: typeof errors) => {
    setValidationErrors(Object.keys(formErrors))
  }

  const handleNext = () => {
    void handleSubmit(onSubmit, onInvalid)()
  }

  const handleBack = () => {
    setValidationErrors([])
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleStepChange = (nextStep: number) => {
    if (canNavigateTo(nextStep)) {
      setValidationErrors([])
      setCurrentStep(nextStep)
    }
  }

  const handleReset = () => {
    dispatch(resetQuestionnaire())
    reset({})
    setValidationErrors([])
    setCurrentStep(0)
  }

  if (status === 'loading' || !schema || !section) {
    return <Card loading title={t('questionnaire.title')} />
  }

  return (
    <Card
      title={t('questionnaire.title')}
      style={{ height: '100%' }}
      extra={
        <Space size="large">
          <div style={{ minWidth: 160, textAlign: 'right' }}>
            <Typography.Text type="secondary">
              {t('questionnaire.completion')}{' '}
              <Typography.Text strong>{progress.completed}%</Typography.Text>
            </Typography.Text>
          </div>
          <Button onClick={handleReset} type="link">
            {t('questionnaire.reset')}
          </Button>
        </Space>
      }
    >
      <Steps
        current={currentStep}
        onChange={handleStepChange}
        responsive
        items={schema.sections.map((sectionItem, index) => ({
          key: sectionItem.id,
          title: sectionItem.label,
          disabled: !canNavigateTo(index)
        }))}
      />
      {validationErrors.length > 0 ? (
        <Alert
          type="warning"
          message={t('questionnaire.alert')}
          showIcon
          style={{ marginTop: 16 }}
        />
      ) : null}
      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
        {section.questions.map((question) => (
          <div
            key={question.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '8px 0'
            }}
          >
            <Space align="baseline">
              <Typography.Text strong style={{ fontSize: 14 }}>
                {question.label}
              </Typography.Text>
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
                      <Radio.Button key={option} value={option} style={{ flex: 1, textAlign: 'center' }}>
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
          </div>
        ))}
        <Alert type="info" message={t('questionnaire.info')} showIcon />
        <Space>
          <Button onClick={handleBack} disabled={currentStep === 0}>
            {t('questionnaire.nav.back')}
          </Button>
          <Button type="primary" onClick={handleNext}>
            {currentStep === schema.sections.length - 1
              ? t('questionnaire.nav.finish')
              : t('questionnaire.nav.next')}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

export default QuestionnaireStepper
