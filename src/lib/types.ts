export type Subject = 'Polity' | 'History' | 'Art & Culture' | 'Geography'
export type QuestionType = 'MCQ_SINGLE'

export interface Question {
  subject: Subject
  topic: string
  year: number
  testSlug: string
  qType: QuestionType
  questionText: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export interface TestMeta {
  slug: string
  subject: Subject
  topic: string
  year: number
  questionCount: number
  title: string
}
