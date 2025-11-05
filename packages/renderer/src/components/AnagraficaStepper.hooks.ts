import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'

import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  applyAnagraficaResponses,
  initializeAnagrafica,
  resetAnagrafica,
  selectAnagraficaProgress,
  selectAnagraficaResponses,
  selectAnagraficaSchema,
  selectAnagraficaStatus
} from '@renderer/store/slices/anagrafica'
import type { QuestionnaireStepperModel } from '@renderer/components/QuestionnaireStepper'
import type { QuestionnaireResponses, QuestionDefinition } from '@engines/questionnaire'

const isValuePresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== ''

const buildQuestionSchema = (question: QuestionDefinition, t: TFunction) => {
  let schema: z.ZodTypeAny
  if (question.type === 'single_choice') {
    const allowed = question.options ?? []
    schema = z
      .string({ required_error: t('anagrafica.validation.required') })
      .refine((value) => allowed.includes(value), {
        message: t('anagrafica.validation.invalidChoice')
      })
  } else {
    schema = z
      .number({
        required_error: t('anagrafica.validation.required'),
        invalid_type_error: t('anagrafica.validation.invalidNumber')
      })
      .refine(
        (value) =>
          (question.min === undefined || value >= question.min) &&
          (question.max === undefined || value <= question.max),
        { message: t('anagrafica.validation.outOfRange') }
      )
  }
  return question.required ? schema : schema.optional()
}

export const useAnagraficaStepper = (): QuestionnaireStepperModel => {
  const dispatch = useAppDispatch()
  const schema = useAppSelector(selectAnagraficaSchema)
  const status = useAppSelector(selectAnagraficaStatus)
  const responses = useAppSelector(selectAnagraficaResponses)
  const progress = useAppSelector(selectAnagraficaProgress)
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(initializeAnagrafica())
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

  const sectionsProgress = useMemo(() => {
    if (!schema) {
      return []
    }
    return schema.sections.map((sectionItem) => {
      const total = sectionItem.questions.length
      const answered = sectionItem.questions.filter((question) =>
        isValuePresent(responses[question.id])
      ).length
      return {
        id: sectionItem.id,
        title: sectionItem.label,
        percent: total === 0 ? 0 : Math.round((answered / total) * 100)
      }
    })
  }, [responses, schema])

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

  const onSubmit = useCallback(
    (values: QuestionnaireResponses) => {
      dispatch(applyAnagraficaResponses(values))
      setValidationErrors([])
      if (!schema) {
        return
      }
      if (currentStep < schema.sections.length - 1) {
        setCurrentStep((prev) => prev + 1)
      }
    },
    [currentStep, dispatch, schema]
  )

  const onInvalid = useCallback((formErrors: typeof errors) => {
    setValidationErrors(Object.keys(formErrors))
  }, [])

  const handleNext = useCallback(() => {
    void handleSubmit(onSubmit, onInvalid)()
  }, [handleSubmit, onInvalid, onSubmit])

  const handleBack = useCallback(() => {
    setValidationErrors([])
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleStepChange = useCallback(
    (nextStep: number) => {
      if (canNavigateTo(nextStep)) {
        setValidationErrors([])
        setCurrentStep(nextStep)
      }
    },
    [canNavigateTo]
  )

  const handleReset = useCallback(() => {
    dispatch(resetAnagrafica())
    reset({})
    setValidationErrors([])
    setCurrentStep(0)
  }, [dispatch, reset])

  const steps = useMemo(() => {
    if (!schema) {
      return []
    }
    return schema.sections.map((sectionItem, index) => ({
      key: sectionItem.id,
      title: sectionItem.label,
      disabled: !canNavigateTo(index)
    }))
  }, [canNavigateTo, schema])

  const copy = {
    title: t('anagrafica.title'),
    completion: t('anagrafica.completion'),
    reset: t('anagrafica.reset'),
    alert: t('anagrafica.alert'),
    info: t('anagrafica.info'),
    nav: {
      back: t('anagrafica.nav.back'),
      next: t('anagrafica.nav.next'),
      finish: t('anagrafica.nav.finish')
    }
  }

  const isReady = !(status === 'loading' || !schema || !section)
  const isLastStep = schema ? currentStep === schema.sections.length - 1 : false

  return {
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
    schema,
    isLastStep,
    sectionsProgress
  }
}
