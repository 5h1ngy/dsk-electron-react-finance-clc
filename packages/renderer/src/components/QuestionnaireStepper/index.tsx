import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, InputNumber, Radio, Space, Statistic, Steps, Typography } from 'antd'

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

import type { QuestionnaireResponses } from '@renderer/domain/questionnaire'

const isValuePresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== ''

const buildQuestionSchema = (question: ReturnType<typeof useMemo> extends never ? never : any) => {
  let schema: z.ZodTypeAny
  if (question.type === 'single_choice') {
    const allowed = question.options ?? []
    schema = z
      .string({ required_error: 'Campo obbligatorio' })
      .refine((value) => allowed.includes(value), { message: 'Valore non valido' })
  } else {
    schema = z
      .number({
        required_error: 'Campo obbligatorio',
        invalid_type_error: 'Inserisci un numero valido'
      })
      .refine(
        (value) =>
          (question.min === undefined || value >= question.min) &&
          (question.max === undefined || value <= question.max),
        { message: 'Valore fuori range' }
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
      shape[question.id] = buildQuestionSchema(question)
    })
    return z.object(shape)
  }, [section])

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
    formState: { errors },
    getValues
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
    return <Card loading title="Questionario dinamico" />
  }

  return (
    <Card
      title="Questionario dinamico"
      style={{ height: '100%' }}
      extra={
        <Space size="large">
          <div style={{ minWidth: 160, textAlign: 'right' }}>
            <Typography.Text type="secondary">
              Completamento <Typography.Text strong>{progress.completed}%</Typography.Text>
            </Typography.Text>
          </div>
          <Button onClick={handleReset} type="link">
            Azzera risposte
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
          message="Compila tutti i campi obbligatori nella sezione corrente"
          showIcon
          style={{ marginTop: 16 }}
        />
      ) : null}
      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
        {section.questions.map((question) => (
          <div key={question.id}>
            <Space align="baseline">
              <Typography.Text strong>{question.label}</Typography.Text>
              {question.required ? <Typography.Text type="danger">*</Typography.Text> : null}
            </Space>
            <Controller
              key={question.id}
              name={question.id}
              control={control}
              render={({ field }) =>
                question.type === 'single_choice' ? (
                  <Radio.Group
                    {...field}
                    optionType="button"
                    buttonStyle="solid"
                    style={{ marginTop: 8 }}
                  >
                    {(question.options ?? []).map((option) => (
                      <Radio.Button key={option} value={option}>
                        {option}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                ) : (
                  <InputNumber
                    {...field}
                    value={field.value ?? undefined}
                    onChange={(value) => field.onChange(value === null ? undefined : value)}
                    style={{ width: '100%', marginTop: 8 }}
                    min={question.min}
                    max={question.max}
                    addonAfter={question.unit}
                    step={question.type === 'percentage' ? 1 : 0.5}
                  />
                )
              }
            />
            {errors[question.id]?.message ? (
              <Typography.Text type="danger">{String(errors[question.id]?.message)}</Typography.Text>
            ) : null}
          </div>
        ))}
        <Alert
          type="info"
          message="Puoi importare il questionario da Excel, PDF oppure compilarlo manualmente."
          showIcon
        />
        <Space>
          <Button onClick={handleBack} disabled={currentStep === 0}>
            Indietro
          </Button>
          <Button type="primary" onClick={handleNext}>
            {currentStep === schema.sections.length - 1 ? 'Calcola profilo' : 'Avanti'}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

export default QuestionnaireStepper
