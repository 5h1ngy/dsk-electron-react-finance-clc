import { useEffect, useMemo, useState } from 'react'
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

import type {
  QuestionDefinition,
  QuestionnaireResponses
} from '@renderer/domain/questionnaire'

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

const QuestionnaireStepper = () => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const schema = useAppSelector(selectQuestionnaireSchema)
  const status = useAppSelector(selectQuestionnaireStatus)
  const responses = useAppSelector(selectResponses)
  const progress = useAppSelector(selectAnsweredProgress)
  const [currentStep, setCurrentStep] = useState(0)
  const watchedValues = Form.useWatch([], form)

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
    const sectionValues = currentSection.questions.reduce<Record<string, unknown>>((acc, question) => {
      acc[question.id] = responses[question.id]
      return acc
    }, {})
    form.setFieldsValue(sectionValues)
  }, [schema, currentStep, responses, form])

  const handleStepChange = (nextStep: number) => {
    const values = form.getFieldsValue() as QuestionnaireResponses
    dispatch(applyBulkResponses(values))
    setCurrentStep(nextStep)
  }

  const handleSubmitSection = async () => {
    const values = (await form.validateFields()) as QuestionnaireResponses
    dispatch(applyBulkResponses(values))
    if (schema && currentStep < schema.sections.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      dispatch(computeQuestionnaireScore())
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleReset = () => {
    dispatch(resetQuestionnaire())
    form.resetFields()
    setCurrentStep(0)
  }

  const section = useMemo(() => schema?.sections[currentStep], [schema, currentStep])

  const missingRequired = useMemo(() => {
    if (!section) {
      return []
    }
    return section.questions.filter((question) => {
      if (!question.required) {
        return false
      }
      const value =
        (watchedValues && watchedValues[question.id] !== undefined
          ? watchedValues[question.id]
          : responses[question.id]) ?? undefined
      return value === undefined || value === null || value === ''
    })
  }, [section, watchedValues, responses])

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
        items={schema.sections.map((sectionItem) => ({
          key: sectionItem.id,
          title: sectionItem.label
        }))}
      />
      {section ? (
        <Form
          key={section.id}
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          {missingRequired.length > 0 ? (
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
                question.required
                  ? [{ required: true, message: 'Campo obbligatorio' }]
                  : undefined
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
