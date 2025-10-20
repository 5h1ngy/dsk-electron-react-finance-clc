import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  Radio,
  Space,
  Statistic,
  Steps,
  Typography
} from 'antd'

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

import type { QuestionDefinition, QuestionnaireResponses } from '@renderer/domain/questionnaire'

const QuestionField = ({ question }: { question: QuestionDefinition }) => {
  if (question.type === 'single_choice' && question.options) {
    return (
      <Radio.Group optionType="button" buttonStyle="solid">
        {question.options.map((option) => (
          <Radio.Button key={option} value={option}>
            {option}
          </Radio.Button>
        ))}
      </Radio.Group>
    )
  }

  return (
    <InputNumber
      style={{ width: '100%' }}
      min={question.min}
      max={question.max}
      addonAfter={question.unit}
      step={question.type === 'percentage' ? 1 : 0.5}
    />
  )
}

const isValueEmpty = (value: unknown): boolean =>
  value === undefined || value === null || value === ''

const QuestionnaireStepper = () => {
  const [form] = Form.useForm()
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

  useEffect(() => {
    if (!schema) {
      return
    }
    const currentSection = schema.sections[currentStep]
    if (!currentSection) {
      return
    }
    const sectionValues = currentSection.questions.reduce<Record<string, unknown>>(
      (acc, question) => {
        acc[question.id] = responses[question.id]
        return acc
      },
      {}
    )
    form.setFieldsValue(sectionValues)
  }, [schema, currentStep, responses, form])

  const handleStepChange = (nextStep: number) => {
    if (!schema) {
      return
    }
    if (!canNavigateTo(nextStep)) {
      return
    }
    setValidationErrors([])
    const section = schema.sections[nextStep]
    const values = section.questions.reduce<QuestionnaireResponses>((acc, question) => {
      const current = form.getFieldValue(question.id)
      if (!isValueEmpty(current)) {
        acc[question.id] = current
      }
      return acc
    }, {})
    if (Object.keys(values).length > 0) {
      dispatch(applyBulkResponses(values))
    }
    setCurrentStep(nextStep)
  }

  const handleSubmitSection = async () => {
    // eslint-disable-next-line no-debugger
    debugger
    if (!schema) {
      return
    }
    const section = schema.sections[currentStep]
    const fieldNames = section.questions.map((question) => question.id)
    try {
      const values = (await form.validateFields(fieldNames)) as QuestionnaireResponses
      dispatch(applyBulkResponses(values))
      setValidationErrors([])
      if (currentStep < schema.sections.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        dispatch(computeQuestionnaireScore())
      }
    } catch (error: any) {
      const fields = (error?.errorFields as Array<{ name: Array<string | number> }> | undefined) ?? []
      setValidationErrors(fields.map((field) => String(field.name?.[0])))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleReset = () => {
    dispatch(resetQuestionnaire())
    form.resetFields()
    setCurrentStep(0)
    setValidationErrors([])
  }

  const section = useMemo(() => schema?.sections[currentStep], [schema, currentStep])

  const isSectionComplete = useCallback(
    (sectionIndex: number) => {
      if (!schema) {
        return false
      }
      const section = schema.sections[sectionIndex]
      return section.questions.every(
        (question) => !question.required || !isValueEmpty(responses[question.id])
      )
    },
    [schema, responses]
  )

  const firstIncompleteIndex = useMemo(() => {
    if (!schema) {
      return 0
    }
    const idx = schema.sections.findIndex((_, index) => !isSectionComplete(index))
    return idx === -1 ? schema.sections.length - 1 : idx
  }, [schema, isSectionComplete])

  const canNavigateTo = useCallback(
    (targetIndex: number) => targetIndex <= firstIncompleteIndex,
    [firstIncompleteIndex]
  )

  useEffect(() => {
    if (currentStep > firstIncompleteIndex) {
      setCurrentStep(firstIncompleteIndex)
    }
  }, [currentStep, firstIncompleteIndex])

  if (status === 'loading' || !schema) {
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
      {section ? (
        <Form
          key={section.id}
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
          onValuesChange={() => setSectionTouched(true)}
        >
          {validationErrors.length > 0 ? (
            <Alert
              type="warning"
              message="Compila tutti i campi obbligatori nella sezione corrente"
              showIcon
              style={{ marginBottom: 16 }}
            />
          ) : null}
          {section.questions.map((question) => (
            <Form.Item
              key={question.id}
              name={question.id}
              label={
                <Space>
                  {question.label}
                  {question.required ? <Typography.Text type="danger">*</Typography.Text> : null}
                </Space>
              }
              rules={
                question.required ? [{ required: true, message: 'Campo obbligatorio' }] : undefined
              }
            >
              <QuestionField question={question} />
            </Form.Item>
          ))}
          <Alert
            type="info"
            message="Puoi importare il questionario da Excel oppure compilarlo manualmente."
            style={{ marginBottom: 16 }}
            showIcon
          />
          <Space>
            <Button onClick={handleBack} disabled={currentStep === 0}>
              Indietro
            </Button>
            <Button type="primary" onClick={() => void handleSubmitSection()}>
              {currentStep === schema.sections.length - 1 ? 'Calcola profilo' : 'Avanti'}
            </Button>
          </Space>
        </Form>
      ) : null}
    </Card>
  )
}

export default QuestionnaireStepper
