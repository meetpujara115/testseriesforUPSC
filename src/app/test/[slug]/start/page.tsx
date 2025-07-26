import { getTestBySlug } from '@/lib/data'
import TestEngine from './TestEngine'

export default async function TestStart({ params }: { params: { slug: string }}) {
  const { meta, questions } = await getTestBySlug(params.slug)
  const clientQuestions = questions.map(q => ({
    questionText: q.questionText,
    choices: q.choices,
    correctIndex: q.correctIndex,
    explanation: q.explanation || ''
  }))
  return <TestEngine slug={meta.slug} meta={meta} questions={clientQuestions} />
}
