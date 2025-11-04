import { z } from 'zod'

import type { QuestionnaireSchema } from '@engines/questionnaire/types'

const questionTypeSchema = z.enum(['number', 'percentage', 'single_choice'])

const questionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: questionTypeSchema,
  required: z.boolean().default(false),
  weight: z.number().nonnegative().default(1),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  options: z.array(z.string()).optional()
})

const sectionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  questions: z.array(questionSchema).min(1)
})

export const questionnaireSchema = z.object({
  schemaVersion: z.string().min(1),
  title: z.string().min(1),
  sections: z.array(sectionSchema).min(1)
})

export type ParsedQuestionnaireSchema = z.infer<typeof questionnaireSchema>

export const normalizeSchema = (input: ParsedQuestionnaireSchema): QuestionnaireSchema => ({
  schemaVersion: input.schemaVersion,
  title: input.title,
  sections: input.sections.map((section) => ({
    id: section.id,
    label: section.label,
    questions: section.questions.map((question) => ({
      id: question.id,
      label: question.label,
      type: question.type,
      required: question.required ?? false,
      weight: question.weight ?? 1,
      unit: question.unit,
      min: question.min,
      max: question.max,
      options: question.options
    }))
  }))
})
